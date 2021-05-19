import { createServer } from 'http';
import { parse } from 'querystring';
import { BCGColor, BCGDrawing, BCGFont } from '@barcode-bakery/barcode-common';
import { BCGupcext5 } from '@barcode-bakery/barcode-1d';

let defaultText = '55499';

// Loading Font
let font = new BCGFont('Arial', 18);

// The arguments are R, G, B for color.
let colorBlack = new BCGColor(0, 0, 0);
let colorWhite = new BCGColor(255, 255, 255);

let getDrawing = function (text) {
    let drawException = null,
        barcode = null;
    try {
        let code = new BCGupcext5();
        code.setScale(2); // Resolution
        code.setThickness(30); // Thickness
        code.setBackgroundColor(colorWhite); // Color of spaces
        code.setForegroundColor(colorBlack); // Color of bars
        code.setFont(font); // Font (or 0)
        code.parse(text); // Text
        barcode = code;
    } catch (exception) {
        drawException = exception;
    }

    let drawing = new BCGDrawing(barcode, colorWhite);
    if (drawException) {
        drawing.drawException(drawException);
    }

    return drawing;
};

/*
// This is how you would save to a file.
let drawing = getDrawing(defaultText);
drawing.save("image.png", BCGDrawing.ImageFormat.Png, function () {
    console.log("Done.");
});
*/

createServer(function (request, response) {
    let drawing = getDrawing(parse(request.url).query?.toString() || defaultText);
    drawing.toBuffer(BCGDrawing.ImageFormat.Png, function (err, buffer) {
        response.writeHead(200, { 'Content-Type': 'image/png' });
        response.end(buffer);
    });
}).listen(8124);
console.log('Server running at http://127.0.0.1:8124/');
