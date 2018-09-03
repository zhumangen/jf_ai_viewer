// 那些单选按钮的点击事件
$(".pulmonaryInfo").on("click", "input[type='radio']", function() {  
  $(this).parent().addClass("radio-success")
        .siblings().removeClass("radio-success");
});

$("#tbConfirm").on("click", function(e) {
  e.preventDefault();
  var reg = /^(0(\.\d+)?|1(\.0+)?)$/;
  const abnormalScore = $("#abnormalScore").val();
  const tbScore = $("#tbScore").val();
  const activeScore = $("#activeScore").val();
  if(!reg.test(abnormalScore)) {
    alert('输入格式有误！');
    $("#abnormalScore").val('');
    return;
  }
  if(!reg.test(tbScore)){
    alert('输入格式有误！');
    $("#tbScore").val('');
    return;
  }
  if(!reg.test(activeScore)){
    alert('输入格式有误！');
    $("#activeScore").val('');
    return;
  }

  let hiData = {
    normalityCode: $(".partOne .radio-success input").val(),
    tbConsistencyCode: $(".partTwo .radio-success input").val(),
    adviceCode: $(".partThree .radio-success input").val(),
    isAi: 0,
    abnormalScore,
    tbScore,
    activeScore
  }

  let count = 0;
  tbData.forEach(data => {
    const thumbs = $('.csthumbnail');
    thumbs.each(idx => {
      const thumb = thumbs[idx];
      const image = cornerstone.getEnabledElement(thumb).image;
      if (image && image.imageId.indexOf(data.objectUid) >= 0) {
        Object.assign(data, hiData);
        const toolData = cornerstoneTools.getToolState(thumb, cornerstoneTools.rectangleAi.toolType);
        data.lesions = [];
        if (toolData && toolData.data) {
          toolData.data.forEach(measurement => {
            const lesion = Object.assign({}, measurement.otherData, {
              docName,
              type: measurement.handles.textBox.aiType,
              xmin: Math.min(measurement.handles.start.x, measurement.handles.end.x),
              ymin: Math.min(measurement.handles.start.y, measurement.handles.end.y),
              xmax: Math.max(measurement.handles.start.x, measurement.handles.end.x),
              ymax: Math.max(measurement.handles.start.y, measurement.handles.end.y)
            });
            data.lesions.push(lesion);
          });
        }

        $.ajax({
          url: baseAiUrl + '/v2/rmis/sysop/ai/tb',
          type: "PUT",
          headers: {
            token,
            version
          },
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(result) {
            console.log('save: ', result);
            if(result.code === 200){
              console.log('保存成功！');
              count++;
              if (count === tbData.length) {
                alert('保存成功！');
                $("#tbForm").hide();
                $("#pulmonaryInfo").addClass("formHide");
                initEcharts({abnormalScore, tbScore, activeScore});
              }
            } else {
              allOk = false;
              console.log('保存失败：', result);
            }
          },
          error: function(result){
            allOk = false;
            console.log('保存失败：', result);
          }
        })
      }
    });
  });
})