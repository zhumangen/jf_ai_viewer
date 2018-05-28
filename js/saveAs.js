function saveAs(element, fileName, type) {
    if (currentStackIndex < imageViewer.stacks.length) {
        let metaData = imageViewer.stacks[currentStackIndex].metaData;
        if (!metaData) return;
        let studyUid = metaData["0020000D"].Value[0];
        let seriesUid = metaData["0020000E"].Value[0];
        let imageUid = metaData["00080018"].Value[0];
        let imageId = wadoUri
        if (type === 'dcm') {
            imageId += '?requestType=WADO&contentType=application/dicom';
        } else if (!!type) {
            imageId += '?requestType=WADO&contentType=image/' + type;
        }
        imageId += '&studyUID=' + studyUid;
        imageId += '&seriesUID=' + seriesUid;
        imageId += '&objectUID=' + imageUid;
        window.open(imageId);
        /*
        const lnk = document.createElement('a');
        lnk.download = fileName;
        lnk.href = imageId;
        
        if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            lnk.dispatchEvent(e);
        } else if (lnk.fireEvent) {
            lnk.fireEvent('onclick');
        }
        */
    }
}