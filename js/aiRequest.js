//initEcharts([0,0]);

function setId(data){
	if(0 <= data && data <= 0.05){
  	return 0;
  }else if(data <= 0.125){
  	return 1;
  }else if(data <= 0.75){
  	return 2;
  }else{
  	return 3;
  }
}

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

function aiCallback(stackIdx, aiResult) {
	console.log('airesult', aiResult);	
	var normalFlagData = aiResult.abnormal_score; // 保存正常
	var pulmTbFlagData = aiResult.tb_score; // 肺结核疑似度	

	// 判断ai是否保存过
	var baseUrl = 'http://47.100.43.165:9090'; // 部署的地址
	//var baseUrl = 'http://192.168.10.50:8080'; // 测试地址
	//var baseUrl = 'http://172.16.87.221:80'; // 文dev
	let aiDataUrl = baseUrl + '/v2/rmis/sysop/ai/plumTB/isCheck';
	let AIData = {
		accessionNum: getQueryString("accessionNum"),
		isAi: '1'
	}
	console.log('an', AIData);	
	$.ajax({
	    url: aiDataUrl,
	    dataType: "json",
	    async: false,
	    data: JSON.stringify(AIData),
	    contentType: 'application/json',
	    type: "POST",    
	    success: function(result) {
	    	console.log('res', result);
	      if(!result.data){	
	      	console.log('ai not save');
	      	// 如果是没有保存 就传数据过去	
					let saveAIURL = baseUrl + '/v2/rmis/sysop/ai/plumTB';
					let imgArr = JSON.parse(decodeURIComponent(getQueryString('objects')))[0];
					let studyUid = imgArr.StudyUid;
					let seriesUid = imgArr.SeriesUid;
					let objectUid = imgArr.ObjectUid; 
					let advice = aiResult.advice.id;
					let normalFlag = aiResult.normality.id;
					let pulmTbFlag = aiResult.tb_consistency.id;
					let extend1 = aiResult.abnormal_score; // 保存正常
					let extend2 = aiResult.tb_score; // tb
					let isAi = 1;
					let docName = 'AI';
					let accessionNum = getQueryString("accessionNum");

					let data = {
						accessionNum: accessionNum,
						advice: advice,
						docName: docName,
						isAi: isAi,
						normalFlag: normalFlag,
						objectUid: objectUid,
						pulmTbFlag: pulmTbFlag,
						seriesUid: seriesUid,
						studyUid: studyUid,
						extend1: extend1,
						extend2: extend2
					}

					$.ajax({
						url: saveAIURL,
						dataType: "json",
						async: false,
						contentType: 'application/json',
						type: "PUT",
						data: JSON.stringify(data),
						success: function(result) {
							console.log('res', result);
							if(result.code == 200){
								console.log('ai保存成功！');
							}else{
								console.log('ai保存失败！');
							}							
						},
						error: function(result){
							console.log('ai保存失败！');
						}
					})
				}
			},
	    error: function(result){
	      console.log('请求失败！');
	    }
	});	

	// 如果是已经标了的
	if(getQueryString('isMark') === 'true'){
		$("#tbForm").hide();
		$("#pulmonaryInfo").addClass("formHide");
	}else{
		$("#tbForm").show();
		$("#pulmonaryInfo").removeClass("formHide");
	}
	//if(getQueryString('isMark') === 'true'){
	  
	  // 保存按钮 去掉
	  //$("#saveBar #save").hide();
	  // 请求数据
	  //let baseUrl = 'http://47.100.43.165:9090'; // 部署的地址
	  //let baseUrl = 'http://192.168.10.50:8080'; // 测试地址
	 	//let baseUrl = 'http://172.16.87.221:80'; // 文dev	
	  let dataUrl = baseUrl + '/v2/rmis/sysop/ai/plumTB/record';	 
	 	let accessionNum = getQueryString("accessionNum");
	 	let data = {
	 		accessionNum: accessionNum
	 	}	 	
	  $.ajax({
	    url: dataUrl,
	    dataType: "json",
	    async: false,
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

				  if(getQueryString('isMark') === 'true') {
				  	// 按钮禁用 
				  	$('#tbConfirm').attr('disabled','disabled').addClass("disabled");
				  	// 取人工结果
				  	initEcharts([RGResult.extend1 * 100, RGResult.extend2 * 100]);
				  	let isNormal = RGResult.normalFlag;
					  let isTb = RGResult.pulmTbFlag;
					  let RGadvice = 	RGResult.advice;		  
					  setChecked(isNormal, $(".pulmonaryInfo .partOne input"));
					  setChecked(isTb, $(".pulmonaryInfo .partTwo input"));
					  setChecked(RGadvice, $(".pulmonaryInfo .partThree input"));
					  // $(".pulmonaryInfo .radio:not(.radio-success) input")
				   // 		.attr("disabled", "disabled")
				  	// 	.parent().addClass('disabled');
				  	$(".pulmonaryInfo .radio input")
				   		.attr("disabled", "disabled")
				  		.parent().addClass('disabled');
				  }else{
				  	// 取ai结果
				  	initEcharts([AIResult.extend1 * 100, AIResult.extend2 * 100]);
				  	let isNormal = AIResult.normalFlag;
					  let isTb = AIResult.pulmTbFlag;
					  let RGadvice = 	AIResult.advice;		  
					  setChecked(isNormal, $(".pulmonaryInfo .partOne input"));
					  setChecked(isTb, $(".pulmonaryInfo .partTwo input"));
					  setChecked(RGadvice, $(".pulmonaryInfo .partThree input"));
				  }

				  // let normalPer = AIResult.extend1 * 0.2 + setData(RGResult.normalFlag) * 0.8;
				  // let tbPer = AIResult.extend2 * 0.2 + setData(RGResult.pulmTbFlag) * 0.8;
				  // console.log(normalPer,tbPer)
				  // initEcharts([normalPer * 100, tbPer * 100]);
				  // let isNormal = RGResult.normalFlag;
				  // let isTb = RGResult.pulmTbFlag;
				  // let RGadvice = 	RGResult.advice;		  
				  // setChecked(isNormal, $(".pulmonaryInfo .partOne input"));
				  // setChecked(isTb, $(".pulmonaryInfo .partTwo input"));
				  // setChecked(RGadvice, $(".pulmonaryInfo .partThree input"));
				  // $(".pulmonaryInfo .radio:not(.radio-success) input")
				  //     .attr("disabled", "disabled")
				  //     .parent().addClass('disabled');
				}else{
					console.log('请求失败！');
				}
	      
			},
	    error: function(result){
	      console.log('请求失败！');
	    }
	  }); 
	  
	//}
	
	


	if (aiResult["reportStatus"] === 5000) {
		// let seriesList = $(studyViewerTemplate).find('.thumbnails')[0];
		// let seriesElement = $(seriesList).find('.list-group-item')[stackIdx];
		// let thumbnail = $(seriesElement).find('.div')[0];
		// console.log(thumbnail);
		let thumbnail = $('.csthumbnail')[stackIdx];
		// console.log(thumbnail);
		
		if (aiResult["detection_result"].length > 0) {

			let items = aiResult["detection_result"][0]["data"];
			items.forEach(function(item){
				let aiData = {
					element: thumbnail,
					data: item,
				};
				cornerstoneTools.ellipticalAi.addNewMeasurement(aiData);
			});

			forEachViewport(function(element){
				cornerstone.updateImage(element);
			});
		}
		
	} else {
		console.log("Invalid ai result.");
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
	// let aiObj = {
	// 	studyUid: metaData["0020000D"].Value[0],
	// 	seriesUid: metaData["0020000E"].Value[0],
	// 	instanceUid: metaData["00080018"].Value[0]
	// };

	// aiArr = [];
	// aiArr.push(aiObj);
	// let aiUrl = JSON.stringify(aiArr);
	
	let studyUid = metaData["0020000D"].Value[0];
	let seriesUid = metaData["0020000E"].Value[0];
	let imageUid = metaData["00080018"].Value[0];
	let aiStr = wadoUri + '?requestType=WADO&contentType=image/jpeg';
	aiStr += '&studyUID=' + studyUid;
	aiStr += '&seriesUID=' + seriesUid;
	aiStr += '&objectUID=' + imageUid;
	let aiUrl = encodeURIComponent(aiStr).replace(/'/g,"%27").replace(/"/g,"%22");
	aiUrl = baseAiUrl + aiUrl;

	$.ajax({
		url: aiUrl,
		dataType: "json",
		type: "GET",
		success: function(aiResult) {
			callback(stackIdx, aiResult);			
			AIFinshed(true);			
		},
		error: function(aiResult){
			AIFinshed(false);
		}
	})
}