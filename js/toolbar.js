loadTemplate("templates/toolbar.html", function(element) {
  element.appendTo('#toolbarWrapper');
  // open local files
    $('#uploadFile').on('change', function(e) {
        var files = e.target.files;
        loadLocalImages(files);
    })

    $('#logOut').on('click touchstart', function() {
        if(window.confirm("确定退出吗?", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
        })) {
            window.location.href = "about:blank";
            window.close();
        }
    })
})