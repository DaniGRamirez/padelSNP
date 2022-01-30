// alert("Test");
console.log("After alert");
// alert("Test1");

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { collection, getDocs, addDoc,deleteDoc ,doc,updateDoc, deleteField, Timestamp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
import { query, orderBy, limit, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
// import { format } from "path/posix";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9hvs1FrXjUSsl_s9xrrG0MQIrrpAjeNo",
  authDomain: "padelsnp-613f0.firebaseapp.com",
  databaseURL: "https://padelsnp-613f0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "padelsnp-613f0",
  storageBucket: "padelsnp-613f0.appspot.com",
  messagingSenderId: "393804589779",
  appId: "1:393804589779:web:9e5bb93b44379849a28226",
  measurementId: "G-TX63CG3K4V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getPlayers(db) {
  const playersCol = collection(db, 'padelPlayers');  
  const playersSnapshot = await getDocs(playersCol);  
  console.log(playersSnapshot);
  const playersList = playersSnapshot.docs.map(doc => ({data: doc.data(),id: doc.id}));
  console.log(playersList);
  return playersList;
}

let listElement = document.getElementById("listPlayersDiv");
const formAddPlayer = document.getElementById("addPlayerForm")

async function renderPlayersList()
{
  console.log("Pre get");  
  let playerList = await getPlayers(db) 
  playerList.map(player =>{
        renderPlayer(player);
      });
  console.log(playerList);
  console.log("Post get");    

  SortPlayerList(listElement);

}

function renderPlayer(player)
{
  let liParent = document.createElement('li');
  let name = document.createElement('span');
  let points = document.createElement('input');
  points.setAttribute("id", "points");
  points.setAttribute("type","number");  

  let btnDelete = document.createElement("button");  
  let btnUpdate = document.createElement("button");  
  
  name.textContent = player.data.name;
  points.value = player.data.points;
  btnDelete.innerHTML = " -x- ";
  btnUpdate.innerHTML = " @ ";

  liParent.setAttribute('data-id',player.id);

  liParent.appendChild(name);
  liParent.appendChild(points);
  liParent.appendChild(btnUpdate);  
  liParent.appendChild(btnDelete);  

  console.log(btnDelete);

  btnDelete.addEventListener("click", function () {
     DeletePlayer(player.id);    
  });

  btnUpdate.addEventListener("click", function () {
    UpdatePlayer(liParent);    
 });

  listElement.appendChild(liParent);

  // console.log(player.id);

}

renderPlayersList();

const newPlayerTest = {
  name:"Nuevo",
  points:5959
}

// AddPlayer(newPlayerTest);

async function AddPlayer(playerAdd)
{
  // const playerDoc = collection(db,'padelPplayers');
  // let test =  db.addDoc((playerDoc,playerAdd));
  // console.log("Document written with ID: ", docRef.id);

  try {
    const docRef = await addDoc(collection(db, "padelPlayers"),playerAdd);
    console.log("Document written with ID: ", docRef.id);
    console.log(playerAdd);
    let newDataPlayer = {
      data:
      {
        name: playerAdd.name,
        points: playerAdd.points
      },
      id: docRef.id
    };   
    console.log(newDataPlayer);
    playerAdd.id = docRef.id;
    renderPlayer(newDataPlayer);
    SortPlayerList(listElement);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function DeletePlayer(playerId)
{
  const playerRef = doc(db, 'padelPlayers',playerId);
  console.log(playerRef);
  await deleteDoc(playerRef);
  let elementLiDeleted = document.querySelectorAll(`[data-id="${playerId}"]`);
  listElement.removeChild(elementLiDeleted[0]);
  console.log(elementLiDeleted);
  SortPlayerList(listElement);
}

async function UpdatePlayer(playerLi)
{
  console.log("Update",playerLi);  
  console.log(playerLi.getAttribute("data-id"));
  const playerRef = doc(db, 'padelPlayers',playerLi.getAttribute("data-id"));
  console.log(playerLi.querySelector("#points").value);
  await updateDoc(playerRef,{points: playerLi.querySelector("#points").value});
  SortPlayerList(listElement);
}

formAddPlayer.addEventListener("submit",(e) =>{
  e.preventDefault();  
  console.log(formAddPlayer.namePlayer.value);
  console.log(formAddPlayer.points.value);
  AddPlayer({
    name:formAddPlayer.namePlayer.value,
    points:formAddPlayer.points.value
  });
  formAddPlayer.namePlayer.value = "";
  formAddPlayer.points.value = "";
})

function SortPlayerList(playerList)
{
console.log(playerList);

  var new_ul = playerList.cloneNode(false);
  
  var lis = [];
  for(var i = playerList.childNodes.length; i--;)
  {
    console.log(playerList.childNodes[i].nodeName);
      if(playerList.childNodes[i].nodeName === 'LI')
          lis.push(playerList.childNodes[i]);
  }

  console.log(lis);

  // Sort the lis in descending order
  lis.sort(function(a, b){
      return parseInt(b.querySelector("#points").value , 10) - 
            parseInt(a.querySelector("#points").value , 10);
  });

  // Add them into the ul in order
  for(var i = 0; i < lis.length; i++)
      new_ul.appendChild(lis[i]);
      playerList.parentNode.replaceChild(new_ul, playerList);

  listElement = new_ul;
       
}
