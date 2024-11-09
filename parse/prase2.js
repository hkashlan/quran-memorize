"use strict";
exports.__esModule = true;
var mushaf_copy_2_1 = require("../src/mushaf copy 2");
// fs = require("fs");
var fs = require("fs");
var lineType = {
    surahName: "surah",
    basmalah: "basmalah",
    line: "line"
};
var currentAya = 1;
var pages = [];
for (var pageIndex = 0; pageIndex < mushaf_copy_2_1["default"].length; pageIndex++) {
    var pageXX = mushaf_copy_2_1["default"][pageIndex];
    var page = [];
    for (var index = 0; index < pageXX.lines.length; index++) {
        var line = '';
        if (pageXX.lines[index].type == lineType.surahName) {
            line += "_" + pageXX.lines[index].words;
        }
        else if (pageXX.lines[index].type == lineType.basmalah) {
            line += "__" + pageXX.lines[index].words;
        }
        else {
            var lineWords = pageXX.lines[index].lineWords;
            for (var j = 0; j < lineWords.length; j++) {
                var word = lineWords[j];
                if (currentAya != word.ayah) {
                    line += ' ';
                }
                currentAya = word.ayah;
                line += String.fromCharCode(word.word);
            }
        }
        page.push(line);
    }
    pages.push(page);
}
var quranText = "export default " + JSON.stringify(pages, null, 2) + ";";
fs.writeFile("src/mushaf4.ts", quranText, function (err) {
    if (err)
        return console.log(err);
    console.log("Hello World > helloworld.txt");
});
