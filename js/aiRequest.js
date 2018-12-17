function aiCallback(stackIdx, data) {
  console.log('airesult', data);

  $("#loadingUI.waiting").hide();
  $("#pulmonaryWrapper .tub").show();
  tbData = data.filter(item => !item.isAi);
  // 如果是已经标了的
  console.log("data",tbData.length)
  if(tbData.length == 0){
    tbData = data;
  }
  tbData.forEach(data => {
    const thumbs = $('.csthumbnail');
    thumbs.each(idx => {
      const thumb = thumbs[idx];
      const image = cornerstone.getEnabledElement(thumb).image;
      if (image && image.imageId.indexOf(data.objectUid) >= 0) {
        if(data.lesion){
          data.lesions.forEach(lesion => {
            const initData = {
              element: thumb,
              data: lesion
            };
            cornerstoneTools.rectangleAi.addNewMeasurement(initData);
          });
        }
      }
    });
  });
  
  forEachViewport(function(element){
    cornerstone.updateImage(element);
  });

  console.log("tbDataLength",tbData.length)
  if (tbData.length > 0) {
    const echartData = {
      abnormalScore: tbData[0].abnormalScore,
      tbScore: tbData[0].tbScore,
      //activeScore: tbData[0].activeScore
    }
    console.log("tbData9999",tbData[0]);
    initEcharts(echartData);
    $("#abnormalScore").val(tbData[0].abnormalScore.toFixed(2)*100);
    $("#tbScore").val(tbData[0].tbScore.toFixed(2)*100);
    //$("#activeScore").val(tbData[0].activeScore.toFixed(2));
    setChecked(tbData[0].normalityCode, $(".pulmonaryInfo .partOne input"));
    setChecked(tbData[0].tbConsistencyCode, $(".pulmonaryInfo .partTwo input"));
    setChecked(tbData[0].adviceCode, $(".pulmonaryInfo .partThree input"));
  }
}

function AIFinshed(status){  
  if(status){
    // al deal success
    $("#ai .toolbar-text").html("<span style='color: green;'>成功</span>");    
  }else{
    // al deal fail
    $("#ai .toolbar-text").html("<span style='color: red;'>失败</span>");
  }
  setTimeout(function(){
    // anyway show AI after 3s
    $("#ai .toolbar-text").html("AI");
  },3000);
}

function aiRequest(metaData, stackIdx, callback) {
  let dataUrl = baseAiUrl + '/v2/rmis/apply/report/webviewer/getAIInfo/' + accessionNum; 
  $.ajax({
    url: dataUrl,
    headers: {
      token,
      version
    },
    type: "get",
    dataType: 'json',
    contentType: 'application/json',
    success: function(result) {
      if (result.code === 200) {
        callback(stackIdx, result.data);
        AIFinshed(true);
      } else {
        console.log("error: ", result);
      }
      
    },
    error: function(err){
      console.log("error: ", err);
      AIFinshed(false);
    }
  }); 
}
