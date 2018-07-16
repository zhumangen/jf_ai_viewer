// Load JSON study information for each study
function loadStudy(studyUid) {
    

    // setup the tool buttons
    //setupButtons(studyViewer);

    // layout choose
    // $(studyViewer).find('.choose-layout a').click(onLayoutChanged);

    // Load the first series into the viewport (?)
    //var stacks = [];
    //var currentStackIndex = 0;
    var seriesIndex = imageViewer.stacks.length;

    // Get the JSON data for the selected studyId
    var metaDataUri = baseStudyUrl + studyUid + '/metadata';
    $.ajax({
        url: metaDataUri,
        headers: {
            accept: 'application/json'
        }
    }).done(function(data) {
        // data = JSON.parse(data);
        console.log(data);
        data.forEach(function(imageMeta) {
            var stack = {
                seriesDescription: '',
                stackId: 0,
                imageIds: [],
                seriesIndex: seriesIndex,
                currentImageIdIndex: 0,
                frameRate: undefined,
                metaData: imageMeta
            };

            var imageFrameUri = baseStudyUrl + studyUid + '/series/' + 
                                imageMeta["0020000E"].Value[0] + '/instances/' +
                                imageMeta["00080018"].Value[0];
            if(!(imageMeta["7FE00010"] && imageMeta["7FE00010"].BulkDataURI)) {
                imageFrameUri + '/frame/1';
            }

            var imageId = 'wadors:' + imageFrameUri;
            cornerstoneWADOImageLoader.wadors.metaDataManager.add(imageId, imageMeta);
            stack.imageIds.push(imageId);

            // Move to next series
            seriesIndex++;

            // Add the series stack to the stacks array
            imageViewer.stacks.push(stack);

        })

        // Resize the parent div of the viewport to fit the screen
        // var imageViewerElement = $(studyViewer).find('.imageViewer')[0];
        // var viewportWrapper = $(imageViewerElement).find('.viewportWrapper')[0];
        //parentDiv = $(studyViewer).find('.viewer')[0];

        //viewportWrapper.style.width = (parentDiv.style.width - 10) + "px";
        //viewportWrapper.style.height = (window.innerHeight - 150) + "px";

        // var studyRow = $(studyViewer).find('.studyRow')[0];
        // var width = $(studyRow).width();

        //$(parentDiv).width(width - 170);
        //viewportWrapper.style.width = (parentDiv.style.width - 10) + "px";
        //viewportWrapper.style.height = (window.innerHeight - 150) + "px";

        // Get the viewport elements
        // var element = $(studyViewer).find('.viewport')[0];

        // Image enable the dicomImage element
        
        //cornerstone.enable(element);

        // Get series list from the series thumbnails (?)
        var seriesList = $(studyViewerTemplate).find('.thumbnails')[0];
        imageViewer.stacks.forEach(function(stack, stackIndex) {

            // Create series thumbnail item
            let patName;
            let data = stack.metaData;
            if (data["00100010"] && data["00100010"].Value && data["00100010"].Value.length > 0) {
                patName = data["00100010"].Value[0]["Alphabetic"];
                if (data["00100010"].Value[0]["Ideographic"]) {
                    patName = data["00100010"].Value[0]["Ideographic"]
                }
            }

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

            // Enable cornerstone on the thumbnail
            cornerstone.enable(thumbnail);

            // Have cornerstone load the thumbnail image
            cornerstone.loadAndCacheImage(imageViewer.stacks[stack.seriesIndex].imageIds[0]).then(function(image) {
                if (enableAi) {
                    $("#ai .toolbar-text").html("<marquee style='width: 40px; position: absolute; left: 50%; margin-left: -20px; color: yellow'>AI处理中...</marquee>");                   
                    aiRequest(stack.metaData, stackIndex, aiCallback);
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
            $(seriesElement).on('click touchstart', function() {
              var inx = $(".imageViewer .viewportWrapper").index($(".imageViewer .viewportWrapper.selected"));                        
              useItemStack(inx, stackIndex);
            }).data('stack', stackIndex);

        });

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
        
    }).error(function(data){
        console.log('error');
        $(".imageViewer .overlay-text").remove();
        $(".viewportWrapper").append( "<div class='overlay-text'><img src='img/404.png' style='position: absolute; left: 50%; top: 50%; margin-left: -200px; margin-top: -150px;'></div>");        
    });
}
