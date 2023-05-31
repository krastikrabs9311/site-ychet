let materialInShop = [];
let data = 0;

function setStatus(el){
  let id = +el.id.replace("box", "");
  for(let element in materialInShop){
    if(materialInShop[element].id == id){
      materialInShop[element].status = true;
    }
  }

  saveData();
}

function deleteElement(el){
  let id = +el.id.replace("delete", "");
  materialInShop = materialInShop.filter(element => element.id != id);
  saveData();

  document.getElementById("materialInShop").innerHTML = materialInShop.map(el => {
    return `<li><input type="checkbox" onclick="setStatus(this)" id="box${el.id}" ${el.status ? "checked" : ""}>${el.title} - ${el.count} шт <input onclick="deleteElement(this)" value="x" type="button" id="delete${el.id}"></li>`;
  }).join("");
}

function add() {
  let material = document.getElementById("material").value;
  let materialCount = document.getElementById("materialCount").value;

  if(materialInShop.length >= 40){
    alert("Количество записей закончилось");
    return 0;
  }

  materialInShop.push({id:data++, title:material, count:materialCount, status:false});
  saveData();

  document.getElementById("materialInShop").innerHTML = materialInShop.map(el => {
    return `<li><input type="checkbox" onclick="setStatus(this)" id="box${el.id}" ${el.status ? "checked" : ""}>${el.title} - ${el.count} шт <input onclick="deleteElement(this)" value="x" type="button" id="delete${el.id}"></li>`;
  }).join("");
}

function clear(){
  materialInShop = [];
  document.getElementById("materialInShop").innerHTML = "";
  saveData();
}

async function sendRequest(path, type, body = {}){
  let headers = {
      method: type
  };

  if(type === "POST"){
      headers.headers = {
          "content-type" : "application/json"
      };
  
      headers.body = JSON.stringify(body);
  }

  return await fetch("/" + path, headers).then(el => el.json());
}

function saveData(){
  sendRequest("setData", "POST", {value: materialInShop, id: data});
}

function init(){
  sendRequest("getData", "GET").then(dataValue => {
    materialInShop = dataValue.value || [];
    data = dataValue.id || 0;
  
    document.getElementById("materialInShop").innerHTML = materialInShop.map(el => {
      return `<li><input type="checkbox" onclick="setStatus(this)" id="box${el.id}" ${el.status ? "checked" : ""}>${el.title} - ${el.count} шт <input onclick="deleteElement(this)" value="x" type="button" id="delete${el.id}"></li>`;
    }).join("");
  });
}

init();