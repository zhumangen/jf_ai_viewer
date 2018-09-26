const toolType = 'rectangleAi';

// /////// BEGIN ACTIVE TOOL ///////
function createNewMeasurement (annoData) {
  // Create the measurement data for this tool with the end handle activated
  const measurementData = {
    visible: true,
    active: false,
    invalidated: true,
    otherData: {
      aiTbId: annoData.aiTbId,
      id: annoData.id,
      prob: annoData.prob
    },
    handles: {
      start: {
        x: annoData.xmin,
        y: annoData.ymin,
        highlight: true,
        active: false
      },
      end: {
        x: annoData.xmax,
        y: annoData.ymax,
        highlight: true,
        active: false
      },
      textBox: {
        active: false,
        hasMoved: false,
        movesIndependently: false,
        drawnIndependently: true,
        allowedOutsideImage: true,
        hasBoundingBox: true,
        aiType: annoData.type
      }
    }
  };

  return measurementData;
}

function addNewMeasurement (aiData) {
  const element = aiData.element;

  const measurementData = createNewMeasurement(aiData.data);

  // Associate this data with this imageId so we can render it and manipulate it
  cornerstoneTools.addToolState(element, toolType, measurementData);
}

// /////// END ACTIVE TOOL ///////

function pointNearTool (element, data, coords) {
  const startCanvas = cornerstone.pixelToCanvas(element, data.handles.start);
  const endCanvas = cornerstone.pixelToCanvas(element, data.handles.end);

  const rect = {
    left: Math.min(startCanvas.x, endCanvas.x),
    top: Math.min(startCanvas.y, endCanvas.y),
    width: Math.abs(startCanvas.x - endCanvas.x),
    height: Math.abs(startCanvas.y - endCanvas.y)
  };

  const distanceToPoint = cornerstoneMath.rect.distanceToPoint(rect, coords);


  return (distanceToPoint < 5);
}

// /////// BEGIN IMAGE RENDERING ///////

