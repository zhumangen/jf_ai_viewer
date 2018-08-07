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


$("#tbConfirm").on("click", function(e) {
	e.preventDefault();
	var reg = /^(0.\d+|0|1)$/;
	if($("#extend1").val() !== ''){
		if(!reg.test($("#extend1").val()) ){
			alert('输入格式有误！');
			$("#extend1").val('');			
			return;
		}
	}
	if($("#extend2").val() !== ''){
		if(!reg.test($("#extend2").val())){
			alert('输入格式有误！');
			$("#extend2").val('');
			return;
		}
	}
	
	var baseUrl = 'http://47.100.43.165:9090'; // 部署的地址	
	//let baseUrl = 'http://192.168.10.50:8080'; // 测试地址
	//let baseUrl = 'http://172.16.87.221:80'; // 文dev	
	let aiDataUrl = baseUrl + '/v2/rmis/sysop/ai/plumTB/record';	
	var normalFlagData, pulmTbFlagData;
	let AIData = {
		accessionNum: getQueryString("accessionNum")
	}
	$.ajax({
	    url: aiDataUrl,
	    dataType: "json",
	    data: JSON.stringify(AIData),
	    contentType: 'application/json',
	    type: "POST",    
	    success: function(result) {
	    	console.log('res', result);	 
	    	result.data.forEach((val,index) => {	
	    		if(val.isAi == 1){ // 取ai结果
	    			normalFlagData = val.extend1;
	    			pulmTbFlagData = val.extend2;
	    		}
			  });  

	    	console.log(normalFlagData, pulmTbFlagData);
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
				let extend1 = $("#extend1").val();
				let extend2 = $("#extend2").val();
				if(extend1 == ''){
					extend1 = normalFlagData;
				}
				if(extend2 == ''){
					extend2 = pulmTbFlagData;
				}


				let data = {
					accessionNum: accessionNum,
					advice: adviceVal,
					docName: docName,
					isAi: 0,
					normalFlag: isNormalVal,
					pulmTbFlag: isTbVal,
					objectUid: objectUid,
					seriesUid: seriesUid,
					studyUid: studyUid,
					extend1: extend1,
					extend2: extend2
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
								$('#tbConfirm').attr('disabled','disabled').addClass("disabled"); // 禁用	
								$(".pulmonaryInfo .radio input")
				   				.attr("disabled", "disabled")
				  				.parent().addClass('disabled');							
							}else{
								console.log('人工保存失败！');
							}
							
						},
						error: function(result){
							console.log('人工保存失败！');
						}
				})

			},
	    error: function(result){
	      console.log('请求失败！');
	    }
	});	

		
	// let saveUrl = baseUrl + '/v2/rmis/sysop/ai/plumTB';
	// let imgArr = JSON.parse(decodeURIComponent(getQueryString('objects')))[0];
	// let docName = getQueryString("docName");
	// let accessionNum = getQueryString("accessionNum");
	// let isNormalVal = $(".partOne .radio-success input").val();
	// let isTbVal = $(".partTwo .radio-success input").val();
	// let adviceVal = $(".partThree .radio-success input").val();
	// let studyUid = imgArr.StudyUid;
	// let seriesUid = imgArr.SeriesUid;
	// let objectUid = imgArr.ObjectUid;
	// let extend1 = $("#extend1").val();
	// let extend2 = $("#extend2").val();



	// if(extend1 == ''){
	// 	extend1 = sessionStorage.getItem('normalFlagData');
	// }

	// if(extend2 == ''){
	// 	extend2 = sessionStorage.getItem('pulmTbFlagData');
	// }

	
	//let baseUrl = 'http://47.100.43.165:8090'; // 部署的地址	  	

	// let data = {
	// 	accessionNum: accessionNum,
	// 	advice: adviceVal,
	// 	docName: docName,
	// 	isAi: 0,
	// 	normalFlag: isNormalVal,
	// 	pulmTbFlag: isTbVal,
	// 	objectUid: objectUid,
	// 	seriesUid: seriesUid,
	// 	studyUid: studyUid,
	// 	extend1: extend1,
	// 	extend2: extend2
	// }

	// console.log('data', data);
	// $.ajax({
	// 		url: saveUrl,
	// 		dataType: "json",
	// 		contentType: 'application/json',
	// 		type: "PUT",
	// 		data: JSON.stringify(data),					
	// 		success: function(result) {
	// 			console.log('save', result);
	// 			if(result.code == 200){
	// 				console.log('人工保存成功！');
	// 				alert('保存成功！');
	// 				$('#saveBar #save').prop('disabled',true).addClass("disabled"); // 禁用
	// 				$('#saveBar #save').hide(); // 隐藏
	// 			}else{
	// 				console.log('人工保存失败！');
	// 			}
				
	// 		},
	// 		error: function(result){
	// 			console.log('人工保存失败！');
	// 		}
	// })
})