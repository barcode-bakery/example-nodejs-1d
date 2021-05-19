﻿import { createServer } from 'http';
import { parse } from 'querystring';
import { BCGColor, BCGDrawing, BCGFont } from '@barcode-bakery/barcode-common';
import { BCGcode128 } from '@barcode-bakery/barcode-1d';

let defaultText = 'a123';

// Loading Font
let font = new BCGFont('Arial', 18);

// The arguments are R, G, B for color.
let colorBlack = new BCGColor(0, 0, 0);
let colorWhite = new BCGColor(255, 255, 255);

let getDrawing = function (text) {
    let drawException = null,
        barcode = null;
    try {
        let code = new BCGcode128();
        code.setScale(2); // Resolution
        code.setThickness(30); // Thickness
        code.setBackgroundColor(colorWhite); // Color of spaces
        code.setForegroundColor(colorBlack); // Color of bars
        code.setFont(font); // Font (or 0)
        code.setStart(null);
        code.setTilde(true);
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
