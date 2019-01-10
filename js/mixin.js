function activate(id) {
    $('div').removeClass('active');
    $(id).addClass('active');
}

function fullScreen() { // 全屏展示
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
    if(typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if(typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if(wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function randomString(len) {　　
    len = len || 32;　　
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;　　
    var pwd = '';　　
    for(i = 0; i < len; i++) {　　　　
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
    }　　
    return pwd;
}

function initImageViewer() {
    imageViewer = new ImageViewer(studyViewerTemplate, viewportTemplate);
    imageViewer.setLayout('1 X 1'); // default layout
    initViewports();
    // Call resize viewer on window resize
    $(window).resize(function() {
        resizeStudyViewer();
    });
    resizeStudyViewer();
}

function onLayoutChanged() {
    var previousUsed = [];
    imageViewer.forEachElement(function(el, vp, i){
        if (!isNaN($(el).data('useStack'))) {
            previousUsed.push($(el).data('useStack'));
        }
    });

    var type = $(this).text();
    imageViewer.setLayout(type);
    initViewports();
    resizeStudyViewer();
    if (previousUsed.length > 0) {
        previousUsed = previousUsed.slice(0, imageViewer.viewports.length);
        var item = 0;
        previousUsed.forEach(function(v){
            useItemStack(item++, v);
        });
    }

    //return false;
}

function initViewports() {
    imageViewer.forEachElement(function(el) {
        cornerstone.enable(el);
        $(el).droppable({
            drop : function(evt, ui) {
                var fromStack = $(ui.draggable.context).data('stack'), toItem = $(this).data('index');
                useItemStack(toItem, fromStack);
            }
        });
    });       
}

function updateImageProgress(eventData) {
    // console.log(eventData);
    let iStacks = imageViewer.stacks;
    let i = 0;
    for (; i < iStacks.length; ++i) {
        if (iStacks[i].imageIds[0] === eventData.imageId) {
            let bar = $('.progressBar')[i];
            bar.style.width = eventData.percentComplete;
            break;
        }
    }
}

function useItemStack(item, stack) {
    var imageId = imageViewer.stacks[stack].imageIds[0], element = imageViewer.getElement(item);
    if ($(element).data('waiting')) {
        imageViewer.viewports[item].find('.overlay-text').remove();
        $(element).data('waiting', false);
    }
    $(element).data('useStack', stack);
    $(element).find('img').removeClass('hide');

    var seriesList = $(studyViewerTemplate).find('.thumbnails')[0];
    displayThumbnail(seriesList, $(seriesList).find('.list-group-item')[stack], element, imageViewer.stacks[stack], function(el, stack){
        if (!$(el).data('setup')) {
            $(el).find('img').addClass('hide');
            setupViewport(el, stack, this);
            setupViewportOverlays(el, stack.metaData);
            $(el).data('setup', true);

            if (showAiResult) {
                cornerstoneTools.ellipticalAi.deactivate(el);
            }
        }
    });
    /*cornerstone.loadAndCacheImage(imageId).then(function(image){
        setupViewport(element, imageViewer.stacks[stack], image);
        setupViewportOverlays(element, data);
    });*/
}

// Resize study viewer
function resizeStudyViewer() {
    var studyRow = $(studyViewerTemplate).find('.studyContainer')[0];
    // var mainDiv = document.getElementById('main');
    // var studyContainerDiv = document.getElementById('studyContainerWrapper');
    // $(studyContainerWrapper).height($(mainDiv).height() - 72);
    // console.log($(mainDiv).height());
    // console.log($(studyContainerWrapper).height());
    // var studyRowHeight = $(mainDiv).height() - 70;
    $(studyRow).height("100%");
    //var height = $(studyRow).height();
    //var width = $(studyRow).width();console.log($(studyRow).innerWidth(),$(studyRow).outerWidth(),$(studyRow).width());
    //$(seriesList).height("100%");
    //$(parentDiv).width(width - $(studyViewer).find('.thumbnailSelector:eq(0)').width());
    //$(parentDiv).css({height : '100%'});
    //$(imageViewerElement).css({height : $(parentDiv).height() - $(parentDiv).find('.text-center:eq(0)').height()});
    //$(imageViewerElement).css({height:'100%'});
    var imageViewerElement = $(studyViewerTemplate).find('.imageViewer')[0];
    $(imageViewerElement).width($(studyRow).width() - $(studyViewerTemplate).find('.thumbnailSelector:eq(0)').width());

    imageViewer.forEachElement(function(el, vp) {
        cornerstone.resize(el, true);

        if ($(el).data('waiting')) {
            var ol = vp.find('.overlay-text');
            if (ol.length < 1) {
                ol = $('<div class="overlay overlay-text">拖动缩略图到这儿</div>').appendTo(vp);
            }
            var ow = vp.width() / 2, oh = vp.height() / 2;
            ol.css({top : oh, left : ow - (ol.width() / 2)}); 
        }
    });
}