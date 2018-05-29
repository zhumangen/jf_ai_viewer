function saveAs(type, element) {
    let stacks = [];
    if (!!element) {
        if (currentStackIndex < imageViewer.stacks.length)
            stacks.push(imageViewer.stacks[currentStackIndex]);
    } else {
        for (let i = 0; i < imageViewer.stacks.length; ++i) {
            stacks.push(imageViewer.stacks[i]);
        }
    }
    
    let idx = 0;
    let timer = setInterval(() => {
        if (idx >= stacks.length) {
            clearInterval(timer);
            return;
        }
        
        let stack = stacks[idx++];
        let metaData = stack.metaData;
        if (!metaData) return;
        let studyUid = metaData["0020000D"].Value[0];
        let seriesUid = metaData["0020000E"].Value[0];
        let imageUid = metaData["00080018"].Value[0];
        let imageId = wadoUri
        const lnk = document.createElement('a');
        if (type === 'dcm') {
            imageId += '?requestType=WADO&contentType=application/dicom';
            lnk.download = imageUid + '.dcm';
        } else {
            imageId += '?requestType=WADO&contentType=image/' + type;
            lnk.download = imageUid + '.' + type;
        }
        
        imageId += '&studyUID=' + studyUid;
        imageId += '&seriesUID=' + seriesUid;
        imageId += '&objectUID=' + imageUid;
        
        lnk.href = imageId;
        if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            lnk.dispatchEvent(e);
        } else if (lnk.fireEvent) {
            lnk.fireEvent('onclick');
        }
    }, 300);
}