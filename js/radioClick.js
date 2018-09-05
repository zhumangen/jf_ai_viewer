// 那些单选按钮的点击事件
$(".pulmonaryInfo").on("click", "input[type='radio']", function() {  
  $(this).parent().addClass("radio-success")
        .siblings().removeClass("radio-success");
});

$('.form-control').on('change', function() {
  let score = $(this).val();
  if(score !== '') {
    if(score.indexOf('%') == -1) {
      score = score + '%';
    }
  }
})
$("#tbConfirm").on("click", function(e) {
  e.preventDefault();
  var reg = /^(100|[1-9]?\d(\.\d\d?\d?)?)%$|0$/;
  let abnormalScore = $("#abnormalScore").val();
  let tbScore = $("#tbScore").val();
  if(!reg.test(abnormalScore)) {
    alert('输入格式有误！');
    $("#abnormalScore").val('');
    return;
  }else {
    abnormalScore = toPercent(abnormalScore);
  }
  if(!reg.test(tbScore)){
    alert('输入格式有误！');
    $("#tbScore").val('');
    return;
  }else {
    tbScore = toPercent(tbScore)
  }
  let hiData = {
    normalityCode: $(".partOne .radio-success input").val(),
    tbConsistencyCode: $(".partTwo .radio-success input").val(),
    adviceCode: $(".partThree .radio-success input").val(),
    isAi: 0,
    abnormalScore,
    tbScore
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
                initEcharts({abnormalScore, tbScore});
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
// 将百分数转换成小数
function toPercent(percent) {
  var str = percent.replace('%', '');
  return str = str / 100;
}