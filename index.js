let pokemonObj;
let pokemonColor;
let savedPokemons = [];

async function displayPokemon() {
  pokemonObj = undefined;
  const pokeDexDiv = document.getElementById("pokemon-pokedex");
  const pokemonName = document.getElementById("pokemon-search").value;
  const pokemonImage = document.getElementById("pokemon-image");
  const pokemonImageDiv = document.getElementById("pokemon-image-div");
  const pokemonImageDetails = document.getElementById("pokemon-details");
  pokemonObj = verifySavedPokemon(pokemonName);
  if (!pokemonObj) {
    console.log("In api call");

    pokemonObj = await fetchPokemon(pokemonName);
    pokemonObj && saveDeleteToggle("save");
  } else {
    saveDeleteToggle("delete");
  }
  //   pokemonColor = await fetchPokemonColor(pokemonObj.id);
  //   pokeDexDiv.style.borderColor = pokemonColor.name;
  if (pokemonObj) {
    if (pokemonObj.sprites) {
      pokemonImage.style.width = "300px";
      pokemonImage.style.height = "300px";
      pokemonImage.src = pokemonObj.sprites.front_default;
      pokemonImageDiv.classList.add("front");
    }
    const pokemonDetails = `<ul style="list-style: none;">
    <li id="pokemon-name">Name : ${pokemonObj.name}</li>
    <li>Id : ${pokemonObj.id}</li>
    <li>No. of Types : ${pokemonObj.types.length}</li>
    <li>No. of Moves : ${pokemonObj.moves.length}</li>
    <li>No. of Abilities : ${pokemonObj.abilities.length}</li>
    <li>Height : ${pokemonObj.height}</li>
   </ul>`;
    pokemonImageDetails.innerHTML = pokemonDetails;
    updateBackground();
  }
}

function saveDeleteToggle(action) {
  const saveButton = document.getElementById("pokemon-save");
  const deleteButton = document.getElementById("pokemon-delete");
  const pokemonExists = document.getElementById("pokemon-exists");
  saveButton.style.display = action === "delete" ? "none" : "block";
  deleteButton.style.display = action === "delete" ? "block" : "none";
  pokemonExists.style.display = action === "delete" ? "block" : "none";
}

// async function fetchPokemon(){
//     fetch("https://pokeapi.co/api/v2/pokemon/ditto").then(response => response.json()).then(res => loadPokemon(res));
// }

// function loadPokemon(data){
//     pokemonObj = data;
// }

async function fetchPokemon(pName) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pName, {
      method: "GET",
      credentials: "same-origin"
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

async function fetchPokemonColor(pName) {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-color/" + pName,
      {
        method: "GET",
        credentials: "same-origin"
      }
    );
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

function flipPokemon() {
  const pImageDiv = document.getElementById("pokemon-image-div");
  const pImage = document.getElementById("pokemon-image");
  if (pImageDiv.classList.contains("front")) {
    pImageDiv.classList.remove("front");
    pImageDiv.classList.add("back");
    pImage.src = pokemonObj.sprites.back_default;
  } else {
    pImageDiv.classList.remove("back");
    pImageDiv.classList.add("front");
    pImage.src = pokemonObj.sprites.front_default;
  }
}

function savePokemon() {
  if (!verifySavedPokemon(pokemonObj.name)) {
    savedPokemons.push(pokemonObj);
    console.log(savedPokemons);
    displaySlides();
  }
}

function deletePokemon() {
  const pName = pokemonObj.name;
  if (savedPokemons.length > 0) {
    savedPokemons = savedPokemons.filter(pokemon => {
      if (pName !== pokemon.name) {
        return pokemon;
      }
    });
  }
  saveDeleteToggle("save");
  displaySlides();
}

function verifySavedPokemon(pName) {
  let savedPokemonObj;
  if (savedPokemons.length > 0) {
    savedPokemonObj = savedPokemons.find(pokemon => {
      if (pName === pokemon.name) {
        return pokemon;
      }
    });
  }
  return savedPokemonObj;
}

function displaySlides() {
  const slideContainer = document.getElementById("pokemon-slideshow-container");
  let allSlideContent = "";
  let arrows = "";
  savedPokemons.map((pokemon, index) => {
    const addSlideContent = `<div class="mySlides fade" id="pokemon-slide-${pokemon.name}">
        <img src="${pokemon.sprites.front_default}" style="width:100%">
      </div>`;
    allSlideContent = allSlideContent + addSlideContent;
  });
  if (savedPokemons.length > 0) {
    arrows = `<a class="prev" onclick="plusSlides(-1)">&#10094;</a>
  <a class="next" onclick="plusSlides(1)">&#10095;</a>`;
  }
  slideContainer.innerHTML = allSlideContent;
  slideContainer.innerHTML = slideContainer.innerHTML + arrows;
  showSlides(1);
}

function updateBackground() {
  const pokemonImageDiv = document.getElementById("pokemon-image-div");
  let color = "white";
  switch (pokemonObj.types[0].type.name) {
    case "grass":
      color = "lightgreen";
      break;
    case "electric":
      color = "lightyellow";
      break;
    case "fire":
      color = "orangered";
      break;
    case "water":
      color = "lightblue";
      break;
    default:
      color = "lightgrey";
  }
  pokemonImageDiv.style.backgroundColor = color;
}
