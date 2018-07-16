// 用来获取地址栏的信息
/*function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}*/


// 那些单选按钮的点击事件
$(".pulmonaryInfo").on("click", "input[type='radio']", function() {	
	$(this).parent().addClass("radio-success")
				.siblings().removeClass("radio-success");
});

function setData(id){
	// 判断数据
	if(id == 0){
		return (Math.random() * 50) / 1000;
	}
	if(id == 1){
		return (Math.random() * 75 + 50) / 1000;
	}
	if(id == 2){
		return (Math.random() * 625 + 125) / 1000;
	}
	if(id == 3){		
		return (Math.random() * 250 + 750) / 1000;
	}
}

// 如果是已经标了的
	if(getQueryString('isMark') === 'true'){		
		// 保存按钮 去掉
	  $("#saveBar #save").hide();
	  // 请求数据
	  let baseUrl = 'http://47.100.43.165:9090'; // 部署的地址
	  let dataUrl = baseUrl + '/v2/rmis/sysop/ai/plumTB/record';
	 	let accessionNum = getQueryString("accessionNum");
	 	let data = {
	 		accessionNum: accessionNum
	 	}	
	 	$.ajax({
	    url: dataUrl,
	    dataType: "json",
	    contentType: 'application/json',
	    data: JSON.stringify(data),
	    type: "POST",    
	    success: function(result) {
	    	console.log('record', result);
	    	if(result.code == 200){
	    		$("#pulmonaryWrapper .tub").show();	
				  $("#loadingUI.waiting").hide();
				  var AIResult = {};
				  var RGResult = {};
				  result.data.forEach((val,index) => {			  			  	
				  	if(val.isAi == 0){
				  		// 不是ai			  		
				  		RGResult = val; // 人工结果
				  	}else{
				  		// ai
				  		AIResult = val; // AI结果
				  	}
				  });
				  console.log(AIResult, RGResult);

				  let normalPer = setData(RGResult.normalFlag);
				  let tbPer =setData(RGResult.pulmTbFlag);
				  console.log(normalPer,tbPer)
				  initEcharts([normalPer * 100, tbPer * 100]);
				  let isNormal = RGResult.normalFlag;
				  let isTb = RGResult.pulmTbFlag;
				  let RGadvice = 	RGResult.advice;		  
				  setChecked(isNormal, $(".pulmonaryInfo .partOne input"));
				  setChecked(isTb, $(".pulmonaryInfo .partTwo input"));
				  setChecked(RGadvice, $(".pulmonaryInfo .partThree input"));
				  $(".pulmonaryInfo .radio:not(.radio-success) input")
				      .attr("disabled", "disabled")
				      .parent().addClass('disabled');
				}else{
					console.log('请求失败！');
				}
	      
			},
	    error: function(result){
	      console.log('请求失败！');
	    }
	  });
	}

// 点击保存 
$("#saveBar #save").on("click", function() {		
	let baseUrl = 'http://47.100.43.165:9090'; // 部署的地址	
	//let baseUrl = 'http://192.168.10.50:8080'; // 测试地址
	//let baseUrl = 'http://172.16.87.221:80'; // 文dev		
	let saveUrl = baseUrl + '/v2/rmis/sysop/ai/plumTB';
	let imgArr = JSON.parse(decodeURIComponent(getQueryString('objects')))[0];
	let docName = getQueryString("docName");
	let accessionNum = getQueryString("accessionNum");
	let isNormalVal = $(".partOne .radio-success input").val();
	let isTbVal = $(".partTwo .radio-success input").val();
	let adviceVal = $(".partThree .radio-success input").val();
	let studyUid = imgArr.StudyUid;
	let seriesUid = imgArr.SeriesUid;
	let objectUid = imgArr.ObjectUid;

	if(!(isNormalVal && isTbVal && adviceVal)){
			alert('请您完所有选项！');
	}else{	
			//let baseUrl = 'http://47.100.43.165:8090'; // 部署的地址	  	

			let data = {
				accessionNum: accessionNum,
				advice: adviceVal,
				docName: docName,
				isAi: 0,
				normalFlag: isNormalVal,
				pulmTbFlag: isTbVal,
				objectUid: objectUid,
				seriesUid: seriesUid,
				studyUid: studyUid
			}

			console.log('data', data);
			$.ajax({
					url: saveUrl,
					dataType: "json",
					contentType: 'application/json',
					type: "PUT",
					data: JSON.stringify(data),					
					success: function(result) {
						console.log('save', result);
						if(result.code == 200){
							console.log('人工保存成功！');
							alert('保存成功！');
							$('#saveBar #save').prop('disabled',true).addClass("disabled"); // 禁用
							$('#saveBar #save').hide(); // 隐藏
							initEcharts([setData(isNormalVal * 100), setData(isTbVal * 100)]);
						}else{
							console.log('人工保存失败！');
						}
						
					},
					error: function(result){
						console.log('人工保存失败！');
					}
				})
			//initEcharts([40,60]);
	}

	

	
})