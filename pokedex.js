// DECLARATION OF GLOBAL VARIBLES
const main$$=document.querySelector(".main");
const header$$=document.querySelector(".header");
const lifeBoard$$=document.createElement("div");
const loadingDiv$$=document.querySelector(".spinner")

let itemsprinted=0;
let pokemonsToPrint=[];

const mainlistpokemons=[];
let mainlisttypes=[];
let mainlistgenerations=[];
const allGenerations=[];
const allTypes=[];
let pokemonsListFiltered=[];

let turn="";
let userlife=500;
let cpulife=500;


/// añadir nodos al html
const nav$$=document.createElement("nav");
nav$$.className="b-header__nav";
nav$$.innerHTML=`<span>FIND YOUR POKEMON: </span><input type="text" placeholder="Insert name" class="b-header__input">
<select class="b-header__type"><option value="" selected disabled hidden>Filter by type</option></select>
<select class="b-header__generation"><option value="" selected disabled hidden>Filter by generation</option></select>`;
header$$.appendChild(nav$$);
const nameFilter$$=document.querySelector(".b-header__input");
const typeFilter$$=document.querySelector(".b-header__type");
const generationFilter$$=document.querySelector(".b-header__generation");
const mainContainer$$=document.createElement("div");
mainContainer$$.className="b-maincontainer";
main$$.appendChild(mainContainer$$);


/// eventos
nameFilter$$.addEventListener("input",function(){nameFilter(mainlistpokemons,nameFilter$$.value)});
typeFilter$$.addEventListener("change",function(){typeFilter(mainlisttypes,typeFilter$$.value,mainlistpokemons)});
generationFilter$$.addEventListener("change",function(){generationFilter(mainlistgenerations,generationFilter$$.value,mainlistpokemons)})


// filtro por nombre con lo que tengo en el input
const nameFilter =(pokemons,input)=>{

      /// genero nameFiltered filtrando la lista de todos los pokemon
      // con lo introducido en el input
     const nameFiltered = pokemons.filter(pokemon=>{
         
        if (pokemon.name.toLowerCase().includes(input.toLowerCase())){         /// 
            
            return pokemon;
        }
  })
  // llamada a get details con parametro lista de pokemons que coinciden
  // con su nombre y url
    getDetails(nameFiltered);
}


// filtro por opcion elegida en el select de tipos
const typeFilter = (listtypes,input,listpokemons)=>{
    // genero typeFiltered filtrando la lista de todos los tipos de pokemon
    // con la opcion elegida en select
    const typeFiltered = listtypes.filter(listtype=>{
        if (listtype.name === input){
            return listtype
        }
    })
    
    // genero pokemonsTypeFiltered que es un array obtenido de filtrar la lista de todos los pokemons
    // y cotejandola con un bucle con los integrantes de el tipo de pokemon seleccionado
    const pokemonsTypeFiltered= listpokemons.filter(listpokemon=>{
        if (typeFiltered[0].integrators.includes(listpokemon.name)){
            return listpokemon
        }
    });   
 
    // llamada a getdetails con parametro lista de pokemons que coinciden
    // con su nombre y url
     getDetails(pokemonsTypeFiltered)
}

// filtro por opcion elegida en select de generation
const generationFilter = (listgenerations,input,listpokemons)=>{
    
     // genero generationFiltered filtrando la lista de todos las generaciones de pokemon
    // con la opcion elegida en select
    const generationFiltered = listgenerations.filter(listgeneration=>{
        if (listgeneration.name === input){
            return listgeneration
        }
    })
    
    // genero pokemonsGenerationFiltered que es un array obtenido de filtrar la lista de todos los pokemons
    // y cotejandola con un bucle con los integrantes de la generacion de pokemon seleccionado
    
    const pokemonsGenerationFiltered= listpokemons.filter(listpokemon=>{
        if (generationFiltered[0].integrators.includes(listpokemon.name)){
            return listpokemon
        }
        
        });
        
    // llamada a getdetails con parametro lista de pokemons que coinciden
    // con su nombre y url
     getDetails(pokemonsGenerationFiltered)
}


