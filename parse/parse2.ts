import mushaf from '../src/mushaf copy 2';
// fs = require("fs");
import * as fs from "fs";

const lineType = {
    surahName: "surah",
    basmalah: "basmalah",
    line: "line",
};


let currentAya = 1;
let pages = [];
for (let pageIndex = 0; pageIndex < mushaf.length; pageIndex++) {
    const pageXX = mushaf[pageIndex];
    const page = [];
    for (let index = 0; index < pageXX.lines.length; index++) {
        let line = '';
        if (pageXX.lines[index].type == lineType.surahName) {
            line += "_" + pageXX.lines[index].words;
        } else if (pageXX.lines[index].type == lineType.basmalah) {
            line += "__" + pageXX.lines[index].words;
        } else {
            const lineWords = pageXX.lines[index].lineWords as any;
            for (let j = 0; j < lineWords.length; j++) {
                const word = lineWords[j];
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

const quranText = "export default " + JSON.stringify(pages, null, 2) + ";";
fs.writeFile("src/mushaf4.ts", quranText, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });
