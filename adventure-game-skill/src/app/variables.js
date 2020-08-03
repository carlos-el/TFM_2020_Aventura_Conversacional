const Map = require("./models/map.js");
const ElementCollection = require("./models/elementCollection.js");

const m = new Map()
const ec = new ElementCollection()



exports.playerName = function (voxaEvent) {
  return voxaEvent.model.game.choices.name;
};

exports.playerSex = function (voxaEvent) {
  return voxaEvent.model.game.choices.sex;
};

exports.sexSuffix = function (voxaEvent) {
  if (voxaEvent.model.game.choices.sex === "male")
    return "o";
  else if (voxaEvent.model.game.choices.sex === "female")
    return "a";
};

exports.playerVoice = function (voxaEvent) {
  if (voxaEvent.model.game.choices.sex === "male")
    return "Miguel";
  else if (voxaEvent.model.game.choices.sex === "female")
    return "Lucia";
};

exports.playerDoorColor = function (voxaEvent) {
  if (voxaEvent.model.game.choices.sex === "male")
    return "azul";
  else if (voxaEvent.model.game.choices.sex === "female")
    return "rosa";
};

exports.sandraVoice = function (voxaEvent) {
  return "Conchita";
};

///// INSPECT VARIABLES /////
exports.describeInspectElementOrObject = function (voxaEvent) {
  if (voxaEvent.model.control.elementOrObjectToDescribeAlreadyInspected) {
    return ec.elements[voxaEvent.model.control.elementOrObjectToDescribe].alreadyInspectedQuote;
  } else {
    return ec.elements[voxaEvent.model.control.elementOrObjectToDescribe].inspectQuote;
  }
};

///// MAP EXPLORATION VARIABLES /////
// Based on default map elements
exports.describeLocationFullQuote = function (voxaEvent) {
  return describeLocation(voxaEvent) + " " + describeStuff(voxaEvent);
};
exports.describeLocationFullQuoteWithStory = function (voxaEvent) {
  return describeLocation(voxaEvent) + " " + describeStory(voxaEvent) + " " + describeStuff(voxaEvent);
};

exports.describePath = function (voxaEvent) {
  const symbolToCardinal = { N: "norte", S: "sur", E: "este", O: "oeste" }
  const intros = ["Cogeré el camino del", "Iré hacia el", "Viajaré hacia el", "Tomaŕe el camino del"];
  
  return intros[Math.floor(Math.random() * intros.length)] + " " + symbolToCardinal[voxaEvent.model.control.pathToDescribe.path];
};
exports.describePathProblem = function (voxaEvent) {
  return "Describing path problem"
};


describeLocation = function (voxaEvent) {
  const intros = ["Parece que estoy en", "Estoy en", "Este lugar es", "Este sitio es", "Ahora me encuentro en"]
  return intros[Math.floor(Math.random() * intros.length)] + " " + m.locations[voxaEvent.model.game.map.currentLocation].locationQuote;
};

describeStory = function (voxaEvent) {
  return m.locations[voxaEvent.model.game.map.currentLocation].storyQuote;
};

describeStuff = function (voxaEvent) {
  const intros = ["En la zona", "En el área", "En este lugar"]
  const intros2 = ["puedo ver", "hay", "veo", "puedo ver que hay"]

  const elements = describeElements(voxaEvent);
  const objects = describeObjects(voxaEvent);
  let instrosElementsObjects = ""

  if (elements || objects){
    instrosElementsObjects = intros[Math.floor(Math.random() * intros.length)] + " " + intros2[Math.floor(Math.random() * intros2.length)] 
  }

  return instrosElementsObjects + " " + elements + " " + objects + " " + describeNpcs(voxaEvent) + " " + describeExistingPaths(voxaEvent);
};

// Based on session model of the player and elements and objects Collections
describeElements = function (voxaEvent) {
  let res = "";

  // For each element in the elements object reflected in the session we get the mention quote
  let alreadyInspected = ""
  const length = Object.keys(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements).length;
  for (let i = 0; i < length; i++) {
    alreadyInspected = Object.entries(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements)[i][1];
    // If the element has been already inspected select a different quote
    if (alreadyInspected) {
      res += ec.elements[Object.entries(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements)[i][0]].mentionAlreadyInspectedQuote;
    } else {
      res += ec.elements[Object.entries(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements)[i][0]].mentionQuote;
    }

    // add conjuncion before last element
    if (i === length - 2) {
      res += " y ";
    }
    // add coma
    if (i < length - 2) {
      res += ", ";
    };
  }

  return res;
};

describeObjects = function (voxaEvent) {
  return "Mencion objectos";
};

describeNpcs = function (voxaEvent) {
  return "Mencion personajes";
};

describeExistingPaths = function (voxaEvent) {
  let res = "";
  let locQuote = "";
  let cardinal = ""
  const symbolToCardinal = { N: "norte", S: "sur", E: "este", O: "oeste" }
  const intros = ["Desde aquí puedo tomar", "Desde este lugar puedo tomar", "Desde este sitio puedo tomar"];
  let intros2 = "";
  let intermediateIntro = "";
  const to = voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].to;
  const keys = Object.keys(to)

  if (keys.length === 0){
    return "";
  } else if (keys.length === 1) {
    intermediateIntro = "un solo camino,"
  } else {
    intermediateIntro = "varios caminos."
  }

  for (let i = 0; i < keys.length; i++){
    key = keys[i];
    locQuote = m.locations[to[key].goesTo].locationQuote;
    cardinal = symbolToCardinal[key];
    intros2 = ["el camino del "+cardinal+" que lleva hacia", "ir hacia el "+cardinal+" me llevará a", "dirección "+cardinal+" llegaré a", "caminando hacia el "+cardinal+" iré a"];
    res += intros2[Math.floor(Math.random() * intros.length)] + " " + locQuote;
    
    // add conjuncion before last element
    if (i === keys.length - 2 && 1 < keys.length) {
      res += " y ";
    }
    // add coma
    if (i < keys.length - 2) {
      res += ", ";
    };
  }

  return intros[Math.floor(Math.random() * intros.length)] + " " + intermediateIntro + " " + res;
};


