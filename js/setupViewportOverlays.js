function setupViewportOverlays(element, data) {
    var parent = $(element).parent();

    // Get the overlays
    var childDivs = $(parent).find('.overlay');
    var topLeft = $(childDivs[0]).find('div');
    var topRight = $(childDivs[1]).find('div');
    var bottomLeft = $(childDivs[2]).find('div');
    var bottomRight = $(childDivs[3]).find('div');

    

    // On new image (displayed?)
    function onNewImage(e, eventData) {
        // If we are currently playing a clip then update the FPS
        // Get the state of the 'playClip tool'
        // var playClipToolData = cornerstoneTools.getToolState(element, 'playClip');

        // If playing a clip ...
        // if (playClipToolData !== undefined && playClipToolData.data.length > 0 && playClipToolData.data[0].intervalId !== undefined && eventData.frameRate !== undefined) {

        //     // Update FPS
        //     $(bottomLeft[0]).text("FPS: " + Math.round(eventData.frameRate));
        //     console.log('frameRate: ' + e.frameRate);

        // } else {
        //     // Set FPS empty if not playing a clip
        //     if ($(bottomLeft[0]).text().length > 0) {
        //         $(bottomLeft[0]).text("");
        //     }
        // }

        var toolData = cornerstoneTools.getToolState(element, 'stack');
        if(toolData === undefined || toolData.data === undefined || toolData.data.length === 0) {
            return;
        }
        var stack = toolData.data[0];

        // Update Image number overlay
        $(topRight[0]).text("图像：# " + (stack.currentImageIdIndex + 1) + "/" + stack.imageIds.length);

        var data = stack.metaData;
        // Set the overlay text
        if (data) {
            if (data["00100010"] && data["00100010"].Value && data["00100010"].Value.length > 0) {
                let patName = data["00100010"].Value[0]["Alphabetic"];
                if (data["00100010"].Value[0]["Ideographic"]) {
                    patName = data["00100010"].Value[0]["Ideographic"]
                }
                $(topLeft[0]).text(patName);
            }
            if (data["00101010"] && data["00101010"].Value) {
                $(topLeft[1]).text(data["00101010"].Value[0]);
            }
            if (data["00100040"] && data["00100040"]) {
                $(topLeft[2]).text(data["00100040"].Value[0]);
            }
            if (data["00200011"] && data["00200011"].Value) {
                $(topRight[1]).text("序列：" + data["00200011"].Value[0]);
            }
            if (data["00180015"] && data["00180015"].Value) {
                $(topRight[2]).text(data["00180015"].Value[0]);
            }
            if (data["00080070"] && data["00080070"].Value) {
                $(bottomLeft[2]).text(data["00080070"].Value[0]);
            }
            // if (data["00180060"] && data["00181151"] && data["00181150"]) {
            //     $(bottomRight[0]).text(data["00180060"].Value[0] + "kV " + data["00181151"].Value[0] + "mA " + data["00181150"].Value[0] + "mS");
            // }
            if (data["00080022"] && data["00080022"].Value && data["00080032"] && data["00080032"].Value) {
                $(bottomRight[1]).text(data["00080022"].Value[0] + " " + data["00080032"].Value[0]);
            }
            if (data["00080080"] && data["00080080"].Value) {
                $(bottomRight[2]).text(data["00080080"].Value[0]);
            }
        }
    }
    // Add a CornerstoneNewImage event listener on the 'element' (viewer) (?)
    $(element).on("cornerstonenewimage", onNewImage);


    // On image rendered
    function onImageRendered(e, eventData) {
		eventData = e.detail;
        // Set zoom overlay text
        $(bottomLeft[0]).text("Zoom:" + eventData.viewport.scale.toFixed(2));
        // Set WW/WL overlay text
        $(bottomLeft[1]).text("WW/WL:" + Math.round(eventData.viewport.voi.windowWidth) + "/" + Math.round(eventData.viewport.voi.windowCenter));
        // Set render time overlay text
        // $(bottomLeft[1]).text("Render Time:" + eventData.renderTimeInMs + " ms");
    }
    // Add a CornerstoneImageRendered event listener on the 'element' (viewer) (?)
    $(element).on("cornerstoneimagerendered", onImageRendered);


}