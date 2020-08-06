function siteLocation(url) {
  let scriptName;
  if (url.includes("https://trpoint.com/App1/TCApp/Docs/TxnDocuments")){
    scriptName="flashDriveFilter"
  } else {
    return false;
  }
  return scriptName;
}

let helperScript = siteLocation(window.location.href)
// console.log(helperScript);
