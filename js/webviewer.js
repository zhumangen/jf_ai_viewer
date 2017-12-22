// Load in HTML templates
var config = {
    webWorkerPath:'lib/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration:{
         'decodeTask':{
            codecsPath:'cornerstoneWADOImageLoaderCodecs.js'
        }
    }
};
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.configure({
    beforeSend: function(xhr) {
        // Add custom headers here (e.g. auth tokens)
        // var apiKey = $('#apikey').val();
        // if(apiKey && apiKey.length) {
        //     xhr.setRequestHeader('APIKEY', apiKey);
        // }
    }
});

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.$ = $;
cornerstoneTools.external.Hammer = Hammer;

var measurementConfig = { drawHandlesOnHover: true };
cornerstoneTools.ellipticalAi.setConfiguration(measurementConfig);
cornerstoneTools.length.setConfiguration(measurementConfig);
cornerstoneTools.ellipticalRoi.setConfiguration(measurementConfig);
cornerstoneTools.rectangleRoi.setConfiguration(measurementConfig);
cornerstoneTools.angle.setConfiguration(measurementConfig);
cornerstoneTools.arrowAnnotate.setConfiguration(measurementConfig);

var showAiResult = false;

function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); return null; 
} 

var studyUid = getQueryString('studyUid');
console.log(studyUid);

if (studyUid != null && studyUid.length > 0) {
  var viewportTemplate; // the viewport template
  loadTemplate("templates/viewport.html", function(element) {
      viewportTemplate = element;
  });

  var studyViewerTemplate; // the study viewer template
  var imageViewer;
  loadTemplate("templates/studyViewer.html", function(element) {
      studyViewerTemplate = element;
      studyViewerTemplate.appendTo('#studyContainerWrapper');

      initImageViewer();
      setupButtons();

      loadStudy(studyUid);
  });
}

// Resize main
function resizeMain() {
  var height = $(window).height();
  $('#studyContainerWrapper').height(height - 72);
}


// Call resize main on window resize
$(window).resize(function() {
    resizeMain();
});
resizeMain();

// Prevent scrolling on iOS
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
});
