// Load JSON study information for each study
function loadImages(imageArrStr) {
    
    var seriesIndex = imageViewer.stacks.length;
    var seriesList = $(studyViewerTemplate).find('.thumbnails')[0];
    var count = 0;

    // Get the JSON data for the selected studyId
    let imageArr = JSON.parse(decodeURIComponent(imageArrStr));
    if ($.isEmptyObject(imageArr)) {
        $(".imageViewer .overlay-text").remove();
        $(".viewportWrapper").append( "<div class='overlay-text'><img src='img/404.png' style='position: absolute; left: 50%; top: 50%; margin-left: -200px; margin-top: -150px;'></div>");
    } else {
        imageArr.forEach(function(imageUids) {
            let imageUri = baseStudyUrl + imageUids["StudyUid"] + '/series/' +
                           imageUids["SeriesUid"] + '/instances/' + imageUids["ObjectUid"]
            let metaDataUri = imageUri + '/metadata';
            $.ajax({
                url: metaDataUri,
                headers: {
                    accept: 'application/json'
                }
            }).done(function(imageMeta) {
                imageMeta = imageMeta[0];
                var stack = {
                    seriesDescription: '',
                    stackId: 0,
                    imageIds: [],
                    seriesIndex: seriesIndex,
                    currentImageIdIndex: 0,
                    frameRate: undefined,
                    metaData: imageMeta
                };

                var imageFrameUri = imageUri;
                if(!(imageMeta["7FE00010"] && imageMeta["7FE00010"].BulkDataURI)) {
                    imageFrameUri += '/frame/1';
                }

                var imageId = 'wadors:' + imageFrameUri;
                cornerstoneWADOImageLoader.wadors.metaDataManager.add(imageId, imageMeta);
                stack.imageIds.push(imageId);

                
                // Add the series stack to the stacks array
                imageViewer.stacks.push(stack);
                
                // Create series thumbnail item
                let patName;
                let data = stack.metaData;
                if (data["00100010"] && data["00100010"].Value && data["00100010"].Value.length > 0) {
                    patName = data["00100010"].Value[0]["Alphabetic"];
                    if (data["00100010"].Value[0]["Ideographic"]) {
                        patName = data["00100010"].Value[0]["Ideographic"]
                    }
                }

                // control form status by verWorkStation
                if(statusCode =='100607' || statusCode =='100608' || statusCode == '100609'
                  || orgVer == '103101'){
                    $('#tbForm').css("display","none");
                    $('.radio input[type = "radio"]').attr("disabled",true);
                }
                if(window.name == 'newwindow3' || window.name == 'newwindow2'){ //if historyReport display imgUrl
                    $('#imgUrl').css("display","none");
                    $('#tbForm').css("display","none");
                    $('.radio input[type = "radio"]').attr("disabled",true);
                }
                //默认第一张贴图
                getImgUrls(0);

                var seriesEntry = '<a class="list-group-item" style="position: relative"' +
                    'oncontextmenu="return false"' +
                    'unselectable="on"' +
                    'onselectstart="return false;"' +
                    'onmousedown="return false;"><img class="loading" src="img/image_spin.svg" width=50 height= 50 style="position: absolute; left: 50%; top: 25%; margin-left: -25px;">' +
                    '<div class="csthumbnail"' +
                    'oncontextmenu="return false"' +
                    'unselectable="on"' +
                    'onselectstart="return false;"' +
                    'onmousedown="return false;"></div>' +
                    '<div class="progressBarContainer hide">' +
                    '<div class="progressBar" style="width:0%;"></div></div>' +  
                    "<div class='text-center small'>" +
                    patName +
                    '</div></a>';

                // Add to series list
                var seriesElement = $(seriesEntry).appendTo(seriesList);

                // Find thumbnail
                var thumbnail = $(seriesElement).find('div')[0];

                //左边栏绑定点击事件,并且给好贴图的路径
                $('.csthumbnail').on('click',function(){
                        let idx=$('.csthumbnail').index(this);
                        console.log('idx',idx);
                        getImgUrls(idx);
                })

                // Enable cornerstone on the thumbnail
                cornerstone.enable(thumbnail);

                // Have cornerstone load the thumbnail image
                cornerstone.loadAndCacheImage(stack.imageIds[0]).then(function(image) {
                    if (enableAi) {
                        $("#ai .toolbar-text").html("<marquee style='width: 40px; position: absolute; left: 50%; margin-left: -20px; color: yellow'>AI处理中...</marquee>");  
                        count++;
                        if (count === imageArr.length) {
                            aiRequest(stack.metaData, stackIndex, aiCallback);
                        }
                    }

                    // Make the first thumbnail active
                    if (stack.seriesIndex === 0) {
                        $(seriesElement).addClass('active');
                    }
                    // Display the image
                    cornerstone.displayImage(thumbnail, image);
                    $(seriesElement).find('.loading').remove();
                    $(seriesElement).draggable({helper: "clone"});
                });

                // Handle thumbnail click
                {
                    var stackIndex = seriesIndex;
                    $(seriesElement).on('click touchstart', function() {
                        var inx = $(".imageViewer .viewportWrapper").index($(".imageViewer .viewportWrapper.selected"));                        
                        useItemStack(inx, stackIndex);
                    }).data('stack', stackIndex);
                }
                
                // Move to next series
                seriesIndex++;
                
                // beauty scroll
                // scroll change at different size
                function changeScroll() {
                    if($(window).height() > $(window).width()){                    
                        $(".thumbnails").mCustomScrollbar("destroy");           
                        $(".thumbnails").mCustomScrollbar({
                            axis:"x",
                            theme:"light-3",
                            advanced:{autoExpandHorizontalScroll:true}
                        });
                    }else{                 
                        $(".thumbnails").mCustomScrollbar("destroy");
                        $(".thumbnails").mCustomScrollbar();
                    }
                }
                changeScroll();
                $(window).resize(function() {
                    changeScroll();
                });
        
            if (imageViewer.isSingle())
                useItemStack(0, 0);
                
            }).error(function(data) {
                // log error out. 
                console.log(data);
            });
        });
    }
}

//get the images urls by the imageArr
function getImgUrls(index){
    smallImgUrl='';
    let item=imageViewer.stacks[index].metaData;//imageViewer.stacks[0].metaData["0020000D"].Value[0]
    smallImgUrl=baseAiUrl + '/v1/picl/aets/piclarc/wado?requestType=WADO&contentType=image/jpeg&studyUID='+
    item["0020000D"].Value[0] + '&seriesUID='+item["0020000E"].Value[0] +'&objectUID=' +item["00080018"].Value[0];
}
