

let validPlayers = [    
    {
        name:"Dani",
        points:5000,
    },

    {
        name:"Marcos",
        points:3200,
    },

    {
        name:"Kike",
        points:7500,
    },

    {
        name:"Aitor",
        points:6000,
    },
    {
        name:"Jorge",
        points:1500,
    },

    {
        name:"Morita",
        points:8000,
    },
]

let fixedCourts = [
    {
        numberCourt:1,
        reves: "Dani",
        derecha:"Marcos",
        totalPoints:0,
        closed
    }
]

let listAllPossibilities = [];

export function GetAllMatchPossibilitiesNoParameter()
{
    GetAllMatchPossibilities(validPlayers,fixedCourts);
}

export function GetAllMatchPossibilities(listValidPlayers,listFixedCourts)
{
    let newMatch = [];    
    let listPlayersRemaingAdd = [...listValidPlayers];

    AddFixedCourtsToMatch(listFixedCourts,listPlayersRemaingAdd,newMatch)
    validPlayers.sort(function(a, b){
        return parseInt(b.points , 10) - 
              parseInt(a.points, 10);
    });           

    console.log(validPlayers);
    console.log(listPlayersRemaingAdd);


    listPlayersRemaingAdd.forEach((value,index)=> {
        AddPlayerToMatch(listPlayersRemaingAdd,index,0,newMatch);
    });
}

function AddFixedCourtsToMatch(listFixedCourts,listValidPlayers,newMatch)
{
    listFixedCourts.forEach(element => {
        
        console.log(element);
        element.totalPoints = listValidPlayers.find(x => x.name === element.reves)?.points  + listValidPlayers.find(x => x.name === element.derecha)?.points;

        listValidPlayers = listValidPlayers.filter((value,index,arr)=>
        {
            console.log(value,index,arr);
            return value.name != element.reves && value.name != element.derecha;
        })        
        
        element.derecha !== "" && element.reves !== "" ? element.closed = true : element.closed = false;
        
        if(element.numberCourt !== "")
            newMatch[element.numberCourt -1] = element;        
    });

    for(let i = 0;i<3;i++)
    {
        if(newMatch[i] === undefined)
        {
            newMatch[i] = {
                numberCourt:i+1,
                reves: "",
                derecha:"",
                totalPoints:0,
                closed:false
            }
        }
    }
    console.log(newMatch);
}

const courtPositions = ['reves','derecha'];

function AddPlayerToMatch(listValidPlayers,indexPlayerAdd,indexCourt,currentMatch)
{        
   listValidPlayers.forEach((x) => {
       console.log(x);
   })

    if(CheckMatchIsCompleted(currentMatch))
    {
        console.log("Match completed",currentMatch);
    }

    if(listValidPlayers.length == 0)
    {
        console.log("list players count is 0 need to return");
        return;
    }

    // console.log(currentMatch);

    for(let i= 0;i<3;i++)
    {        
        console.log("Start court " + i);
        if(currentMatch[i].closed === false)
        {
            for(let indexPosition = 0;indexPosition<2;indexPosition++)
            {                
                console.log(`Check position in court ${i} ` + courtPositions[indexPosition]);
                if(currentMatch[i][courtPositions[indexPosition]] === "")
                {            
                    console.log(`Position ${courtPositions[indexPosition]} is Empty`);
                    AddPlayerToCourt(courtPositions[indexPosition],listValidPlayers[0],currentMatch[i])
                    if(i>0)
                    {
                        console.log("Check if valid by points");
                        if(currentMatch[i].totalPoints > currentMatch[i-1].totalPoints)
                        {
                            console.log("Court is not vald by points");
                            RemovePlayerToCourt(courtPositions[indexPosition],currentMatch[i]);
                            let playerDone =  listValidPlayers.shift();  
                            console.log(playerDone)                          ;
                            listValidPlayers.push(playerDone);
                            // return AddPlayerToMatch(listPlayersRemaingAdd,0,0,currentMatch);
                        }
                        else{
                            let playerDone =  listValidPlayers.shift();
                            if(listValidPlayers.length > 0)
                            {
                                return AddPlayerToMatch(listValidPlayers,0,0,currentMatch);
                                listPlayersRemaingAdd.unshift(playerDone);
                            }
                            else{
                                return;
                            }
                        }
                    }                
                }                   
                else{
                    console.log(`Position ${courtPositions[indexPosition]} is Ocuppied`);
                }
            }
        }
    }
}

function AddPlayerToCourt(position,playerToAdd,courtToModify)
{    
    console.log("Adding player to court ",position,playerToAdd,courtToModify);

    position == "reves" ? courtToModify.reves = playerToAdd.name : courtToModify.derecha = playerToAdd.name;                         
    UpdateCourt(courtToModify);
}

function RemovePlayerToCourt(position,courtToModify)
{
    position === "reves" ? courtToModify.reves = "" : courtToModify.derecha = "";                         
    UpdateCourt(courtToModify);
}

function UpdateCourt(courtUpdate)
{
    courtUpdate.derecha !== "" && courtUpdate.reves !== "" ? courtUpdate.closed = true : courtUpdate.closed = false;
    courtUpdate.totalPoints = validPlayers.find(x => x.name === courtUpdate.reves)?.points  + validPlayers.find(x => x.name === courtUpdate.derecha)?.points;    
}

function CheckMatchIsCompleted(matchCheck)
{
    return matchCheck.every((value) => value.closed === true)
}
