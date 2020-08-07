function siteLocation(url) {
  let scriptName;
  if (url.includes("https://trpoint.com/App1/TCApp/Docs/TxnDocuments")){
    scriptName="flashDriveFilter";
  } else if (url.includes("https://www.trpoint.com/DocAccess/DocAccess")) {
    scriptName="flashDriveDownloader";
  }else {
    return false;
  }
  return scriptName;
}

let helperScript = siteLocation(window.location.href)
console.log(helperScript);