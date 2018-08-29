// 那些单选按钮的点击事件
$(".pulmonaryInfo").on("click", "input[type='radio']", function() {  
  $(this).parent().addClass("radio-success")
        .siblings().removeClass("radio-success");
});

$("#tbConfirm").on("click", function(e) {
  e.preventDefault();
  var reg = /^(0.\d+|0|1)$/;
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

  let data = {
    normalityCode: $(".partOne .radio-success input").val(),
    tbConsistencyCode: $(".partTwo .radio-success input").val(),
    adviceCode: $(".partThree .radio-success input").val(),
    isAi: 0,
    abnormalScore,
    tbScore,
    activeScore
  }

  console.log('data', data);
  $.ajax({
    url: saveUrl,
    type: "PUT",
    data: JSON.stringify(data),
    success: function(result) {
      console.log('save', result);
      if(result.code == 200){
        console.log('人工保存成功！');
        alert('保存成功！');
        $('#tbConfirm').attr('disabled','disabled'); // 禁用  
        $(".pulmonaryInfo .radio input")
           .attr("disabled", "disabled")
          .parent().addClass('disabled');      

        // 重新渲染数据
        initEcharts([RGData.extend1 * 100, RGData.extend2 * 100]);
        let isNormal = RGData.normalFlag;
        let isTb = RGData.pulmTbFlag;
        let RGadvice =   RGData.advice;      
        setChecked(isNormal, $(".pulmonaryInfo .partOne input"));
        setChecked(isTb, $(".pulmonaryInfo .partTwo input"));
        setChecked(RGadvice, $(".pulmonaryInfo .partThree input"));
      } else {
        console.log('保存失败：', result);
      }
    },
    error: function(result){
      console.log('保存失败：', result);
    }
  })
})