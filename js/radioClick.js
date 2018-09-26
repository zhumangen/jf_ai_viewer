// 那些单选按钮的点击事件
$(".pulmonaryInfo").on("click", "input[type='radio']", function() {  
  $(this).parent().addClass("radio-success")
        .siblings().removeClass("radio-success");
});

$('.form-control').on('change', function() {
  let score = $(this).val();
  if(score !== '') {
      $(this).val(score);
  }
})

$('.form-control').on('input',function(){
    let abnormalScore=$('#abnormalScore').val();
    let tbScore=$('#tbScore').val();
    let reg = /^(|0 | 100|[1-9]?\d(\.\d\d?\d?)?)$/;
    if(!reg.test(abnormalScore)){ //如果格式错误,则归为0
      if(abnormalScore!==''){
        abnormalScore=0;
        alert('输入格式不正确！');
        $("#abnormalScore").val('');
      }
    }
    if(!reg.test(tbScore)){
      if(tbScore!==''){
        tbScore=0;
        alert("输入格式不正确！");
        $("#tbScore").val('');
      }
    }
    abnormalScore=abnormalScore/100;
    tbScore=tbScore/100;
    initEcharts({abnormalScore, tbScore});
})

$("#tbConfirm").on("click", function(e) {
  e.preventDefault();
  var reg = /^(0 | 100|[1-9]?\d(\.\d\d?\d?)?)$/;
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

  forEachViewport(element => {
    const canvas = element.querySelector('canvas');
    const imageText = canvas.toDataUrl('image/png', 1);
    $.ajax({
      url: baseAiUrl + '/v2/rmis/sysop/worklist/image/text',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: {
        accessionNum,
        imageText
      },
      success: resp => { console.log('保存截图成功'); },
      error: error => { console.log('保存截图失败： '+ error); }
    });
  })

  let count = 0;
  tbData.forEach(data => {
    const thumbs = $('.csthumbnail');
    thumbs.each(idx => {
      const thumb = thumbs[idx];
      const image = cornerstone.getEnabledElement(thumb).image;
      console.log(thumb, image);
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
            console.log("data.lessions",data.lesions)
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
              console.log("count",count);
              if (count === tbData.length) {
                alert('保存成功！');
                // initEcharts({abnormalScore, tbScore});
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