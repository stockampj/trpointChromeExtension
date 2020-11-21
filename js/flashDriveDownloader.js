function downloadAllFiles(){
  
  let links = document.querySelectorAll("a");
  let filteredLinks = [];
  links.forEach((link)=>{
    let id = link.id;
    if (id.slice(0,8)===`GridView`) {
      let targetId = $(`#${id}`)[0];
      filteredLinks.push(targetId);
    }
  })
  console.log(filteredLinks.length);
  function fileDownloaderScript(){
    
  
    let interval= setInterval(clickFunction,2500,filteredLinks);
    let count = 0;
    function clickFunction(filteredLinks) {
      let node = filteredLinks.pop();
      count +=1;
      node.click();
      if (filteredLinks.length == 0) {
        console.log(count)
        clearInterval(interval);
      }
    }
  }
  
  function addButtonPanel() {
    let jqTarget = $('#flashdrive-tools')[0];
    if (jqTarget === undefined){
      function buttonScript(){
        fileDownloaderScript();
      }
      let tableTarget = document.querySelectorAll("table")[4];
      let newRow = document.createElement('DIV');
      newRow.id ='flashdrive-tools';
      tableTarget.append(newRow)
      jqTarget = $('#flashdrive-tools')[0]; 
      jqTarget.innerHTML = `<button id="flashdrive-button" class="btn btn-primary">Download All (${filteredLinks.length})</button>`;
      $("#flashdrive-button")[0].addEventListener("click", function(event){
        event.preventDefault()
        buttonScript();
      });
      // $('#flashdrive-button')[0].css("margin", "5px 0px 5px 0px");
    };
  }
  addButtonPanel();
}

downloadAllFiles();