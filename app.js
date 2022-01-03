/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  DOM  //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const dataBtn = document.getElementById("btn-get");
const container = document.getElementById("data-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const spinner = document.querySelector(".spinner");
const buscador = document.getElementById("buscador");
const paginador = document.querySelector(".paginator");
const form = document.getElementById("form");
const errorEl = document.getElementById("error");

let offset = 1;
let limit = 8;
let cardCont;
let region;
let cardBg;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Events /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Estos eventos van intercambiando entre las paginas de la API con los personajes
prevBtn.addEventListener("click", () => {
  if (offset != 1) {
    borrarCards();
    offset -= 9;
    getPkmns(offset, limit);
  }
});
nextBtn.addEventListener("click", () => {
  borrarCards();
  offset += 9;
  getPkmns(offset, limit);
});

// Intento por agregar una validación al formulario, fallido

// form.addEventListener("submit", (e) => {
//   let messages = "";
//   if (buscador.value > 898 || buscador.value < 0) {
//     messages = "Por favor ingresa un numero entre 1 y 898";
//     console.log("Test");
//   }

//   if (messages.length > 0) {
//     e.preventDefault();
//     errorEl.innerText = messages;
//   }
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Esta funcion trae (fetch) los datos de la API
function getData(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => {
      renderData(data);
      bgColors(data);
      prevBtn.style.visibility = "visible";
      nextBtn.style.visibility = "visible";
      spinner.style.display = "none";
    });
  paginator(offset, limit);
  getReg(id);
}

// Esta función define la cantidad de pokemones que se van a mostrar en el DOM
function getPkmns(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    getData(i);
  }
}

function getPkmn(event) {
  borrarCards();
  paginador.innerHTML = "";
  event.preventDefault();
  const { value } = event.target.pokemon;
  fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
    .then((res) => res.json())
    .then((data) => {
      renderPkmn(data);
      bgColor(data);
    });
}

function renderPkmn(data) {
  const sprite = data.sprites.front_default;
  const id = data.id.toString().padStart(3, 0);
  const name = data.name;
  const cardInd = document.createElement("div");
  cardInd.classList.add("big-card");
  cardBg = cardInd;

  let type = data.types.map((type) => type.type.name).join(", ");
  let tipos = type.split(",");
  let imagenes = "";
  for (let i = 0; i < tipos.length; i++) {
    let nombre = tipos[i].replace(/ /g, "");
    imagenes += `<img src="img/${nombre}.png">`;
  }

  cardInd.innerHTML = `
  <div class="card-container1">
    <p>ID: #${id}</p>
    <span>${imagenes}</span>
  </div>
  <div class="card-container2">
    <img src="${sprite}" alt="${name}">
  </div>
  <div class="card-container3">
    <h2>${name}</h2>
    <p>${region}</p>
  </div>
  `;
  container.appendChild(cardInd);
  cardInd.appendChild(stats(data.stats));
}

function stats(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 6; i++) {
    const stat = stats[i];

    const statData = stat.base_stat;
    const statContainer = document.createElement("div");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("div");
    statName.textContent = stat.stat.name;

    const dataContainer = document.createElement("div");
    dataContainer.classList.add("data-container");

    dataContainer.textContent = statData;

    statContainer.appendChild(statName);
    statContainer.appendChild(dataContainer);
    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

// Esta funcion muestra a los pokemones en el DOM
function renderData(data) {
  const sprite = data.sprites.front_default;
  const id = data.id.toString().padStart(3, 0);
  const name = data.name;
  const card = document.createElement("div");
  card.classList.add("card");
  cardCont = card; // nos permite acceder a las cards en el scope global

  let type = data.types.map((type) => type.type.name).join(", ");
  let tipos = type.split(",");
  let imagenes = "";
  for (let i = 0; i < tipos.length; i++) {
    let nombre = tipos[i].replace(/ /g, "");
    imagenes += `<img src="img/${nombre}.png">`;
  }

  card.innerHTML = `
  <div class="box-container1">
    <p>ID: #${id}</p>
    <span>${imagenes}</span>
  </div>
  <div class="box-container2">
    <img src="${sprite}" alt="${name}">
    <h2>${name}</h2>
  </div>
  <div class="data-box">
  <p>${region}</p>
  </div>
  `;
  container.appendChild(card);
}

// Esta funcion borra el contenido del DOM para que los pokemones nuevos que aparezcan no se sobreescriban en los anteriores
function borrarCards() {
  container.innerHTML = "";
}

// Esta funcion inhabilita los botones prev o next cuando no es posible usarlos
function paginator(offset, limit) {
  offset != 1 ? (prevBtn.style.display = "inline-block") : (prevBtn.style.display = "none");
  offset != 890 ? (nextBtn.style.display = "inline-block") : (nextBtn.style.display = "none");
}

// Esto llama a la funcion GETPKMNS
getPkmns(offset, limit);

function getReg(id) {
  if (id <= 151) {
    region = "Kanto";
  } else if (id <= 251) {
    region = "Johto";
  } else if (id <= 386) {
    region = "Hoenn";
  } else if (id <= 490) {
    region = "Sinnoh";
  } else if (id <= 649) {
    region = "Teselia";
  } else if (id <= 721) {
    region = "Kalos";
  } else if (id <= 802) {
    region = "Alola";
  } else if (id <= 889) {
    region = "Galar";
  }
}

// Esta funcion cambia el color de fondo de las cards dependiendo de el tipo del pokemon
function bgColors(data) {
  let cardType = data.types[0].type.name;

  switch (cardType) {
    case "grass":
      cardCont.style.backgroundColor = "#78C850";
      break;

    case "fire":
      cardCont.style.backgroundColor = "#F08030";
      break;

    case "water":
      cardCont.style.backgroundColor = "#6890F0";
      break;

    case "bug":
      cardCont.style.backgroundColor = "#A8B820";
      break;

    case "normal":
      cardCont.style.backgroundColor = "#A8A878";
      break;

    case "poison":
      cardCont.style.backgroundColor = "#a040a0";
      break;

    case "electric":
      cardCont.style.backgroundColor = "#F8D030";
      break;

    case "ground":
      cardCont.style.backgroundColor = "#E0C068";
      break;

    case "fairy":
      cardCont.style.backgroundColor = "#EE99AC";
      break;

    case "fighting":
      cardCont.style.backgroundColor = "#C03028";
      break;

    case "psychic":
      cardCont.style.backgroundColor = "#F85888";
      break;

    case "rock":
      cardCont.style.backgroundColor = "#B8A038";
      break;

    case "ghost":
      cardCont.style.backgroundColor = "#705898";
      break;

    case "ice":
      cardCont.style.backgroundColor = "#98D8D8";
      break;

    case "dragon":
      cardCont.style.backgroundColor = "#7038F8";
      break;
  }
}

// Esta funcion hace lo mismo que la anterior, en las cards individuales.
function bgColor(data) {
  let cardType = data.types[0].type.name;

  switch (cardType) {
    case "grass":
      cardBg.style.backgroundColor = "#78C850";
      break;

    case "fire":
      cardBg.style.backgroundColor = "#F08030";
      break;

    case "water":
      cardBg.style.backgroundColor = "#6890F0";
      break;

    case "bug":
      cardBg.style.backgroundColor = "#A8B820";
      break;

    case "normal":
      cardBg.style.backgroundColor = "#A8A878";
      break;

    case "poison":
      cardBg.style.backgroundColor = "#a040a0";
      break;

    case "electric":
      cardBg.style.backgroundColor = "#F8D030";
      break;

    case "ground":
      cardBg.style.backgroundColor = "#E0C068";
      break;

    case "fairy":
      cardBg.style.backgroundColor = "#EE99AC";
      break;

    case "fighting":
      cardBg.style.backgroundColor = "#C03028";
      break;

    case "psychic":
      cardBg.style.backgroundColor = "#F85888";
      break;

    case "rock":
      cardBg.style.backgroundColor = "#B8A038";
      break;

    case "ghost":
      cardBg.style.backgroundColor = "#705898";
      break;

    case "ice":
      cardBg.style.backgroundColor = "#98D8D8";
      break;

    case "dragon":
      cardBg.style.backgroundColor = "#7038F8";
      break;
  }
}
