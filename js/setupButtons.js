function setupButtons() {
    // Tool button event handlers that set the new active tool
    $('#toolbar').find('.choose-layout a').click(onLayoutChanged);

    $('#imageLayout').on('click touchstart', function() {
        activate('#imageLayout');
    })

    $('#openFile').on('click touchstart', function() {
        activate('#openFile');
    })

    $('#saveImage').on('click touchstart', function() {
        activate('#saveImage');
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        cornerstoneTools.saveAs($ele, randomString());
        return false;
    })

    $('#marker').on('click touchstart', function() {
        activate('#marker');
    })

    $('#toolbar').find('div').click(function() {
        $('#toolbar').find('div').not($(this)).find('ul').hide();       
        if($(this).find('ul').css('display') == 'none'){
            $(this).find('ul').show();
        }else{
            $(this).find('ul').hide();
        }           
    })  

    $('#rotation').click(function() { // 旋转
        activate("#rotation");
        $(this).find('ul').hide();         
        $('#rrotate').trigger('click');
    });

    $('#rotation').find('.caret').click(function(e){  
        $('#toolbar').find('div').not($(this).parent().parent()).find('ul').hide();
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }             
        if($('#rotation').find('ul').css('display') == 'none'){
            $('#rotation').find('ul').show();
        }else{
            $('#rotation').find('ul').hide();
        }         
    })

    $(document).click(function() {
        $('#toolbar').find('ul').hide();
    })     


    $('#reverse').on('click touchstart', function() {
        activate('#reverse');
        $(this).find('ul').hide();         
        $('#hReverse').trigger('click');
    })

    $('#reverse').find('.caret').click(function(e){
        $('#toolbar').find('div').not($(this).parent().parent()).find('ul').hide();
        if($('#reverse').find('ul').css('display') == 'none'){
            $('#reverse').find('ul').show();
        }else{
            $('#reverse').find('ul').hide();
        }      
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }            
    })

    $('#preSearch').on('click touchstart', function() {
        activate('#preSearch');
    })

    $('#nextSearch').on('click touchstart', function() {
        activate('#nextSearch');
    })

    $('#about').on('click touchstart', function() {
        activate('#about');
    })

    $('#fullScreen').on('click touchstart', function() {
        activate('#fullScreen');
        fullScreen();
    })

    $('#invert').on('click touchstart', function() {
        activate('#invert');
        
        // 给选中的设置负相
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        var viewport = cornerstone.getViewport($ele);
        if(viewport){ // 如果有图像的时候
            // Toggle invert
            viewport.invert = !viewport.invert;
            cornerstone.setViewport($ele, viewport);
        }
    })

    // WW/WL
    $('#enableWindowLevelTool').on('click touchstart', function() {
        $(this).find('ul').hide();  
        activate('#enableWindowLevelTool')
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.wwwcRegion.activate($ele, 1);
        cornerstoneTools.wwwcRegionTouch.activate($ele);
   
    });

    $('#enableWindowLevelTool .caret').on('click touchstart', function(e) {
        $('#toolbar').find('div').not($(this).parent().parent()).find('ul').hide();
        if($('#enableWindowLevelTool').find('ul').css('display') == 'none'){
            $('#enableWindowLevelTool').find('ul').show();
        }else{
            $('#enableWindowLevelTool').find('ul').hide();
        }      
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }   
    })

    // Zoom
    $('#zoom').on('click touchstart', function() {
        activate('#zoom');
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.zoom.activate($ele, 1);
        cornerstoneTools.zoomTouchDrag.activate($ele);
    });

    // Pan
    $('#pan').on('click touchstart', function() {
        activate('#pan');
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.pan.activate($ele, 1);           
        cornerstoneTools.panTouchDrag.activate($ele);
    });

    // Length measurement
    $('#enableLength').on('click touchstart', function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.length.activate($ele, 1);
    });

    // Angle measurement
    $('#angle').on('click touchstart', function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.angle.activate($ele, 1);
    });

    // Pixel probe
    $('#probe').on('click touchstart', function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.probe.activate($ele, 1);
    });

    // Elliptical ROI
    $('#circleroi').on('click touchstart', function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.ellipticalRoi.activate($ele, 1);
    });

    // Rectangle ROI
    $('#rectangleroi').on('click touchstart', function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.rectangleRoi.activate($ele, 1);
    });

    $("#head").click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 1600;
            viewport.voi.windowCenter = 450;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#cspine').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 4000;
            viewport.voi.windowCenter = 700;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#lung').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 1000;
            viewport.voi.windowCenter = -650;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#mediastinum').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 350;
            viewport.voi.windowCenter = 40;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#abdomen').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 1500;
            viewport.voi.windowCenter = -700;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#liver').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 400;
            viewport.voi.windowCenter = 40;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#joint').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 1600;
            viewport.voi.windowCenter = 550;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#vessel').click(function() {
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);
        if (viewport) {
            viewport.voi.windowWidth = 500;
            viewport.voi.windowCenter = 40;
            cornerstone.setViewport($ele, viewport);
        }
    });

    $('#hReverse').click(function(e) { // 水平翻转        
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }

        // 选中时进行水平翻转
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);  
        if(viewport){ // 如果有图像的时候  
            if(viewport.rotation == 90 || viewport.rotation == 270){
                viewport.vflip = !viewport.vflip;
            }else{
                viewport.hflip = !viewport.hflip;
            }            
            cornerstone.setViewport($ele, viewport);
        }
    });
    
    $('#vReverse').click(function(e) { // 垂直翻转       
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
        // 选中时进行垂直翻转
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        let viewport = cornerstone.getViewport($ele);  
        if(viewport)  {  // 如果有图像的时候
            if(viewport.rotation == 90 || viewport.rotation == 270){
                viewport.hflip = !viewport.hflip;
            }else{
                viewport.vflip = !viewport.vflip;
            }                    
            cornerstone.setViewport($ele, viewport);
        }      
    });

    $('#reset').click(function(e) { // 重置
        activate('#reset');
        // 给选中设置重置
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        cornerstone.reset($ele);
        disableTools($ele);
        cornerstoneTools.wwwcRegion.activate($ele, 1);
        cornerstoneTools.wwwcRegionTouch.activate($ele);
    });

    $('#lrotate').click(function(e) { // 左旋        
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
        // 给选中的设置左旋
        let $ele = $('.viewportWrapper.selected .viewport').get(0);               
        let viewport = cornerstone.getViewport($ele);        
        if(viewport){ // 如果有图像的时候
            viewport.rotation -= 90;  
            cornerstone.setViewport($ele, viewport);
        }                  
    });

    $('#rrotate').click(function(e) { // 右旋  
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
        //  给选中的设置右旋 
        let $ele = $('.viewportWrapper.selected .viewport').get(0);     
        let viewport = cornerstone.getViewport($ele);
        if(viewport){ // 如果有图像的时候
            viewport.rotation += 90;
            cornerstone.setViewport($ele, viewport);
        }        
    });

    $('#ai').click(function() { // AI
        activate("#ai");
        
        if (enableAi) {
            if(showAiResult){
                $('#ai a i').removeClass("glyphicon glyphicon-eye-open");
                $('#ai a i').addClass("glyphicon glyphicon-eye-close");
                showAiResult = false;
                forEachViewport(function(element) {
                    cornerstoneTools.ellipticalAi.disable(element);
                    cornerstone.updateImage(element);
                })
            } else {
                $('#ai a i').removeClass("glyphicon glyphicon-eye-close");
                $('#ai a i').addClass("glyphicon glyphicon-eye-open");
                showAiResult = true;
                forEachViewport(function(element) {
                    cornerstoneTools.ellipticalAi.deactivate(element);
                    cornerstone.updateImage(element);
                })
            }
        }
    });

    activate("#enableWindowLevelTool");

    var annotationDialog = document.querySelector('.annotationDialog');
    var relabelDialog = document.querySelector('.relabelDialog');
    dialogPolyfill.registerDialog(annotationDialog);
    dialogPolyfill.registerDialog(relabelDialog);

    function getTextCallback(doneChangingTextCallback) { // 获取文本标注
        var annotationDialog = $('.annotationDialog');
        var getTextInput = annotationDialog.find('.annotationTextInput');
        var confirm = annotationDialog.find('.annotationDialogConfirm');
        annotationDialog.get(0).showModal();
        confirm.off('click');
        confirm.on('click', function() {
            closeHandler();
        });
        annotationDialog.off("keydown");
        annotationDialog.on('keydown', keyPressHandler);

        function keyPressHandler(e) { // 关闭dialog
            if(e.which === 13) {
                closeHandler();
            }
        }

        function closeHandler() {
            annotationDialog.get(0).close();
            doneChangingTextCallback(getTextInput.val());
            getTextInput.val("");
        }
    }

    function changeTextCallback(data, eventData, doneChangingTextCallback) { // 输入文本
        var relabelDialog = $('.relabelDialog');
        var getTextInput = relabelDialog.find('.annotationTextInput');
        var confirm = relabelDialog.find('.relabelConfirm');
        var remove = relabelDialog.find('.relabelRemove');
        getTextInput.val(data.annotationText);
        relabelDialog.get(0).showModal();
        confirm.off('click');
        confirm.on('click', function() {
            relabelDialog.get(0).close();
            doneChangingTextCallback(data, getTextInput.val());
        });
        remove.off('click'); // 删除文本标注
        remove.on('click', function() {
            relabelDialog.get(0).close();
            doneChangingTextCallback(data, undefined, true);
        });
        relabelDialog.off("keydown");
        relabelDialog.on('keydown', keyPressHandler);

        function keyPressHandler(e) {
            if(e.which === 13) {
                closeHandler();
            }
        }

        function closeHandler() {
            relabelDialog.get(0).close();
            doneChangingTextCallback(data, getTextInput.val());
            getTextInput.val("");
        }
    }

    var configImg = {
        minScale: 0.01,
        maxScale: 50.0,
        preventZoomOutsideImage: true,
        getTextCallback: getTextCallback,
        changeTextCallback: changeTextCallback,
        drawHandles: false,
        drawHandlesOnHover: true,
        arrowFirst: true
    };
    cornerstoneTools.zoom.setConfiguration(configImg);
    cornerstoneTools.arrowAnnotate.setConfiguration(configImg);

    $('#markerText').click(function() { // 文本标注
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        disableTools($ele);
        cornerstoneTools.arrowAnnotate.activate($ele, 1);
        cornerstoneTools.arrowAnnotateTouch.activate($ele);
    });

    $('#clearToolData').click(function() { // 清除所有标记
        let $ele = $('.viewportWrapper.selected .viewport').get(0);
        var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
        toolStateManager.clear($ele);
        cornerstone.updateImage($ele);
    });

    $('#imgUrl').click(()=>{ //贴图报告
        let dataUrl=smallImgUrl;
        let apiUrl=baseAiUrl + '/v2/rmis/apply/report/webviewer/picture';
        $.ajax({
            url:apiUrl,
            headers: {
                token,
                version
            },
            type:'POST',
            dataType: 'json',
            data:JSON.stringify({
                dataUrl,
                accessionNum
            }),
            contentType: 'application/json',
            success:function(result){
                if(result.code === 200){
                    if(result.data.code == '1000'){ //if success , green message
                        $('#alert div').css({"backgroundColor":"green"});
                        $('#alert div i').css({"color":"green","borderColor":"green"})
                    }else{
                        $('#alert div').css({"backgroundColor":"red"});
                        $('#alert div i').css({"color":"red","borderColor":"red"})
                    }
                    $('#alert div p').text(result.data.msg);
                        $('#alert').css({"display":"block"})
                        setTimeout(()=>{
                            $('#alert').css({"display":"none"})
                        },2000);
                }
            },
            error:function(result){
                $('#alert div p').text('接口调用失败！');
                $('#alert').css({"display":"block"})
                setTimeout(()=>{
                    $('#alert').css({"display":"none"})
                },2000)
            }
        })
    })
};