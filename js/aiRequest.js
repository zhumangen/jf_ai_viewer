function initEcharts(data) {
	var myChart = echarts.init(document.getElementById("pulmonary"));
	console.log(data);
	var option = {
		grid: {
			left: '15%'
		},		
		xAxis:[{
            type:'category',//默认为类目
            data : ["异常度","肺结核疑似度"],
            axisLine:{
            		show: false,
                lineStyle:{
                    color:'#fff',
                    type: 'dashed'
                }
            },
            axisLabel: {
            	fontSize: 14
            },
            axisTick:{  
        　　　　show: false  
        　　}  
        }],
    yAxis : [
        {
            type : 'value',//默认为值类型
            axisLine:{
                lineStyle:{
                    color:'#fff'
                }
            },
            axisTick:{  
        　　　　show:false  
        　　},
		        axisLabel: {
		        	formatter: '{value}%'
		        },
		        splitLine: {
		        	lineStyle: {
		        		type: 'dashed'
		        	}
		        },
        		min: 0,
        		max: 100 
        }
    ],
    series : [
        {
            "name":"肺结核",
            "type":"bar",
            "itemStyle": {
            	normal: {　　　　　　　　　　　　 //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                    var colorList = ['rgb(250,0,0)', 'rgb(255,255,0)'];
                    return colorList[params.dataIndex];
                }
            },
            },
            "data": data,
            "barWidth": 50,
            tooltip: {
            	show: true
            }
        }
    ]
	};
	myChart.setOption(option);	
}

function setChecked(aiResult) {
	let $ele = $(".pulmonaryInfo .partOne input");
	let $ele1 = $(".pulmonaryInfo .partTwo input");
	let $ele2 = $(".pulmonaryInfo .partThree input");
	
	for(let i = 0 ; i < $ele.length; i++){		
		if($ele.eq(i).val() == aiResult.normality.cn){			
			$ele.eq(i).attr("checked","checked");
		}
	}

	for(let j = 0 ; j < $ele1.length; j++){
		if($ele1.eq(j).val() == aiResult.tb_consistency.cn){			
			$ele1.eq(j).attr("checked","checked");
		}
	}

	for(let k = 0 ; k < $ele1.length; k++){
		if($ele2.eq(k).val() == aiResult.advice.cn){
			console.log('k',k);
			$ele2.eq(k).attr("checked","checked");
		}else{
			$ele2.eq(1).attr("checked","checked");
		}
	}
}

function aiCallback(stackIdx, aiResult) {
	console.log(aiResult);	
	$("#pulmonaryWrapper").show();
	let scoreData = [];
	scoreData.push(aiResult.abnormal_score * 100);
	scoreData.push(aiResult.tb_score * 100);
	/*// 追加图片
	let imgSrc = aiResult.url;
	$("#pulmonary").append("<img src="+imgSrc+" alt='暂无' style=' height: 300px; display: block;'>");	
	//$("#pulmonaryImg").attr('src',imgSrc);*/
	initEcharts(scoreData);

	setChecked(aiResult);

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