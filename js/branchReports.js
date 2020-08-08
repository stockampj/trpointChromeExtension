let presaleParameters = {
  branch: '-1',
  tc: '-1',
  agentStatus: 'All',
  agentRepresents: '-1',
  transactionStatus: '1',
  dateType: 'listdate'
}

let escrowParameters = {
  branch: '-1',
  tc: '-1',
  agentStatus: 'All',
  agentRepresents: '-1',
  transactionStatus: '-1',
  dateType: 'estclosedate'
}

let fieldIds = {
  branchId: '#_ctl0_TPPageContent_ddlBranches',
  tcId: '#_ctl0_TPPageContent_ddlTC',
  agentStatusId: '#_ctl0_TPPageContent_ddlAgentStatus',
  agentRepresentsId: '#_ctl0_TPPageContent_ddlAgentRepresents',
  transactionStatusId: '#_ctl0_TPPageContent_ddlTransctionStatus',
  dateTypeId: '#_ctl0_TPPageContent_ddlTransDateType',
  dateStartId: '#_ctl0_TPPageContent_dtStartDate_I',
  dateEndId: '#_ctl0_TPPageContent_dtEndDate_I'
}

function reportChanges({branch, tc, agentStatus, agentRepresents, transactionStatus, dateType}, fieldIdObject){

  function dateTransformer(date){
    let dd = (date.getDate()<10) ? `0${date.getDate()}`:date.getDate();
    let mm = ((date.getMonth()+1)<10)? `0${date.getMonth()+1}`:date.getMonth()+1;
    let yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  let today = new Date();
  let offset = today.getDay() - 5;
  let dateEnd = new Date(today - (offset * 24 * 60 * 60 * 1000));
  let dateStart = new Date(dateEnd - (6 * 24 * 60 * 60 * 1000));

  // branchField 
  $(fieldIdObject.branchId).val(branch).change();
  // tcField 
  $(fieldIdObject.tcId).val(tc).change();
  // agentStatusField 
  $(fieldIdObject.agentStatusId).val(agentStatus).change();
  // agentRepresentsField 
  $(fieldIdObject.agentRepresentsId).val(agentRepresents).change();
  // transactionStatusField 
  $(fieldIdObject.transactionStatusId).val(transactionStatus).change();
  // dateTypeField 
  $(fieldIdObject.dateTypeId).val(dateType).change();
  // dateStartField 
  $(fieldIdObject.dateStartId).click().val(dateTransformer(dateStart)).change();
  // dateEndField 
  $(fieldIdObject.dateEndId).click().val(dateTransformer(dateEnd)).change();
}

function presaleReportCleaner(){
  ////////////////////////////////This Section Grabs the Data from the html/////////////////////////////

  let companyReportObject = {};
  //targets branch heading div
  let rows = document.querySelectorAll(".blueBgrBoldTextDark");
  for (h=0; h<rows.length; h++) {
    // get Branch Name
    let branchName = rows[h].childNodes[1].innerText;
    let position = branchName.lastIndexOf('-');
    branchName = branchName.slice(position+2);
    //this object holds the data for the branch
    let branchDataObject = {
      [branchName]: {}
    };
    //find Nearest parent Div and then gets the next Tables Data.
    let targetTable = rows[h].parentElement.parentElement.parentElement.nextSibling.children[0].children[0].children;
      for (i=1; i<targetTable.length; i++) {
        let listingDataExtract = [];
        let listingData = targetTable[i].children;
        for (j=0; j<listingData.length; j++){
          listingDataExtract.push(listingData[j].innerText)
        };
        let listingObject = {
          [listingDataExtract[0]]:{
            address:listingDataExtract[1],
            tcAndAgent:listingDataExtract[2],
            representStatus:listingDataExtract[3],
            listingAndExpirationDate:listingDataExtract[4],
            estimatedClosingDateAndEscrowClosingDate:listingDataExtract[5],
            transactionCreatedAndClosedDate:listingDataExtract[6],
            listPriceAndSalesPrice:listingDataExtract[7]
          }
        };
        let newBranchDataObject= Object.assign({}, branchDataObject[branchName], listingObject)
        branchDataObject[branchName] = newBranchDataObject;
      };
      let newCompanyReportObject = Object.assign({}, companyReportObject, branchDataObject);
      companyReportObject = newCompanyReportObject;
  }
  console.log(companyReportObject)

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////This Section redisplays the Data//////////////////////////////////////

  let bodyElement = document.getElementsByTagName("BODY")[0]

  // remove previous display
  bodyElement.children[0].style.display= "none";

  // add new main Div
  let mainDiv = document.createElement("DIV");
  mainDiv.classList.add("main-div");
  bodyElement.appendChild(mainDiv);

  //add banchDiv
  let branchDivKeys = Object.keys(companyReportObject)

  branchDivKeys.forEach((branch) => {
    let branchDiv = document.createElement("DIV");
    branchDiv.setAttribute("ID", branch)
    branchDiv.classList.add("branch-wrapper");
    document.getElementsByClassName("main-div")[0].appendChild(branchDiv);
  });

  //add Branch titleDivs and listingsWrapper
  branchDivKeys.forEach((branch) => {
    let branchDiv = document.getElementById(branch);

    let branchHeader = document.createElement("H2");
    branchHeader.classList.add("branch-name");
    branchHeader.innerText = branch;
    branchDiv.appendChild(branchHeader);

    let listingsWrapper = document.createElement("DIV")
    listingsWrapper.classList.add("listings-wrapper");
    listingsWrapper.setAttribute("ID", `${branch}-listings`)

    let listingKeys = Object.keys(companyReportObject[branch])
    let listingCountTotal = listingKeys.length;
    let currentListingCount = 0;
    listingKeys.forEach((listingKey)=>{
      currentListingCount +=1;  
      let address;
      let agent;
      let represent;
      let status;
      let listingDate;
      let expirationDate;
      let estimatedClosingDate;
      let escrowClosingDate;
      let transactionCreatedDate;
      let transactionClosingDate;
      let listingPrice;
      let salesPrice;
      
      let linebreak = document.createElement("HR");

      let listingDiv = document.createElement("DIV");
      listingDiv.classList.add("listing-div");
      listingDiv.setAttribute("ID", listingKey);
      let listingDataKeys = Object.keys(companyReportObject[branch][listingKey])
      listingDataKeys.forEach((dataKey)=>{
        let dataText = companyReportObject[branch][listingKey][dataKey];
        let position;
        switch (dataKey) {
          default:
            break;
          case 'address':
            position = dataText.indexOf(",");
            address = `${dataText.slice(0,position)}<br>${dataText.slice(position+1)}`
            break;
          case 'tcAndAgent':
            position = dataText.indexOf(" / ");
            agent = dataText.slice(position+3);
            break;
          case 'representStatus':
            position = dataText.indexOf(" / ")
            represent = dataText.slice(0,position)
            status = dataText.slice(position+3)
            if (status.includes('Cancelled')) {listingDiv.classList.add("cancelled");linebreak.style.display='none'}
            break;
          case 'listingAndExpirationDate':
            position = dataText.indexOf(" / ")
            listingDate = dataText.slice(0, position)
            expirationDate= dataText.slice(position+3)
            break;
          case 'estimatedClosingDateAndEscrowClosingDate':
            position = dataText.indexOf(" / ")
            estimatedClosingDate = dataText.slice(0, position)
            escrowClosingDate= dataText.slice(position+3)
            break;
          case 'transactionCreatedAndClosedDate':
            position = dataText.indexOf(" / ")
            transactionCreatedDate = dataText.slice(0, position)
            transactionClosingDate= dataText.slice(position+3)
            break;
          case 'listPriceAndSalesPrice':
            position = dataText.indexOf(" / ")
            listingPrice = (dataText.indexOf('/')==0) ? '' : dataText.slice(0, position)
            salesPrice = dataText.slice(position+3)
            break;
        }
      });
      listingDiv.innerHTML=`
        <div class="address">${address}</div>
        <div class="status">${status}</div>
        <div class="agent-div">
          <div class="">${agent}</div>
          <div class="tag">(for ${represent})</div>
        </div>
        <div class="listing-date-div">
          <div class="table-label">Listing:</div>
          <div class="listing-dates">
            <div class="date-div">${listingDate}</div>
            <div class="tag">-</div>
            <div class="date-div">${expirationDate}</div>
          </div>        
        </div>
        <div class="closing-date-div">
          <div class="table-label">Closing:</div>
          <div class="closing-dates">
            <div class="">${estimatedClosingDate}<br><div class="tag">(estimate)</div></div>
            <div class="">${escrowClosingDate}<br><div class="tag">(escrow)</div></div>
          </div>
        </div>
        <div class="sales-prices">
          <div class="table-label">Price:</div>
          <div class="price-div">
            <div class="">${listingPrice}<br>${salesPrice}</div>
            <div class="tag">Listings<br>Sales</div>
          </div>
        </div>
      `
      listingsWrapper.appendChild(listingDiv);
      if (currentListingCount !== listingCountTotal) {listingsWrapper.appendChild(linebreak);}
    })

    branchDiv.appendChild(listingsWrapper)
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////CSS Stuff/////////////////////////////////////////////////////////

  document.getElementsByClassName("main-div")[0].style.cssText = `
    min-height: 100px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    position: absolute;
    `;

  let branchDivs = document.getElementsByClassName("branch-wrapper")
  Object.keys(branchDivs).forEach((key)=>{
    branchDivs[key].style.cssText = `
      margin-top: 5px;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
    `
  });

  let branchNames = document.getElementsByClassName("branch-name")
  Object.keys(branchNames).forEach((key)=>{
    branchNames[key].style.cssText = `
      width: 100%;
      background-color: rgba(100,100,100,1);
      text-align: left;
      padding-left: 5px;
      margin: 0px;
      margin-top: 10px;
      color: white;
      font-size: 15px;
    `
  });

  let listingsWrapper = document.getElementsByClassName("listings-wrapper")
  Object.keys(listingsWrapper).forEach((key)=>{
    listingsWrapper[key].style.cssText= `
      min-height: 10px;
      padding-left: 20px;
    `
  });

  let listingDiv = document.getElementsByClassName("listing-div")
  Object.keys(listingDiv).forEach((key)=>{
    listingDiv[key].style.cssText= `
      min-height: 10px;
      padding-right: 20px;
      display: flex;
      font-size: 12px;
      margin-top: 5px;
      flex-direction: row;
      flex-wrap: no-wrap;
    `
  });

  let addressDiv = document.getElementsByClassName("address")
  Object.keys(addressDiv).forEach((key)=>{
    addressDiv[key].style.cssText= `
      width: 200px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
    `
  });

  let statusDiv = document.getElementsByClassName("status")
  Object.keys(statusDiv).forEach((key)=>{
    statusDiv[key].style.cssText= `
      width: 70px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
      font-weight: 600;
    `
  });

  let agentDiv = document.getElementsByClassName("agent-div")
  Object.keys(agentDiv).forEach((key)=>{
    agentDiv[key].style.cssText= `
      width: 120px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
    `
  });

  let listingDatesDiv = document.getElementsByClassName("listing-date-div")
  Object.keys(listingDatesDiv).forEach((key)=>{
    listingDatesDiv[key].style.cssText=`
      width: 200px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `
  })

  let listingDates = document.getElementsByClassName("listing-dates")
  Object.keys(listingDates).forEach((key)=>{
    listingDates[key].style.cssText=`
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
  })
  let dateDiv = document.getElementsByClassName("date-div")
  Object.keys(dateDiv).forEach((key)=>{
    dateDiv[key].style.cssText=`
      width: 50px;
      min-height: 10px;
      padding-right: 10px;
      text-align: center;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
  })

  let closingAndEscrowDiv = document.getElementsByClassName("closing-date-div")
  Object.keys(closingAndEscrowDiv).forEach((key)=>{
    closingAndEscrowDiv[key].style.cssText = `
      width: 220px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `
  })

  let closingDate = document.getElementsByClassName("closing-dates")
  Object.keys(closingDate).forEach((key)=>{
    closingDate[key].style.cssText = `
      width: 150px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
  })

  let listPriceAndSalesPrice = document.getElementsByClassName("sales-prices")
  Object.keys(listPriceAndSalesPrice).forEach((key)=>{
    listPriceAndSalesPrice[key].style.cssText = `
      width: 250px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `
  })

  let priceDiv = document.getElementsByClassName("price-div")
  Object.keys(priceDiv).forEach((key)=>{
    priceDiv[key].style.cssText = `
      width: 130px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    `
  })

  let tableLabelDivs = document.getElementsByClassName("table-label")
  Object.keys(tableLabelDivs).forEach((key)=>{
    tableLabelDivs[key].style.fontWeight = '600';
    tableLabelDivs[key].style.paddingRight = '10px';
  })

  let tagDivs = document.getElementsByClassName("tag")
  Object.keys(tagDivs).forEach((key)=>{
    tagDivs[key].style.fontStyle = 'italic';
    tagDivs[key].style.color = 'rgba(150,150,150,1)';
    tagDivs[key].style.paddingRight = '5px';
    tagDivs[key].style.paddingLeft = '5px';
    tagDivs[key].style.textAlign = 'left';
  })

  let cancelledListing = document.getElementsByClassName("cancelled")
  Object.keys(cancelledListing).forEach((key)=>{
    cancelledListing[key].style.display = 'none';
  })
};

function escrowReportCleaner(){
  ////////////////////////////////This Section Grabs the Data from the html/////////////////////////////
  let companyReportObject = {};
  //targets branch heading div
  let rows = document.querySelectorAll(".blueBgrBoldTextDark");
  for (h=0; h<rows.length; h++) {
    // get Branch Name
    let branchName = rows[h].childNodes[1].innerText;
    let position = branchName.lastIndexOf('-');
    branchName = branchName.slice(position+2);
    //this object holds the data for the branch
    let branchDataObject = {
      [branchName]: {}
    };
    //find Nearest parent Div and then gets the next Tables Data.
    let targetTable = rows[h].parentElement.parentElement.parentElement.nextSibling.children[0].children[0].children;
      for (i=1; i<targetTable.length; i++) {
        let listingDataExtract = [];
        let listingData = targetTable[i].children;
        for (j=0; j<listingData.length; j++){
          listingDataExtract.push(listingData[j].innerText)
        };
        let listingObject = {
          [listingDataExtract[0]]:{
            address:listingDataExtract[1],
            tcAndAgent:listingDataExtract[2],
            representStatus:listingDataExtract[3],
            listingAndExpirationDate:listingDataExtract[4],
            estimatedClosingDateAndEscrowClosingDate:listingDataExtract[5],
            transactionCreatedAndClosedDate:listingDataExtract[6],
            listPriceAndSalesPrice:listingDataExtract[7]
          }
        };
        let newBranchDataObject= Object.assign({}, branchDataObject[branchName], listingObject)
        branchDataObject[branchName] = newBranchDataObject;
      };
      let newCompanyReportObject = Object.assign({}, companyReportObject, branchDataObject);
      companyReportObject = newCompanyReportObject;
  }
  console.log(companyReportObject)

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////This Section redisplays the Data//////////////////////////////////////

  let bodyElement = document.getElementsByTagName("BODY")[0]

  // remove previous display
  bodyElement.children[0].style.display= "none";

  // add new main Div
  let mainDiv = document.createElement("DIV");
  mainDiv.classList.add("main-div");
  bodyElement.appendChild(mainDiv);

  //add banchDiv
  let branchDivKeys = Object.keys(companyReportObject)

  branchDivKeys.forEach((branch) => {
    let branchDiv = document.createElement("DIV");
    branchDiv.setAttribute("ID", branch)
    branchDiv.classList.add("branch-wrapper");
    document.getElementsByClassName("main-div")[0].appendChild(branchDiv);
  });

  //add Branch titleDivs and listingsWrapper
  branchDivKeys.forEach((branch) => {
    let branchDiv = document.getElementById(branch);

    let branchHeader = document.createElement("H2");
    branchHeader.classList.add("branch-name");
    branchHeader.innerText = branch;
    branchDiv.appendChild(branchHeader);

    let listingsWrapper = document.createElement("DIV")
    listingsWrapper.classList.add("listings-wrapper");
    listingsWrapper.setAttribute("ID", `${branch}-listings`)

    let listingKeys = Object.keys(companyReportObject[branch])
    let listingCountTotal = listingKeys.length;
    let currentListingCount = 0;
    listingKeys.forEach((listingKey)=>{
      currentListingCount +=1;  
      let address;
      let agent;
      let represent;
      let status;
      let listingDate;
      let expirationDate;
      let estimatedClosingDate;
      let escrowClosingDate;
      let transactionCreatedDate;
      let transactionClosingDate;
      let listingPrice;
      let salesPrice;
      
      let linebreak = document.createElement("HR");

      let listingDiv = document.createElement("DIV");
      listingDiv.classList.add("listing-div");
      listingDiv.setAttribute("ID", listingKey);
      let listingDataKeys = Object.keys(companyReportObject[branch][listingKey])
      listingDataKeys.forEach((dataKey)=>{
        let dataText = companyReportObject[branch][listingKey][dataKey];
        let position;
        switch (dataKey) {
          default:
            break;
          case 'address':
            position = dataText.indexOf(",");
            address = `${dataText.slice(0,position)}<br>${dataText.slice(position+1)}`
            break;
          case 'tcAndAgent':
            position = dataText.indexOf(" / ");
            agent = dataText.slice(position+3);
            break;
          case 'representStatus':
            position = dataText.indexOf(" / ")
            represent = dataText.slice(0,position)
            status = dataText.slice(position+3)
            if (status.includes('Cancelled')) {listingDiv.classList.add("cancelled");linebreak.style.display='none'}
            break;
          case 'listingAndExpirationDate':
            position = dataText.indexOf(" / ")
            listingDate = dataText.slice(0, position)
            expirationDate= dataText.slice(position+3)
            break;
          case 'estimatedClosingDateAndEscrowClosingDate':
            position = dataText.indexOf(" / ")
            estimatedClosingDate = dataText.slice(0, position)
            escrowClosingDate= dataText.slice(position+3)
            break;
          case 'transactionCreatedAndClosedDate':
            position = dataText.indexOf(" / ")
            transactionCreatedDate = dataText.slice(0, position)
            transactionClosingDate= dataText.slice(position+3)
            break;
          case 'listPriceAndSalesPrice':
            position = dataText.indexOf(" / ")
            listingPrice = (dataText.indexOf('/')==0) ? '' : dataText.slice(0, position)
            salesPrice = dataText.slice(position+3)
            break;
        }
      });
      listingDiv.innerHTML=`
        <div class="address">${address}</div>
        <div class="status">${status}</div>
        <div class="agent-div">
          <div class="">${agent}</div>
          <div class="tag">(for ${represent})</div>
        </div>
        <div class="listing-date-div">
          <div class="table-label">Listing:</div>
          <div class="listing-dates">
            <div class="date-div">${listingDate}</div>
            <div class="tag">-</div>
            <div class="date-div">${expirationDate}</div>
          </div>        
        </div>
        <div class="closing-date-div">
          <div class="table-label">Closing:</div>
          <div class="closing-dates">
            <div class="">${estimatedClosingDate}<br><div class="tag">(estimate)</div></div>
            <div class="">${escrowClosingDate}<br><div class="tag">(escrow)</div></div>
          </div>
        </div>
        <div class="sales-prices">
          <div class="table-label">Price:</div>
          <div class="price-div">
            <div class="">${listingPrice}<br>${salesPrice}</div>
            <div class="tag">Listings<br>Sales</div>
          </div>
        </div>
      `
      listingsWrapper.appendChild(listingDiv);
      if (currentListingCount !== listingCountTotal) {listingsWrapper.appendChild(linebreak);}
    })

    branchDiv.appendChild(listingsWrapper)
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////CSS Stuff/////////////////////////////////////////////////////////

  document.getElementsByClassName("main-div")[0].style.cssText = `
    min-height: 100px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    position: absolute;
    `;

  let branchDivs = document.getElementsByClassName("branch-wrapper")
  Object.keys(branchDivs).forEach((key)=>{
    branchDivs[key].style.cssText = `
      margin-top: 5px;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
    `
  });

  let branchNames = document.getElementsByClassName("branch-name")
  Object.keys(branchNames).forEach((key)=>{
    branchNames[key].style.cssText = `
      width: 100%;
      background-color: rgba(100,100,100,1);
      text-align: left;
      padding-left: 5px;
      margin: 0px;
      margin-top: 10px;
      color: white;
      font-size: 15px;
    `
  });

  let listingsWrapper = document.getElementsByClassName("listings-wrapper")
  Object.keys(listingsWrapper).forEach((key)=>{
    listingsWrapper[key].style.cssText= `
      min-height: 10px;
      padding-left: 20px;
    `
  });

  let listingDiv = document.getElementsByClassName("listing-div")
  Object.keys(listingDiv).forEach((key)=>{
    listingDiv[key].style.cssText= `
      min-height: 10px;
      padding-right: 20px;
      display: flex;
      font-size: 12px;
      margin-top: 5px;
      flex-direction: row;
      flex-wrap: no-wrap;
    `
  });

  let addressDiv = document.getElementsByClassName("address")
  Object.keys(addressDiv).forEach((key)=>{
    addressDiv[key].style.cssText= `
      width: 200px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
    `
  });

  let statusDiv = document.getElementsByClassName("status")
  Object.keys(statusDiv).forEach((key)=>{
    statusDiv[key].style.cssText= `
      width: 70px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
      font-weight: 600;
    `
  });

  let agentDiv = document.getElementsByClassName("agent-div")
  Object.keys(agentDiv).forEach((key)=>{
    agentDiv[key].style.cssText= `
      width: 120px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
    `
  });

  let listingDatesDiv = document.getElementsByClassName("listing-date-div")
  Object.keys(listingDatesDiv).forEach((key)=>{
    listingDatesDiv[key].style.cssText=`
      width: 200px;
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `
  })

  let listingDates = document.getElementsByClassName("listing-dates")
  Object.keys(listingDates).forEach((key)=>{
    listingDates[key].style.cssText=`
      min-height: 10px;
      padding-right: 10px;
      text-align: left;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
  })
  let dateDiv = document.getElementsByClassName("date-div")
  Object.keys(dateDiv).forEach((key)=>{
    dateDiv[key].style.cssText=`
      width: 50px;
      min-height: 10px;
      padding-right: 10px;
      text-align: center;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
  })

  let closingAndEscrowDiv = document.getElementsByClassName("closing-date-div")
  Object.keys(closingAndEscrowDiv).forEach((key)=>{
    closingAndEscrowDiv[key].style.cssText = `
      width: 220px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `
  })

  let closingDate = document.getElementsByClassName("closing-dates")
  Object.keys(closingDate).forEach((key)=>{
    closingDate[key].style.cssText = `
      width: 150px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `
  })

  let listPriceAndSalesPrice = document.getElementsByClassName("sales-prices")
  Object.keys(listPriceAndSalesPrice).forEach((key)=>{
    listPriceAndSalesPrice[key].style.cssText = `
      width: 250px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `
  })

  let priceDiv = document.getElementsByClassName("price-div")
  Object.keys(priceDiv).forEach((key)=>{
    priceDiv[key].style.cssText = `
      width: 130px;
      min-height: 10px;
      padding-right: 10px;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    `
  })

  let tableLabelDivs = document.getElementsByClassName("table-label")
  Object.keys(tableLabelDivs).forEach((key)=>{
    tableLabelDivs[key].style.fontWeight = '600';
    tableLabelDivs[key].style.paddingRight = '10px';
  })

  let tagDivs = document.getElementsByClassName("tag")
  Object.keys(tagDivs).forEach((key)=>{
    tagDivs[key].style.fontStyle = 'italic';
    tagDivs[key].style.color = 'rgba(150,150,150,1)';
    tagDivs[key].style.paddingRight = '5px';
    tagDivs[key].style.paddingLeft = '5px';
    tagDivs[key].style.textAlign = 'left';
  })

  let cancelledListing = document.getElementsByClassName("cancelled")
  Object.keys(cancelledListing).forEach((key)=>{
    cancelledListing[key].style.display = 'none';
  })
};

function addFlashDrivePanel() {
  let jqTarget = $('#flashdrive-tools')[0]
  if (jqTarget === undefined){
    let tableTarget = $('table')[19];
    // console.log(tableTarget)
    let newRow = document.createElement('DIV');
    newRow.id ='flashdrive-tools';
    tableTarget.append(newRow)
    jqTarget = $('#flashdrive-tools')[0] 
    jqTarget.innerHTML = `
      <button id="presale-report-button" class="btn btn-primary btn-trpoint">Presale Report</button>
      <button id="escrow-report-button" class="btn btn-primary btn-trpoint">Escrow Report</button>
    `;
    $("#escrow-report-button")[0].addEventListener("click", function(event){
      event.preventDefault()
      // reportChanges(escrowParameters, fieldIds);
      escrowReportCleaner();
    });
    $("#presale-report-button")[0].addEventListener("click", function(event){
      event.preventDefault();
      // reportChanges(presaleParameters, fieldIds);
      presaleReportCleaner();
    });
    $('.btn-trpoint').css("margin", "5px 5px 5px 5px");
  };
};

addFlashDrivePanel();
