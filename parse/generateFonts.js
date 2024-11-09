fs = require("fs");


const pad = (num) => {
    let retVal = num + "";
    if (num < 10) {
      retVal = "00" + num;
    } else if (num < 100) {
      retVal = "0" + num;
    }
    return retVal;
  };


let fonts = `@font-face {
    font-family: 'basmalah';
    src: local('QCF_BSML'),
         url(https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff2/QCF_BSML.woff2) format('woff2'),
         url(https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff/QCF_BSML.woff) format('woff');
  }
  `;

for (let index = 1; index < 605; index++) {
    fonts += `  @font-face {
        font-family: 'MushafPage${pad(index)}';
        src: local('QCF_P${pad(index)}'),
             url(https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff2/QCF_P${pad(index)}.woff2) format('woff2'),
             url(https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff/QCF_P${pad(index)}.woff) format('woff');
      }
    `;

}

fs.writeFile("projects/quran-memorize/src/styles/fonts.css", fonts, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });
