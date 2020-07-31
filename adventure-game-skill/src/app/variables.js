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
exports.describeFullQuote = function (voxaEvent) {
  return describeLocation(voxaEvent) + " " + describeElements(voxaEvent) + " " + describeObjects(voxaEvent) + " " + describeNpcs(voxaEvent);
};
exports.describeFullQuoteWithStory = function (voxaEvent) {
  return describeLocation(voxaEvent) + " " + describeStory(voxaEvent) + " " + describeElements(voxaEvent) + " " + describeObjects(voxaEvent) + " " + describeNpcs(voxaEvent);
};





describeLocation = function (voxaEvent) {
  const intros = ["Parece que estoy en", "Estoy en", "Este lugar es", "Este sitio es", "Ahora me encuentro en"]
  return intros[Math.floor(Math.random() * intros.length)] + " " + m.locations[voxaEvent.model.game.map.currentLocation].locationQuote;;
};

describeStory = function (voxaEvent) {
  return m.locations[voxaEvent.model.game.map.currentLocation].storyQuote;
};

// Based on session model of the player and elements and objects Collections
describeElements = function (voxaEvent) {
  let res = "";
  const intros = ["En la zona", "En el área", "En este lugar"]
  const intros2 = ["puedo ver", "hay", "veo", "puedo ver que hay"]

  // For each element in the elements object reflected in the session we get the mention quote
  let alreadyInspected = ""
  const length = Object.keys(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements).length;
  for (var i = 0; i < length; i++) {
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

  return intros[Math.floor(Math.random() * intros.length)] + " " + intros2[Math.floor(Math.random() * intros2.length)] + " " + res + ".";
};

describeObjects = function (voxaEvent) {
  return "Mencion objectos";
};

describeNpcs = function (voxaEvent) {
  return "Mencion personajes";
};