/// obtiene las listas de todos los pokemon
async function getPokemonslist(){

    loadingDiv$$.removeAttribute('hidden');
 
    ///   lista-array de todos los pokemon con nombre y url para detalles para listar en documento de inicio y para
    ///   usarla para el filtro por nombre
        const allpokemons= await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=160")
        
        const listPokemon = await allpokemons.json();
    
    // genero mi propio array mainlistpkemons 
    for (const pokemon of listPokemon.results) {
            let itempokemonlist = {
                
                name: pokemon.name,
                url: pokemon.url
            } 
            mainlistpokemons.push(itempokemonlist);
        }
        //console.log(mainlistpokemons)

    


    // lista - array de todos los tipos con sus integrantes
        for (let j=1; j <19;j++){
            const alltypes= await fetch("https://pokeapi.co/api/v2/type/"+j)
            const listTypes = await alltypes.json();
            allTypes.push(listTypes);
        }
        // genero mi propio array mainlisttypes
            mainlisttypes = allTypes.map((item)=>({
            name: item.name,
            integrators: item.pokemon.map((type)=>type.pokemon.name)
        }))
        // agregar al select cada tipo de pokemon que hay
        for (const type of mainlisttypes) {
            const typeInSelect=type.name;
            const option$$=document.createElement("option");
            option$$.value=typeInSelect;
            option$$.textContent=typeInSelect.toUpperCase();
            typeFilter$$.appendChild(option$$);

        }
        
        //console.log(mainlisttypes)

    // lista - array de todas las generaciones con sus integrantes
        for (let i=1; i <10;i++){
            const allgenerations = await fetch("https://pokeapi.co/api/v2/generation/"+i);
            const listGenerations = await allgenerations.json();
            allGenerations.push(listGenerations);
        }
        // genero mi propio array mainlistgeneratios
            mainlistgenerations = allGenerations.map((item)=>({
            name: item.name,
            integrators: item.pokemon_species.map((type)=>type.name)
        }))
        // agregar al select cada generacion de pokemon que hay
        for (const generation of mainlistgenerations) {
            const generationInSelect=generation.name;
            const option$$=document.createElement("option");
            option$$.value=generationInSelect;
            option$$.textContent=generationInSelect.toUpperCase();
            generationFilter$$.appendChild(option$$);

        }
   // console.log(mainlistgenerations);


    getDetails(mainlistpokemons);
    
}

 // lista - array 20 primeros pokemon a mostrar

const getDetails = async (mainlistpokemons)=>{
    let mainListDetails=[];
    
    for (let i=0;i<mainlistpokemons.length;i++){

        const pokemon = mainlistpokemons[i];
        
        const detailspokemon=await fetch(pokemon.url);
        const listDetails= await detailspokemon.json();
        
        pokemonsToPrint ={
        id: listDetails.id,
        name: pokemon.name,
        type: [listDetails.types.map((item)=>item.type.name)],
        img: listDetails.sprites.front_default
        }
        mainListDetails.push(pokemonsToPrint)
        //console.log(pokemomsToPrint)
    }
    loadingDiv$$.setAttribute('hidden', '');
    //console.log(mainListDetails)
    printPokemon(mainListDetails)
}


