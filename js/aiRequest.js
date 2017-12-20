function aiCallback(stackIdx, aiResult) {
	console.log(aiResult);

	if (aiRequest["reportStatus"] === 5000) {
		imageViewer.stacks[stackIdx].aiData = aiResult["detection_result"];
	} else {
		console.log("Invalid ai result.");
	}
}

function aiRequest(metaData, stackIdx, callback) {
	let baseUrl = "/ai?wado=";
	let aiObj = {
		studyUid: metaData["0020000D"].Value[0],
		seriesUid: metaData["0020000E"].Value[0],
		instanceUid: metaData["00080018"].Value[0]
	};

	aiArr = [];
	aiArr.push(aiObj);
	let aiUrl = JSON.stringify(aiArr);
	aiUrl = encodeURIComponent(aiUrl).replace(/'/g,"%27").replace(/"/g,"%22");
	aiUrl = baseUrl + aiUrl;

	$.ajax({
		url: aiUrl,
		dataType: "json",
		type: "GET",
		success: function(aiResult) {
			callback(stackIdx, aiResult);
		}
	})
}