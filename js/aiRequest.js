function initEcharts(data,colorData) {
	var myChart = echarts.init(document.getElementById("pulmonary"));
	console.log(data);
	var option = {
		grid: {
			left: '16%',
			top: '5%'	,
			bottom: '10%',
			right: '5%'		

		},	
		tooltip: {
				show: true,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'line' ,       // 默认为直线，可选为：'line' | 'shadow'
            show: false
        },
        formatter: function(params){
        	console.log(params);
        	return params[0].name + ": " + params[0].data.toFixed(2) + "%"
        }
    },	
		xAxis:[{
            type:'category',//默认为类目
            data : ["异常度","肺结核疑似度"],
            axisLine:{
            		show: false,
                lineStyle:{
                    color:'#3870a9',
                    type: 'dotted'
                }
            },
            axisLabel: {
            	fontSize: 16,
            	fontWeight: 'bold',
            	color: '#52a5f7',
            	fontFamily: 'Microsoft YaHei'
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
                    color:'#3971a9'
                }
            },
            axisTick:{  
        　　　　show:false  
        　　},
		        axisLabel: {
		        	formatter: '{value}%',
		        	fontSize: 16,
		        	color: '#52a5f7',
            	fontFamily: 'Arial'
		        },
		        splitLine: {
		        	lineStyle: {
		        		type: 'dotted',
		        		color: '#3870a9'
		        	}
		        },
		        axisPointer: {
		        	label: "aaaa"
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
                    /*var colorList = [colorData, colorData1];*/
                    var colorList = colorData;
                    return colorList[params.dataIndex];
                }
            },
            },
            "data": data,
            "barWidth": 56           
        }
    ]
	};

	myChart.setOption(option);	
	resize(myChart);
}

	/*var colorDataList = ["#fbb1bf","#ff8ba1","#fd6683","#ff385e","#ff0000"];
	var colorDataList1 = ["#f98a9f","#fa6380","#fb395e","#fd2851","#ff0e3c"];	
	var scoreData = [50,90];
	var colorData,colorData1,color = [];

	// 单颜色
	if(scoreData[0] > 80){
		colorData = colorDataList[4];
	}else if(scoreData[0] > 60){
		colorData = colorDataList[3];
	}else if(scoreData[0] > 40){
		colorData = colorDataList[2];
	}else if(scoreData[0] > 20){
		colorData = colorDataList[1];
	}else{
		colorData = colorDataList[0];
	}

	if(scoreData[1] > 80){
		colorData1 = colorDataList1[4];
	}else if(scoreData[1] > 60){
		colorData1 = colorDataList1[3];
	}else if(scoreData[1] > 40){
		colorData1 = colorDataList1[2];
	}else if(scoreData[1] > 20){
		colorData1 = colorDataList1[1];
	}else{
		colorData1 = colorDataList1[0];
	}

	color.push(colorData);
	color.push(colorData1);*/

	// 渐变色
	/*if(scoreData > 80){
		colorData = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colorDataList[4]
                    }, {
                        offset: 0.25,
                        color: colorDataList[3]
                    }, {
                        offset: 0.5,
                        color: colorDataList[2]
                    }, {
                        offset: 0.75,
                        color: colorDataList[1]
                    }, {
                        offset: 1,
                        color: colorDataList[0]
                    }]);
	}else if(scoreData > 60){
		colorData = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colorDataList[3]
                    }, {
                        offset: 0.33,
                        color: colorDataList[2]
                    }, {
                        offset: 0.66,
                        color: colorDataList[2]
                    }, {
                        offset: 1,
                        color: colorDataList[1]
                    }]);
	}else if(scoreData > 40){
		colorData = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colorDataList[2]
                    }, {
                        offset: 0.5,
                        color: colorDataList[1]
                    }, {
                        offset: 1,
                        color: colorDataList[0]
                    }]);
	}else if(scoreData > 20){
		colorData = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colorDataList[1]
                    }, {
                        offset: 1,
                        color: colorDataList[0]
                    }]);
	}else{
		colorData = colorDataList[0];
	}*/
/*$("#loadingUI.waiting").hide();	
initEcharts(scoreData,color);*/

function setChecked(aiResult) {
	let $ele = $(".pulmonaryInfo .partOne input");
	let $ele1 = $(".pulmonaryInfo .partTwo input");
	let $ele2 = $(".pulmonaryInfo .partThree input");
	
	for(let i = 0 ; i < $ele.length; i++){
		console.log('是否正常id', $ele.eq(i).val(), aiResult.normality.id);
		if($ele.eq(i).val() == aiResult.normality.id){			
			$ele.eq(i).attr("checked","checked");
			$ele.eq(i).parent().addClass("radio-success").siblings().removeClass("radio-success");
		}
	}

	for(let j = 0 ; j < $ele1.length; j++){
		console.log('是否符合肺TB胸片表现id', $ele1.eq(j).val(), aiResult.tb_consistency.id);
		if($ele1.eq(j).val() == aiResult.tb_consistency.id){			
			$ele1.eq(j).attr("checked","checked");	
			$ele1.eq(j).parent().addClass("radio-success").siblings().removeClass("radio-success");		
		}
	}

	for(let k = 0 ; k < $ele2.length; k++){
		console.log('建议id', $ele2.eq(k).val(), aiResult.advice.id);
		if($ele2.eq(k).val() == aiResult.advice.id){			
			$ele2.eq(k).attr("checked","checked");
			$ele2.eq(k).parent().addClass("radio-success").siblings().removeClass("radio-success");
		}
	}
}

function resize(echart) {
	window.onresize = function() {
		echart.resize();
	}
}

function aiCallback(stackIdx, aiResult) {
	console.log(aiResult);
	$("#loadingUI.waiting").hide();	
	$("#pulmonaryWrapper .tub").show();
	let scoreData = [];
	scoreData.push(aiResult.abnormal_score * 100);
	scoreData.push(aiResult.tb_score * 100);
	/*// 追加图片
	let imgSrc = aiResult.url;
	$("#pulmonary").append("<img src="+imgSrc+" alt='暂无' style=' height: 300px; display: block;'>");	
	//$("#pulmonaryImg").attr('src',imgSrc);*/

	console.log('scoreData', scoreData);
	var colorDataList = ["#fbb1bf","#ff8ba1","#fd6683","#ff385e","#ff0000"];
	var colorDataList1 = ["#f98a9f","#fa6380","#fb395e","#fd2851","#ff0e3c"];
	var colorData,colorData1,color = [];

	if(scoreData[0] > 80){
		colorData = colorDataList[4];
	}else if(scoreData[0] > 60){
		colorData = colorDataList[3];
	}else if(scoreData[0] > 40){
		colorData = colorDataList[2];
	}else if(scoreData[0] > 20){
		colorData = colorDataList[1];
	}else{
		colorData = colorDataList[0];
	}

	if(scoreData[1] > 80){
		colorData1 = colorDataList1[4];
	}else if(scoreData[1] > 60){
		colorData1 = colorDataList1[3];
	}else if(scoreData[1] > 40){
		colorData1 = colorDataList1[2];
	}else if(scoreData[1] > 20){
		colorData1 = colorDataList1[1];
	}else{
		colorData1 = colorDataList[0];
	}

	color.push(colorData);
	color.push(colorData1);

	initEcharts(scoreData,color);

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