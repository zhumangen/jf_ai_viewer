// 初始化echarts
function initEcharts(data) {
    var myChart = echarts.init(document.getElementById("pulmonary"));
    console.log(data);
    // var option = {
    //  grid: {
    //      left: '16%',
    //      top: '5%'   ,
    //      bottom: '10%',
    //      right: '5%'     

    //  },  
    //  tooltip: {
    //      show: true,
 //            trigger: 'axis',
 //            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
 //                type : 'line' ,       // 默认为直线，可选为：'line' | 'shadow'
 //                show: false
 //            },
 //            formatter: function(params){         
 //             return params[0].name + ": " + params[0].data.toFixed(2) + "%"
 //            }
 //        },   
 //     xAxis:[{
 //            type:'category',//默认为类目
 //            data : ["异常度","肺结核疑似度"],
 //            axisLine:{
 //                 show: false,
 //                lineStyle:{
 //                    color:'#3870a9',
 //                    type: 'dotted'
 //                }
 //            },
 //            axisLabel: {
 //             fontSize: 16,
 //             fontWeight: 'bold',
 //             color: '#52a5f7',
 //             fontFamily: 'Microsoft YaHei'
 //            },
 //            axisTick:{  
 //        　　　　show: false  
 //        　　}  
 //        }],
 //        yAxis : [
 //            {
 //                type : 'value',//默认为值类型
 //                axisLine:{
 //                    lineStyle:{
 //                        color:'#3971a9'
 //                    }
 //                },
 //                axisTick:{  
 //            　　　　show:false  
 //            　　},
 //                 axisLabel: {
 //                     formatter: '{value}%',
 //                     fontSize: 16,
 //                     color: '#52a5f7',
 //                 fontFamily: 'Arial'
 //                 },
 //                 splitLine: {
 //                     lineStyle: {
 //                         type: 'dotted',
 //                         color: '#3870a9'
 //                     }
 //                 },
 //                 axisPointer: {
 //                     label: "aaaa"
 //                 },
 //                 min: 0,
 //                 max: 100 
 //            }
 //        ],
 //        series : [
 //            {
 //                "name":"肺结核",
 //                "type":"bar",
 //                "itemStyle": {
 //                 normal: {　　　　　　　　　　　　 //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
 //                    color: function(params) {
 //                        /*var colorList = [colorData, colorData1];*/
 //                        var colorList = colorData(data);
 //                        return colorList[params.dataIndex];
 //                    }
 //                },
 //                },
 //                "data": data,
 //                "barWidth": 56           
 //            }
 //        ]
    // };

    var option = {
        grid: {
         left: '16%',
         top: '12%'   ,
         bottom: '16%',
         right: '16%'
        }, 
        tooltip: {
            trigger: 'item',
            formatter: function(data) {
                let arr = data.seriesName.split(',');
                return '肺结核' + '<br><span style="display: inline-block;margin-right: 5px;border-radius: 10px;width: 9px;height: 9px;background-color:' + data.color +'"></span>' + arr[data.dataIndex] + ': ' + data.value;
            }
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 1],
            axisLabel: {
             fontSize: 16,
             color: '#3870a9',
             fontFamily: 'Microsoft YaHei'
            },
        },
        yAxis: [
            {
                type: 'category',
                data: ['陈旧', '正常', '正常'],
                axisLabel: {
                 fontSize: 16,
                 color: '#fff',
                 fontFamily: 'Microsoft YaHei'
                },
                
            },
            {
                type: 'category',
                data: ['活动', '结核', '异常'],
                axisLabel: {
                 fontSize: 16,
                 color: '#fff',
                 fontFamily: 'Microsoft YaHei'
                },
            }
        ],
        series:[{
            name: '稳定性,疑似度,异常度',
            type: 'bar',
            data: [0.2, 0.6, 0.3],
            itemStyle: {
                normal: {
                    barBorderRadius: [15, 15, 15, 15],
                    color: '#4ad2ff'
                }
            },
            barWidth: 20
        }]
    };

    myChart.setOption(option);  
    resize(myChart);
}   

// 用来调配颜色的
function colorData(data) {
    var colorDataList = ["#fbb1bf","#ff8ba1","#fd6683","#ff385e","#ff0000"];
    var colorDataList1 = ["#f98a9f","#fa6380","#fb395e","#f32135","#d91729"];
    var colorData,colorData1,color = [];

    if(data[0] > 80){
        colorData = colorDataList[4];
    }else if(data[0] > 60){
        colorData = colorDataList[3];
    }else if(data[0] > 40){
        colorData = colorDataList[2];
    }else if(data[0] > 20){
        colorData = colorDataList[1];
    }else{
        colorData = colorDataList[0];
    }

    if(data[1] > 80){
        colorData1 = colorDataList1[4];
    }else if(data[1] > 60){
        colorData1 = colorDataList1[3];
    }else if(data[1] > 40){
        colorData1 = colorDataList1[2];
    }else if(data[1] > 20){
        colorData1 = colorDataList1[1];
    }else{
        colorData1 = colorDataList1[0];
    }

    color.push(colorData);
    color.push(colorData1);

    return color;
}

// 响应式
function resize(echart) {
    window.onresize = function() {
        echart.resize();
    }
}

// 获取数据设置为选中状态
function setChecked(data, ele){
    for(let i = 0 ; i < ele.length; i++){
        console.log('是否正常id', ele.eq(i).val(), data);
        if(ele.eq(i).val() == data){ 
            ele.eq(i).parent().addClass("radio-success")
               .siblings().removeClass("radio-success");
        }
    }
}

// 查找url信息
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}


// 设置下面框的高度
// var h = $("#tbForm").outerHeight(true);
// h += 72;
// console.log(h);
// var t = "calc(60% - "+ h +"px)";
// $("#pulmonaryInfo").css("height", t);