function aiCallback(stackIdx, data) {
  console.log('airesult', data);

  tbData = data.filter(item => !item.isAi);
  // 如果是已经标了的
  if(tbData.length > 0){
    $("#tbForm").hide();
    $("#pulmonaryInfo").addClass("formHide");
  }else{
    $("#tbForm").show();
    $("#pulmonaryInfo").removeClass("formHide");
    tbData = data;
  }

  tbData.forEach(data => {
    $('.csthumbnail').each((index, thumb) => {
      if (imageViewer.stacks[index].imageIds[0].indexOf(data.objectUid) >= 0) {
        data.lesions.forEach(lesion => {
          const initData = {
            element: thumb,
            data: lesion
          };
          cornerstoneTools.rectangleAi.addNewMeasurement(initData);
        });
      }
    });
  });
  
  forEachViewport(function(element){
    cornerstone.updateImage(element);
  });

  if (tbData.length > 0) {
    const echartData = {
      abnormalScore: tbData[0].abnormalScore,
      tbScore: tbData[0].tbScore,
      activeScore: tbData[0].activeScore
    }
    initEcharts(echartData);

    $("#abnormalScore").val(tbData[0].abnormalScore);
    $("#tbScore").val(tbData[0].tbScore);
    $("#activeScore").val(tbData[0].activeScore);
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
	if (tbData.length > 0) return;

  let dataUrl = baseAiUrl + '/v2/rmis/sysop/ai/record';   
  $.ajax({
    url: dataUrl,
    headers: {
      token
    },
    data: { accessionNum },
    type: "POST",    
    success: function(result) {
      if (result.data && result.data.code === 200) {
        callback(stackIdx, result.data.data);
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