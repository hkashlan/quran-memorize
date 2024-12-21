const fs = require('fs');

const baseURL = 'https://cdn.rawgit.com/mustafa0x/qpc-fonts/f93bf5f3/mushaf-woff2';
const fontUrls = [];

// Generate URLs from QCF_P001 to QCF_P604
for (let i = 1; i <= 604; i++) {
  const paddedNumber = String(i).padStart(3, '0'); // Ensures three digits, like 001, 002, etc.
  fontUrls.push(`${baseURL}/QCF_P${paddedNumber}.woff2`);
  fontUrls.push(`${baseURL}/QCF_P${paddedNumber}.woff`);
}

const config = {
  "$schema": "../../node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.csr.html",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/**/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"
        ]
      }
    },
    {
      "name": "font-cache",
      "installMode": "prefetch",
      "resources": {
        "urls": fontUrls
      }
    }
  ]
};

// Save the generated config to a file
fs.writeFileSync('ngsw-config-with-fonts.json', JSON.stringify(config, null, 2));
console.log("ngsw-config-with-fonts.json has been generated with font URLs from QCF_P001 to QCF_P604");
