function aiCallback(stackIdx, aiResult) {
	console.log(aiResult);

	if (aiResult["reportStatus"] === 5000) {
		// let seriesList = $(studyViewerTemplate).find('.thumbnails')[0];
		// let seriesElement = $(seriesList).find('.list-group-item')[stackIdx];
		// let thumbnail = $(seriesElement).find('.div')[0];
		// console.log(thumbnail);
		let thumbnail = $('.csthumbnail')[stackIdx];
		// console.log(thumbnail);
		
		if (aiResult["detection_result"].length > 0) {

			let items = aiResult["detection_result"][0]["data"];
			items.forEach(function(item){
				let aiData = {
					element: thumbnail,
					data: item,
				};
				cornerstoneTools.ellipticalAi.addNewMeasurement(aiData);
			});

			forEachViewport(function(element){
				cornerstone.updateImage(element);
			});
		}
		
	} else {
		console.log("Invalid ai result.");
	}
}

function aiRequest(metaData, stackIdx, callback) {
	let aiObj = {
		studyUid: metaData["0020000D"].Value[0],
		seriesUid: metaData["0020000E"].Value[0],
		instanceUid: metaData["00080018"].Value[0]
	};

	aiArr = [];
	aiArr.push(aiObj);
	let aiUrl = JSON.stringify(aiArr);
	aiUrl = encodeURIComponent(aiUrl).replace(/'/g,"%27").replace(/"/g,"%22");
	aiUrl = baseAiUrl + aiUrl;

	$.ajax({
		url: aiUrl,
		dataType: "json",
		type: "GET",
		success: function(aiResult) {
			callback(stackIdx, aiResult);
		}
	})
}