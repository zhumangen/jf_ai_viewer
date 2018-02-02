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
        if (imageViewer.viewports.length > 0)
            cornerstoneTools.saveAs(imageViewer.viewports[0], randomString());
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
        $('#vReverse').trigger('click');
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
        disableAllTools();
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            // Toggle invert
            if (viewport.invert === true) {
                viewport.invert = false;
            } else {
                viewport.invert = true;
            }
            cornerstone.setViewport(element, viewport);
        });
    })

    // WW/WL
    $('#enableWindowLevelTool').on('click touchstart', function() {
        activate('#enableWindowLevelTool')
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.wwwc.activate(element, 1);
            cornerstoneTools.wwwcTouchDrag.activate(element);
        });
    });

    // Zoom
    $('#zoom').on('click touchstart', function() {
        activate('#zoom');
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.zoom.activate(element, 5); // 5 is right mouse button and left mouse button
            cornerstoneTools.zoomTouchDrag.activate(element);
        });
    });

    // Pan
    $('#pan').on('click touchstart', function() {
        activate('#pan');
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.pan.activate(element, 3); // 3 is middle mouse button and left mouse button
            cornerstoneTools.panTouchDrag.activate(element);
        });
    });

    // Length measurement
    $('#enableLength').on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.length.activate(element, 1);
        });
    });

    // Angle measurement
    $('#angle').on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.angle.activate(element, 1);
        });
    });

    // Pixel probe
    $('#probe').on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.probe.activate(element, 1);
        });
    });

    // Elliptical ROI
    $('#circleroi').on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.ellipticalRoi.activate(element, 1);
        });
    });

    // Rectangle ROI
    $('#rectangleroi').on('click touchstart', function() {
        disableAllTools();
        forEachViewport(function (element) {
            cornerstoneTools.rectangleRoi.activate(element, 1);
        });
    });

    $("#head").click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 1600;
            viewport.voi.windowCenter = 450;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#cspine').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 4000;
            viewport.voi.windowCenter = 700;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#lung').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 1000;
            viewport.voi.windowCenter = -650;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#mediastinum').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 350;
            viewport.voi.windowCenter = 40;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#abdomen').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 1500;
            viewport.voi.windowCenter = -700;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#liver').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 400;
            viewport.voi.windowCenter = 40;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#joint').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 1600;
            viewport.voi.windowCenter = 550;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#vessel').click(function() {
        forEachViewport(function(element) {
            var viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth = 500;
            viewport.voi.windowCenter = 40;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#hReverse').click(function(e) { // 水平翻转
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
        forEachViewport(function(element) {
            let viewport = cornerstone.getViewport(element);
            viewport.hflip = !viewport.hflip;
            cornerstone.setViewport(element, viewport);
        })
        
    });
    $('#vReverse').click(function(e) { // 垂直翻转
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
        forEachViewport(function(element) {
            let viewport = cornerstone.getViewport(element);
            viewport.vflip = !viewport.vflip;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#reset').click(function(e) { // 重置
        activate('#reset');
        forEachViewport(function(element) {
            cornerstone.reset(element);
        })
    });

    $('#lrotate').click(function(e) { // 左旋        
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }
        forEachViewport(function(element) {
            let viewport = cornerstone.getViewport(element);
            viewport.rotation -= 90;
            cornerstone.setViewport(element, viewport);
        })
    });

    $('#rrotate').click(function(e) { // 右旋  
        if(e && e.stopPropagation){
            e.stopPropagation();
        }else{
            window.event.cancelBubble = true;
        }      
        forEachViewport(function(element) {
            let viewport = cornerstone.getViewport(element);
            viewport.rotation += 90;
            cornerstone.setViewport(element, viewport);
        })
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
        disableAllTools();
        forEachViewport(function(element) {
            cornerstoneTools.arrowAnnotate.activate(element, 1);
            cornerstoneTools.arrowAnnotateTouch.activate(element);
        });
    });

    $('#clearToolData').click(function() { // 清除所有标记
        forEachViewport(function(element) {
            var toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
            toolStateManager.clear(element);
            cornerstone.updateImage(element);
        });
    });
};