const printPokemon = (pokemons)=>{
    mainContainer$$.innerHTML=``;
    const informBattle$$=document.createElement("h4");
    informBattle$$.className="b-informbattle";
    informBattle$$.textContent="<<< Click a pokemon for battle >>>";
    mainContainer$$.appendChild(informBattle$$);
    pokemons.forEach(pokemon => {
        
        const container$$=document.createElement("div");
        container$$.className="b-container";
        container$$.innerHTML=`<h5><span>#${pokemon.id}</span>Name</h5>
        <h4>${pokemon.name.toUpperCase()}</h4>
        <img src="${pokemon.img}" class="b-container__img">
        </span>
        <h7>Type</h7>
        <span>${pokemon.type}`;
        mainContainer$$.appendChild(container$$)
        container$$.addEventListener("click",function(){battle(pokemon.id)})
        
        
    });
}
const battle=async (id)=>{
    // get de objeto del pokemons del ususario
    let battleCall = await fetch("https://pokeapi.co/api/v2/pokemon/"+id);
    const pokemonUser= await battleCall.json();
    // get de objeto del pokemons de cpu  
    let random=Math.floor(Math.random() * 150) + 1;
    battleCall = await fetch("https://pokeapi.co/api/v2/pokemon/"+random);
    const pokemonCpu= await battleCall.json();
    
    // oclulta el container con el listado de pokemons y visible el div para la batalla
    mainContainer$$.className="b-maincontainer--hidden";
    main$$.className="b-main--nobackground";
    const battleContainer$$ = document.createElement("div");
    battleContainer$$.className="b-battlecontainer";
    main$$.appendChild(battleContainer$$);
    
    //elige quien empieza
    let Starter="";
    if (random <= 75){
         Starter = pokemonUser.name
    }
    else{
        Starter = pokemonCpu.name
    }
    // añade los elementos al html 
    battleContainer$$.innerHTML=`<img src="${pokemonUser.sprites.other.home.front_default}" class="b-battle__img"><h2>VS.</h2>
    <img src="${pokemonCpu.sprites.other.home.front_default}" class="b-battle__img">`
    const battleBoard$$=document.createElement("div");
    battleBoard$$.className="b-battle__board";
    battleBoard$$.innerHTML=`<h3 class="b-battle__board--user">User's pokemon: ${pokemonUser.name}</h3>
    <h2>${Starter.toUpperCase()}  starts.</h2><button class="b-battle__button">GO!</button>
    <h3 class="b-battle__board--cpu">Cpu's pokemon: ${pokemonCpu.name}</h3>`    
    main$$.appendChild(battleBoard$$);
    const battleButton$$=document.querySelector(".b-battle__button");
    battleButton$$.addEventListener("click",function(){starts(pokemonCpu,pokemonUser,Starter,battleButton$$)});
 
}
const starts=(pokemonCpu,pokemonUser,Starter,battleButton$$)=>{
    battleButton$$.className="b-battle__button--clicked";
    turn="";
    userlife=500;
    cpulife=500;
    lifeBoard$$.className="b-lifeboard";
    lifeBoard$$.innerHTML=`<section><span class="b-lifeboard__user">POWER: 500</span></section>
    <section><button class="b-lifeboard__button">FIGHT</button></section>
    <section><span class="b-lifeboard__cpu">POWER: 500</span></section>`;
    main$$.appendChild(lifeBoard$$);
    
    const fightbutton$$=document.querySelector(".b-lifeboard__button");
   
    fightbutton$$.addEventListener("click",function(){fight(pokemonCpu,pokemonUser,Starter)});
    
   // userlife$$.style.width=`${k}%`;

}
const fight=(pokemonCpu,pokemonUser,Starter)=>{
    const userlife$$=document.querySelector(".b-lifeboard__user");
    const cpulife$$=document.querySelector(".b-lifeboard__cpu");
    const battleScreen$$=document.querySelector(".b-battle__board");
    let hitcpu="";
    let hituser="";
    if (turn != ""){Starter=""}
    
    if (Starter === pokemonCpu.name || turn=="cpu"){
            
            hitcpu= cpuhit(pokemonCpu,userlife);
            console.log("entra en cpu y ataque:" + hitcpu)
            battleScreen$$.innerHTML=`<h4>${pokemonCpu.name} attack= ${hitcpu}</h4>`;
            userlife-=hitcpu;
            hitcpu=0;
            if (userlife <=0){
                battleScreen$$.innerHTML=`<h4>${pokemonCpu.name} WINS!!!</h4>`;
                lifeBoard$$.innerHTML=`<button class="b-lifeboard__reset"> RESET</button>`;
                const resetButton$$=document.querySelector(".b-lifeboard__reset");
                resetButton$$.addEventListener("click",hidebattle);
            }
            else{

                userlife$$.style.width=`${parseFloat(((userlife*100)/500),2)}%`;
                userlife$$.textContent=`POWER: ${userlife}`;
                
            }


     }
     if (Starter === pokemonUser.name || turn=="user"){
        
            hituser= userhit(pokemonUser,cpulife);
            console.log("entra en user y ataque: "+hituser)
            battleScreen$$.innerHTML=`<h4>${pokemonUser.name} attack= ${hituser}</h4>`;
            cpulife-=hituser;
            hituser=0;
            if (cpulife <=0){
                battleScreen$$.innerHTML=`<h4>${pokemonUser.name} WINS!!!</h4>`;
                lifeBoard$$.innerHTML=`<button class="b-lifeboard__reset"> RESET</button>`;
                const resetButton$$=document.querySelector(".b-lifeboard__reset");
                resetButton$$.addEventListener("click",hidebattle);
            }
            else{
                console.log()
                cpulife$$.style.width=`${parseFloat(((cpulife*100)/500),2)}%`;
                cpulife$$.textContent=`POWER: ${cpulife}`
                
            }
        
    }
    
       if (hitcpu===0){turn="user"}
       if (hituser===0){turn="cpu"}
 }

const cpuhit=(pokemonCpu)=>{
    let hit=Math.floor(Math.random() * 20) + 1;
    hit+=pokemonCpu.stats[1].base_stat;
    
    return hit;

     
}
const userhit=(pokemonUser)=>{
    let hit=Math.floor(Math.random() * 20) + 1;
    hit+=pokemonUser.stats[1].base_stat;
    return hit;

     
}
const hidebattle=()=>{
    const hidefirstDiv$$=document.querySelector(".b-battlecontainer");
    const hidesecondDiv$$=document.querySelector(".b-battle__board");
    const hidethirdDiv$$=document.querySelector(".b-lifeboard");

    hidefirstDiv$$.className="b-battlecontainer--hidden";
    hidesecondDiv$$.className="b-battle__board--hidden";
    hidethirdDiv$$.className="b-lifeboard--hidden"
    mainContainer$$.className="b-maincontainer";
    main$$.className="main"

}





getPokemonslist();