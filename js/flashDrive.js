if (helperScript==="flashDriveFilter"){
  function gatherDocumentList() {
    let documentList = {};
    let rowId = 0;
    Object.keys($("tr")).forEach((key)=>{
      let row = $("tr")[key];
      if (row.children && row.children.length === 12 && !(row.classList.contains('tr-head'))){
        row.id = `docRowId-${rowId}`
        
        let docName = row.children[2].children[0].outerText;
        let docCategory = row.children[2].children[1].outerText;
        let docCheckBoxId= row.children[0].children[0].children[0].id;
        let docCheckBoxParent = row.children[0];
        let docLinkId = row.children[2].children[0].children[0].id;
        let pageCount = row.children[3].innerText;
        let uploadDate = row.children[6].children[0].innerText;
    
        let tempDocRows = documentList;    
        let rowObject = Object.assign({}, tempDocRows, {
          [rowId]: {
            docRowId: row.id,
            docName: docName,
            docCategory: docCategory,
            docNameCategoryCombined: `${docName.toLowerCase()} ${docCategory.toLowerCase()}`,
            docCheckBoxId: docCheckBoxId,
            docCheckBoxParent: docCheckBoxParent,
            docLinkId: docLinkId,
            pageCount: pageCount,
            uploadDate: uploadDate
          }
        })
        documentList = rowObject;
        rowId+=1;
      };
    })
    return documentList;
  }
  
  function findDocument(documentList, searchTerms, property) {
    function termCleaner(string){
      return string.toLowerCase().replace(/[()]/gmi, "")
    }
    let keyResult = [];
    let searchField= property; 
    Object.keys(documentList).forEach((key)=>{
      let match = false;
      searchTerms.forEach((searchTerm)=>{
        term = termCleaner(searchTerm);
        let comparisonField = termCleaner(documentList[key][searchField]);
        if (comparisonField.includes(term)) {match = true;}
      })
      if (match) {keyResult.push(key)};
    })
    return keyResult;
  }
  
  function selectAllCheckboxes() {
    Object.keys($( "[type=checkbox]" )).forEach((key)=>{
      let checkbox = $( "[type=checkbox]" )[key];
      if (checkbox.id  && checkbox.id.includes('chkSelectAll')) { checkbox.click();}
    })
  };
  
  function selectDocument(documentList, key, value){
    let targetId = documentList[key]['docCheckBoxId']
    $(`#${targetId}`)[0].checked = value;
  };
  
  function changeRowColor(documentList, key, color) {
    let targetId = documentList[key]['docRowId']
    $(`#${targetId}`).css('background-color', color);
  };
  
  function changeCheckBoxBackground(documentList, key, color) {
    let targetId = documentList[key]['docCheckBoxParent'];
    targetId.style.backgroundColor = color; 
  }
  
  let deSelectList = [
    'facing',
    'key',
    'letters',
    'mls printout',
    'commission',
    'sales report',
    'sign up',
    'profile',
    'referral'
  ]
  
  function filterOutDocuments (documentList, filterArray) {
    let matches = findDocument(documentList, filterArray, "docNameCategoryCombined");
    Object.keys(documentList).forEach((key)=>{
      selectDocument(documentList, key, true)
    })
    matches.forEach(key=>{
      selectDocument(documentList, key, false);
      changeCheckBoxBackground(documentList, key, 'rgb(200, 200, 200)');
      changeRowColor(documentList, key, 'white')
    })
  }
  
  function showMatches(documentList) {
    let matchesArray = [];
    let keys = Object.keys(documentList);
    let count = keys.length;
  
    let flagWords = ['listing', 'seller', 'selling', 'buyer'];
  
    while (keys.length>0){
      let key = keys.pop();
      let targetDocument = documentList[key];
      let {docName, docCategory, pageCount, docRowId} = targetDocument;
      keys.forEach(comparisonKey=>{
        let comparisonDoc = documentList[comparisonKey];
        let docNameComparison = comparisonDoc[`docName`];
        let docCategoryComparison = comparisonDoc[`docCategory`];
        let pageCountComparison = comparisonDoc[`pageCount`];
        let docRowIdComparison = comparisonDoc[`docRowId`];
        let pageCompare = (pageCount === pageCountComparison) ? true: false;
        let categoryCompare = (docCategory === docCategoryComparison) ? true: false;
        let flagWordFail;
        let nameCompare = false;
        
        if (pageCompare===true || categoryCompare === true){
          let nameArray = docName.toLowerCase().replace(/[_-]/gi, ' ').replace(/[()]\'/, '').split(' ').filter(word => word !== '');
          let comparisonNameArray = docNameComparison.toLowerCase().replace(/[_-]/gi, ' ').replace(/[()]\'/, '').split(' ').filter(word => word !== '');
          let nameCount = (nameArray.length<comparisonNameArray.length) ? nameArray.length : comparisonNameArray.length;
          let matchedWordsCount = 0;
          nameArray.forEach(targetWord=>{
            if (comparisonNameArray.includes(targetWord)){
              matchedWordsCount += 1
            }
          })
          let matchPercentage = matchedWordsCount/nameCount;
          nameCompare = (matchPercentage>=.5) ? true : false;
  
          if (matchPercentage>=.5) {
            let flagWordNotInBothCount = 0;
            flagWords.forEach(flagWord=>{
              let targetFlagPresence = nameArray.includes(flagWord);
              let comparisonFlagPresence = comparisonNameArray.includes(flagWord);
              if (targetFlagPresence || comparisonFlagPresence) {
                ((targetFlagPresence && !comparisonFlagPresence) || (!targetFlagPresence && comparisonFlagPresence)) ? flagWordNotInBothCount+=1: flagWordNotInBothCount+=0;
              };
            })
            flagWordFail = (flagWordNotInBothCount>0) ?  true: false;
          } else {
            flagWordFail = false;
          }
        }
        let positiveTestCount = [pageCompare, categoryCompare, nameCompare].filter(comparison => comparison === true).length;
  
        if (positiveTestCount>1 && flagWordFail === false){
          if (!matchesArray.includes(key)){matchesArray.push(key);}
          if (!matchesArray.includes(comparisonKey)){matchesArray.push(comparisonKey);}
  
          console.log(`----------------`)
          console.log(docName)
          console.log(docNameComparison)
          console.log(`pageCompare ${pageCompare}`)
          console.log(`categoryCompare ${categoryCompare}`)
          console.log(`nameCompare ${nameCompare}`)
          console.log(`flagWordFail ${flagWordFail}`)
        }
  
  
        // if (categoryCompare === true){
        //   console.log(`key: ${comparisonKey}`)
        //   console.log(`pageCompare ${pageCompare}`)
        //   console.log(`catCompare ${categoryCompare}`)
        // };
      });;
    };
    return matchesArray;
  };
  
  function markMatches(documentList){
    let matchArray = showMatches(documentList);
    matchArray.forEach(match=>{
      changeRowColor(documentList, match, 'rgba(191, 189, 63, 0.24)')
    })
    // console.log(matchArray)
  }
  
  
  // let masterDocumentList = gatherDocumentList();
  // filterOutDocuments(masterDocumentList, deSelectList);
  // markMatches(masterDocumentList);
  
  
  
  
  function addFlashDrivePanel() {
    let jqTarget = $('#flashdrive-tools')[0]
    if (jqTarget === undefined){
      function buttonScript(){
        let masterDocumentList = gatherDocumentList();
        markMatches(masterDocumentList);
        filterOutDocuments(masterDocumentList, deSelectList);
      }
      let tableTarget = $('.panel-body')[0];
      // console.log(tableTarget)
      let newRow = document.createElement('DIV');
      newRow.id ='flashdrive-tools';
      tableTarget.append(newRow)
      jqTarget = $('#flashdrive-tools')[0] 
      jqTarget.innerHTML = `<button id="flashdrive-button" class="btn btn-primary">Filter for FlashDrives</button>`;
      $("#flashdrive-button")[0].addEventListener("click", function(event){
        event.preventDefault()
        buttonScript();
      });
      $('#flashdrive-button').css("margin", "5px 0px 5px 0px");
    };
  };
  
  addFlashDrivePanel();
}



