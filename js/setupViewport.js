function setupViewport(element, stack, image) {
    // Display the image on the viewer element
    cornerstone.displayImage(element, image);

    $(element).find('.loading').remove();

    // 如果是还未标的时候
    if(getQueryString('isMark') === 'false'){
      $("#loadingUI.waiting").hide();
      $("#pulmonaryWrapper .tub").show();
      //initEcharts([0,0]);
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
                  let RGadvice =    RGResult.advice;          
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
    
    // If it's a movie (has frames), then play the clip
    if (stack.frameRate !== undefined) {
        cornerstone.playClip(element, stack.frameRate);
    }

    // Activate mouse clicks, mouse wheel and touch
    cornerstoneTools.mouseInput.enable(element);
    cornerstoneTools.mouseWheelInput.enable(element);
    cornerstoneTools.touchInput.enable(element);

    // Enable all tools we want to use with this element
    cornerstoneTools.wwwc.activate(element, 4); // ww/wc is the default tool for right mouse button
    cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
    //cornerstoneTools.zoom.activate(element, 1); // zoom is the default tool for right mouse button
    cornerstoneTools.zoomWheel.activate(element, 2);
    cornerstoneTools.probe.deactivate(element, 1); 
    cornerstoneTools.length.deactivate(element, 1);
    cornerstoneTools.ellipticalRoi.deactivate(element, 1);
    cornerstoneTools.rectangleRoi.deactivate(element, 1);
    cornerstoneTools.angle.deactivate(element, 1);
    cornerstoneTools.arrowAnnotate.deactivate(element, 1);
    cornerstoneTools.wwwcTouchDrag.activate(element);
    cornerstoneTools.zoomTouchPinch.activate(element);
    cornerstoneTools.wwwcRegion.activate(element, 1);

    // Stack tools
    cornerstoneTools.addStackStateManager(element, ['playClip']);
    cornerstoneTools.addToolState(element, 'stack', stack);
    cornerstoneTools.stackScrollWheel.activate(element);
    cornerstoneTools.stackPrefetch.enable(element);

}
