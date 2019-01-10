// 初始化echarts
function initEcharts(datas) {
    var myChart = echarts.init(document.getElementById("pulmonary"));
    console.log(datas);
 
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
                return '<span style="display: inline-block;margin-right: 5px;border-radius: 10px;width: 9px;height: 9px;background-color:' + data.color +'"></span>' + arr[data.dataIndex] + ': ' + data.value + '%';
            }
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
             fontSize: 16,
             color: '#3870a9',
             fontFamily: 'Microsoft YaHei'
            },
        },
        yAxis: [
            {
                type: 'category',
                data: ['正常', '正常'],
                axisLabel: {
                 fontSize: 16,
                 color: '#fff',
                 fontFamily: 'Microsoft YaHei'
                },
                
            },
            {
                type: 'category',
                data: ['结核', '异常'],
                axisLabel: {
                 fontSize: 16,
                 color: '#fff',
                 fontFamily: 'Microsoft YaHei'
                },
            }
        ],
        series:[{
            name: '疑似度,异常度',
            type: 'bar',
            data: [datas.tbScore, datas.abnormalScore],
            itemStyle: {
                normal: {
                    barBorderRadius: [15, 15, 15, 15],
                    color: '#4ad2ff'
                }
            },
            barWidth: 20
        }, {
            name: '',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            data: [100, 100],
            tooltip:{
                formatter:function(){
                    return ''
                }
            },
            barWidth: 22,
            itemStyle: {
                normal: {
                    color: 'none',
                    borderColor: '#00c1de',
                    borderWidth: 2,
                    barBorderRadius: 15,
                }
            }
        }]
    };

    myChart.setOption(option);
    resize(myChart);
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
        if(ele.eq(i).val() == data){ 
            ele.eq(i).parent().addClass("radio-success")
               .siblings().removeClass("radio-success");
        }
    }
}