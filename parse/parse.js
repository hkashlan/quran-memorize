const https = require("https");
var HTMLParser = require("node-html-parser");
fs = require("fs");

const lineType = {
  surahName: "surah",
  basmalah: "basmalah",
  line: "line",
};

const page1 = {
  title: "sfsdf",
  pageNumber: 1,
  lines: [
    {
      type: lineType.surahName,
      words: "sdfsdf",
    },
    {
      type: lineType.basmalah,
      words: "string",
    },
    {
      type: lineType.line,
      lineWords: [
        {
          sura: 113,
          ayah: 1,
          wordOrder: 3,
          word: 64356,
        },
      ],
    },
  ],
};

const quran = [page1, page1];

const pad = (num) => {
    let retVal = num + "";
    if (num < 10) {
      retVal = "00" + num;
    } else if (num < 100) {
      retVal = "0" + num;
    }
    return retVal;
  };

async function fetchQuran() {
    const quran = [];
    for (let index = 1; index < 605; index++) {
        console.log("page number: " + index)
        const page = await fetchPage(index);
        quran.push(page);
    }
  const quranText = "export default " + JSON.stringify(quran, null, 2) + ";";
  //   console.log(pageText);
  fs.writeFile("src/mushaf.ts", quranText, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });
}

function fetchPage(pageNumber) {
  return new Promise((resolve, reject) => {
    https.get(
      `https://raw.githubusercontent.com/oazabir/QuranApp/master/page/page${pad(pageNumber)}.html`,
      (resp) => {
        let data = "";

        // A chunk of data has been recieved.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp
          .on("end", () => {
            const page = parsePage(data, pageNumber);
            resolve(page);
          })
          .on("error", (err) => {
            console.log("Error: " + err.message);
          });
      }
    );
  });
}

function getWords(htmlElement) {
  const text = htmlElement.rawText;
  const words = text.split("&#");
  const title = words.map((word) =>
    String.fromCharCode(+word.trim().slice(0, -1))
  );
  title.shift();
  return title.join("");
}

function parsePage(data, pageNumber) {
  const root = HTMLParser.parse(data);
  // const pageContent = root.childNodes[2];
  const page = {
    pageNumber: pageNumber,
    lines: [],
  };

  root.childNodes.forEach((childNode) => {
    const childText = childNode.toString().trim();
    if (childText) {
      const tt = HTMLParser.parse(childText);
      const surah_title = tt.querySelector(".surah_title");
      const page_content = tt.querySelector(".page_content");
      if (surah_title) {
        page.title = getWords(surah_title);
      } else if (page_content) {
        page_content.childNodes.forEach((lineChildNode) => {
          const lineChildText = lineChildNode.toString().trim();
          if (lineChildText) {
            const tt = HTMLParser.parse(lineChildText);
            const surah_name = tt.querySelector(".surah_name");
            const basmalah = tt.querySelector(".basmalah");
            const line = tt.querySelector(".line");
            if (surah_name) {
              page.lines.push({
                type: lineType.surahName,
                words: getWords(surah_name),
              });
            } else if (basmalah) {
              page.lines.push({
                type: lineType.basmalah,
                words: getWords(basmalah),
              });
            } else if (line) {
              const lineWords = line.childNodes.map((wordChildNode) => {
                return {
                  sura: +wordChildNode.attributes.sura,
                  ayah: +wordChildNode.attributes.ayah,
                  wordOrder: +wordChildNode.attributes.word,
                  type: +wordChildNode.attributes.type,
                  word: +wordChildNode.rawText.slice(2, -1),
                };
              });
              const pageLine = {
                type: lineType.line,
                lineWords: lineWords,
              };
              page.lines.push(pageLine);
            }
          }
        });
      }
    }
  });
  return page;
}


fetchQuran();
