// For Develop
var wadoUri = 'http://47.100.43.165/v1/picl/aets/piclarc/wado';
var wadoRs = '/pacs/rs';
//var wadoRs = '/v1/picl/aets/piclarc/rs';
var baseAiUrl = 'http://101.132.45.197:8310';
var baseStudyUrl = wadoRs + '/studies/';

var tbData = [];

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

var showAiResult = false;
var enableAi = getQueryString('ai') === 'on';
var token = getQueryString('token');
var accessionNum = getQueryString('accessionNum');
var version = getQueryString('version');
var docName = getQueryString('docName');

if (window.location.protocol == "https:") {
  if (baseStudyUrl.substr(0, 1) !== '/') {
    baseStudyUrl = baseStudyUrl.replace('http:', 'https:');
  }

  if (baseAiUrl.substr(0, 1) !== '/') {
    baseAiUrl = baseAiUrl.replace('http:', 'https:');
  }

  enableAi = false;
}

// load templates
var viewportTemplate; // the viewport template
var studyViewerTemplate; // the study viewer template
var imageViewer;

loadTemplate("templates/viewport.html", function(element) {
  viewportTemplate = element;

  loadTemplate("templates/studyViewer.html", function(element) {
  studyViewerTemplate = element;
  studyViewerTemplate.appendTo('#studyContainerWrapper');

  // thumbnail position
  function changePosition() {
    if($(window).height() > $(window).width()){
    $(".thumbnailSelector").addClass('thumbnailSelector1');
    $(".viewer").addClass("viewer1").css("height", $(window).height() - 72 - 123 - 16);              
    }else{
    $(".thumbnailSelector").removeClass('thumbnailSelector1');
    $(".viewer").removeClass("viewer1").css("height",$(window).height() - 72);             
    }
  }  
  changePosition();
  $(window).resize(function() {      
    changePosition();
  });

  initImageViewer();
  setupButtons();

  if (enableAi && getQueryString('ai') === 'on') {
    $('#ai').click();
  }
  
  let studyUid = getQueryString('studyUid');
  let imageArrStr = getQueryString('objects');  
  if (studyUid !== null && studyUid !== '') {
    loadStudy(studyUid);
  } else if (imageArrStr !== null && imageArrStr !== '') {
    loadImages(imageArrStr);
  }

  });
});


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