function onImageRendered (e) {
  const eventData = e.detail;

  // If we have no toolData for this element, return immediately as there is nothing to do
  const toolData = cornerstoneTools.getToolState(e.currentTarget, toolType);

  if (!toolData) {
    return;
  }

  const image = eventData.image;
  const element = eventData.element;
  const lineWidth = 3; // cornerstoneTools.toolStyle.getToolWidth();
  const config = cornerstoneTools.rectangleAi.getConfiguration();
  const context = eventData.canvasContext.canvas.getContext('2d');
  const seriesModule = cornerstone.metaData.get('generalSeriesModule', image.imageId);
  let modality;

  if (seriesModule) {
    modality = seriesModule.modality;
  }

  context.setTransform(1, 0, 0, 1, 0, 0);

  // If we have tool data for this element - iterate over each set and draw it
  for (let i = 0; i < toolData.data.length; i++) {
    context.save();

    const data = toolData.data[i];

    // Apply any shadow settings defined in the tool configuration
    if (config && config.shadow) {
      context.shadowColor = config.shadowColor || '#000000';
      context.shadowOffsetX = config.shadowOffsetX || 1;
      context.shadowOffsetY = config.shadowOffsetY || 1;
    }

    // Check which color the rendered tool should be
    const color = 'darkred'; // cornerstoneTools.toolColors.getColorIfActive(data.active);

    // Convert Image coordinates to Canvas coordinates given the element
    const handleStartCanvas = cornerstone.pixelToCanvas(element, data.handles.start);
    const handleEndCanvas = cornerstone.pixelToCanvas(element, data.handles.end);

    // Retrieve the bounds of the ellipse (left, top, width, and height)
    // In Canvas coordinates
    const leftCanvas = Math.min(handleStartCanvas.x, handleEndCanvas.x);
    const topCanvas = Math.min(handleStartCanvas.y, handleEndCanvas.y);
    const widthCanvas = Math.abs(handleStartCanvas.x - handleEndCanvas.x);
    const heightCanvas = Math.abs(handleStartCanvas.y - handleEndCanvas.y);

    // Draw the rectangle on the canvas
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.rect(leftCanvas, topCanvas, widthCanvas, heightCanvas);
    context.stroke();

    // If the tool configuration specifies to only draw the handles on hover / active,
    // Follow this logic
    if (config && config.drawHandlesOnHover) {
      // Draw the handles if the tool is active
      if (data.active === true) {
        cornerstoneTools.drawHandles(context, eventData, data.handles, color);
      } else {
        // If the tool is inactive, draw the handles only if each specific handle is being
        // Hovered over
        const handleOptions = {
          drawHandlesIfActive: true
        };

        cornerstoneTools.drawHandles(context, eventData, data.handles, color, handleOptions);
      }
    } else {
      // If the tool has no configuration settings, always draw the handles
      cornerstoneTools.drawHandles(context, eventData, data.handles, color);
    }

    // Define an array to store the rows of text for the textbox
    const textLines = [];
    textLines.push(data.handles.textBox.aiType);

    // If the textbox has not been moved by the user, it should be displayed on the right-most
    // Side of the tool.
    if (!data.handles.textBox.hasMoved) {
      // Find the rightmost side of the ellipse at its vertical center, and place the textbox here
      // Note that this calculates it in image coordinates
      data.handles.textBox.x = Math.max(data.handles.start.x, data.handles.end.x);
      data.handles.textBox.y = (data.handles.start.y + data.handles.end.y) / 2;
    }

    // Convert the textbox Image coordinates into Canvas coordinates
    const textCoords = cornerstone.pixelToCanvas(element, data.handles.textBox);

    // Set options for the textbox drawing function
    const options = {
      centering: {
        x: false,
        y: true
      }
    };

    // Draw the textbox and retrieves it's bounding box for mouse-dragging and highlighting
    const boundingBox = cornerstoneTools.drawTextBox(context, textLines, textCoords.x,
      textCoords.y, color, options);

    // Store the bounding box data in the handle for mouse-dragging and highlighting
    data.handles.textBox.boundingBox = boundingBox;

    // If the textbox has moved, we would like to draw a line linking it with the tool
    // This section decides where to draw this line to on the Ellipse based on the location
    // Of the textbox relative to the ellipse.
    if (data.handles.textBox.hasMoved) {
      // Draw dashed link line between tool and text

      // The initial link position is at the center of the
      // Textbox.
      const link = {
        start: {},
        end: {
          x: textCoords.x,
          y: textCoords.y
        }
      };

      // First we calculate the ellipse points (top, left, right, and bottom)
      const ellipsePoints = [{
        // Top middle point of ellipse
        x: leftCanvas + widthCanvas / 2,
        y: topCanvas
      }, {
        // Left middle point of ellipse
        x: leftCanvas,
        y: topCanvas + heightCanvas / 2
      }, {
        // Bottom middle point of ellipse
        x: leftCanvas + widthCanvas / 2,
        y: topCanvas + heightCanvas
      }, {
        // Right middle point of ellipse
        x: leftCanvas + widthCanvas,
        y: topCanvas + heightCanvas / 2
      }];

      // We obtain the link starting point by finding the closest point on the ellipse to the
      // Center of the textbox
      link.start = cornerstoneMath.point.findClosestPoint(ellipsePoints, link.end);

      // Next we calculate the corners of the textbox bounding box
      const boundingBoxPoints = [{
        // Top middle point of bounding box
        x: boundingBox.left + boundingBox.width / 2,
        y: boundingBox.top
      }, {
        // Left middle point of bounding box
        x: boundingBox.left,
        y: boundingBox.top + boundingBox.height / 2
      }, {
        // Bottom middle point of bounding box
        x: boundingBox.left + boundingBox.width / 2,
        y: boundingBox.top + boundingBox.height
      }, {
        // Right middle point of bounding box
        x: boundingBox.left + boundingBox.width,
        y: boundingBox.top + boundingBox.height / 2
      }];

      // Now we recalculate the link endpoint by identifying which corner of the bounding box
      // Is closest to the start point we just calculated.
      link.end = cornerstoneMath.point.findClosestPoint(boundingBoxPoints, link.start);

      // Finally we draw the dashed linking line
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.setLineDash([2, 3]);
      context.moveTo(link.start.x, link.start.y);
      context.lineTo(link.end.x, link.end.y);
      context.stroke();
    }

    context.restore();
  }
}
// /////// END IMAGE RENDERING ///////

// Module exports
const rectangleAi = cornerstoneTools.mouseButtonTool({
  createNewMeasurement,
  onImageRendered,
  pointNearTool,
  toolType
});

rectangleAi.addNewMeasurement = addNewMeasurement;
rectangleAi.toolType = toolType;

cornerstoneTools[toolType] = rectangleAi;