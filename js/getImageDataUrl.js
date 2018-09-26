function getImageDataUrl(element) {
	const enabled = cornerstone.getEnabledElement(element);
	if (!enabled || !enabled.image) {
		console.log('invalid enabled element');
		return;
	}

	const canvas = document.createElement('canvas');
	const start = cornerstone.pixelToCanvas(element, {x: 0, y: 0});
	const end = cornerstone.pixelToCanvas(element, {x: enabled.image.width-1, y: enabled.image.height-1});

	let tmp = start.x;
	start.x = Math.round(Math.min(tmp, end.x));
	end.x = Math.round(Math.max(tmp, end.x));
	tmp = start.y;
	start.y = Math.round(Math.min(tmp, end.y));
	end.y = Math.round(Math.max(tmp, end.y));

	const width = end.x - start.x;
	const height = end.y - start.y;

	$(canvas).attr('width', width);
	$(canvas).attr('height', height);

	const ctx = enabled.canvas.getContext('2d');
	const imgData = ctx.getImageData(start.x, start.y, width, height);
	const ctx1 = canvas.getContext('2d');
	ctx1.putImageData(imgData, 0, 0);
	return canvas.toDataURL('image/png', 1);
}