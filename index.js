let localStorage;
let pokemonObj;
let savedPokemons = [];

window.onunload = function() {
  if (savedPokemons.length > 0) {
    localStorage.setItem("savedPokemons", JSON.stringify(savedPokemons));
    window.localStorage = localStorage;
  } else {
    window.localStorage.clear();
  }
};

window.onload = function(e) {
  localStorage = window.localStorage;
  if (localStorage.getItem("savedPokemons")) {
    savedPokemons = JSON.parse(localStorage.getItem("savedPokemons"));
    displayCarousel();
  }
};

async function displayPokemon() {
  const pokeDexDiv = document.getElementById("pokemon-pokedex");
  const pokemonName = document.getElementById("pokemon-search").value;
  const pokemonImage = document.getElementById("pokemon-image");
  const pokemonImageDiv = document.getElementById("pokemon-image-div");
  const pokemonImageDetails = document.getElementById("pokemon-details");
  document.getElementById("err-msg").style.display = "block";
  pokemonObj = verifySavedPokemon(pokemonName);
  if (!pokemonObj) {
    console.log("In api call");

    pokemonObj = await fetchPokemon(pokemonName);
    pokemonObj && saveDeleteToggle("save");
  } else {
    document.getElementById("err-msg").style.display = "none";
    saveDeleteToggle("delete");
  }
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

async function fetchPokemon(pName) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pName, {
      method: "GET",
      credentials: "same-origin"
    });
    const responseJson = await response.json();
    document.getElementById("err-msg").style.display = "none";
    return responseJson;
  } catch (error) {
    document.getElementById("err-msg").style.display = "block";
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
    saveDeleteToggle("delete");
    displayCarousel();
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
  displayCarousel();
}

function deleteAllPokemon() {
  savedPokemons = [];
  displayCarousel();
  document.getElementById("pokemon-delete-all").style.display = "none";
  saveDeleteToggle("save");
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

function displayCarousel() {
  const displayContainer = document.getElementById("pokemon-container-id");
  displayContainer.innerHTML = "";
  if (savedPokemons.length > 0) {
    document.getElementById("pokemon-delete-all").style.display = "block";
    savedPokemons.forEach(pokemon => {
      const image = `<img src=${pokemon.sprites.front_default} width=300px height=300px />`;
      displayContainer.innerHTML = image + displayContainer.innerHTML;
    });
  } else {
    document.getElementById("pokemon-delete-all").style.display = "none";
  }
}
