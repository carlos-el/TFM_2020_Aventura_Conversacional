const Map = require("./models/map.js");
const ElementCollection = require("./models/elementCollection.js");
const ObjectCollection = require("./models/objectCollection.js");
const NpcCollection = require("./models/npcCollection.js");

const m = new Map()
const ec = new ElementCollection()
const oc = new ObjectCollection()
const nc = new NpcCollection();



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

exports.playerDoorColor = function (voxaEvent) {
  if (voxaEvent.model.game.choices.sex === "male")
    return "azul";
  else if (voxaEvent.model.game.choices.sex === "female")
    return "rosa";
};

///// VOICES /////
exports.playerVoice = function (voxaEvent) {
  if (voxaEvent.model.game.choices.sex === "male")
    return "Miguel";
  else if (voxaEvent.model.game.choices.sex === "female")
    return "Lucia";
};
exports.sandraVoice = function (voxaEvent) {
  return "Conchita";
};

///// INSPECT VARIABLES /////
exports.describeInspectElementOrObject = function (voxaEvent) {
  const objectOrElement = voxaEvent.model.control.elementOrObjectToDescribe;
  const currentLocation = voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation];

  // If it is an element 
  if (objectOrElement in currentLocation.elements) {
    // Print the quote based in if it was already inspected
    if (voxaEvent.model.control.elementOrObjectToDescribeAlreadyInspected) {
      return ec.elements[voxaEvent.model.control.elementOrObjectToDescribe].alreadyInspectedQuote;
    } else {
      return ec.elements[voxaEvent.model.control.elementOrObjectToDescribe].inspectQuote;
    }
  } // If it is an object in the Location 
  else if (objectOrElement in currentLocation.objects) {
    // Print the quote based in if it was dropped by the player
    if (currentLocation.objects[objectOrElement]) {
      return oc.objects[voxaEvent.model.control.elementOrObjectToDescribe].inspectQuote + ". Yo lo dejé en este lugar";
    } else {
      return oc.objects[voxaEvent.model.control.elementOrObjectToDescribe].inspectQuote;
    }
  }
  // If it is an object in the player inventory
  else if (objectOrElement in voxaEvent.model.game.inventory.objects) {
    // Print the quote telling it is in the inventory.
    return "El objeto de mi mochila. " + oc.objects[voxaEvent.model.control.elementOrObjectToDescribe].inspectQuote;
  }

};

///// MAP EXPLORATION VARIABLES /////
exports.describeLocationFullQuote = function (voxaEvent) {
  return describeLocation(voxaEvent) + " " + describeStuff(voxaEvent);
};
exports.describeLocationFullQuoteWithStory = function (voxaEvent) {
  return describeLocation(voxaEvent) + " " + describeStory(voxaEvent) + " " + describeStuff(voxaEvent);
};

exports.describePath = function (voxaEvent) {
  const symbolToCardinal = { N: "norte", S: "sur", E: "este", O: "oeste" }
  const intros = ["Cogeré el camino del", "Iré hacia el", "Viajaré hacia el", "Tomaré el camino del"];

  return intros[Math.floor(Math.random() * intros.length)] + " " + symbolToCardinal[voxaEvent.model.control.pathToDescribe.path];
};
exports.describePathProblem = function (voxaEvent) {
  const problem = voxaEvent.model.control.pathToDescribe.problem;
  const problemsArray = m.locations[voxaEvent.model.game.map.currentLocation].to[voxaEvent.model.control.pathToDescribe.path].problemMentionQuotes;
  return problemsArray[problem];
};

exports.describePickUpObject = function (voxaEvent) {
  let intros2 = null
  const intros = ["Cogeré", "Guardaré", "Meteré en la mochila", "Guardaré en la mochila", "Meteré en mi mochila"]
  const object = oc.objects[voxaEvent.model.control.elementOrObjectToDescribe]

  if (object.isMale) {
    intros2 = ["el", "este"];
  } else {
    intros2 = ["la", "esta"];
  }

  return intros[Math.floor(Math.random() * intros.length)] + " " + intros2[Math.floor(Math.random() * intros2.length)] + " " + object.names[0]
};
exports.describeDropObject = function (voxaEvent) {
  let intros2 = null
  let intros4 = null
  let pronoun = null
  const intros = ["Dejaré", "Tiraré", "Soltaré"]
  const intros3 = ["aquí.", "en este sitio.", "en este lugar."]
  const object = oc.objects[voxaEvent.model.control.elementOrObjectToDescribe]

  if (object.isMale) {
    intros2 = ["el", "este"];
    intros4 = ["", "", "Volveré más tarde a por él", "Ya volveré más tarde a por él", "Lo recogeré en otro momento", "Lo recogeré cuando lo necesite", "Ya lo recogeré más tarde"];
  } else {
    intros2 = ["la", "esta"];
    intros4 = ["", "", "Volveré más tarde a por ella", "Ya volveré más tarde a por ella", "La recogeré en otro momento", "La recogeré cuando la necesite", "Ya la recogeré más tarde"];
  }

  const res = intros[Math.floor(Math.random() * intros.length)] + " " + intros2[Math.floor(Math.random() * intros2.length)] + " " + object.names[0] + " " + intros3[Math.floor(Math.random() * intros3.length)] + " " + intros4[Math.floor(Math.random() * intros4.length)] + ".";

  return res;
};
exports.describeUseObject = function (voxaEvent) {
  return ec.elements[voxaEvent.model.control.elementOrObjectToDescribe].useObjectQuote;
};
exports.describeUseObjectFail = function (voxaEvent) {
  const intros = ["No puedo usar ese objeto así.", "No puedo usar ese objeto de esa manera.", "No creo que pueda usar así este objeto."]
  // ec.elements[voxaEvent.model.control.elementOrObjectToDescribe].names[0]
  return intros[Math.floor(Math.random() * intros.length)];
};
exports.describeCombineObject = function (voxaEvent) {
  const intros = ["Combinando estos objetos he podido crear", "Uniendo estos objetos", "Juntando estos objetos", "Con estos objetos"];
  const intros2 = ["he podido crear", "he creado", "he hecho", "he construido"];
  const mention = oc.objects[voxaEvent.model.control.elementOrObjectToDescribe].mentionQuote;

  return intros[Math.floor(Math.random() * intros.length)] + " " + intros2[Math.floor(Math.random() * intros2.length)] + " " + mention;
};
exports.describeCombineObjectFail = function (voxaEvent) {
  const intros = ["No creo que pueda hacer nada con estos dos objetos.", "No se me ocurre como juntar esos objetos.", "No creo que pueda construir algo con estos objetos."];
  return intros[Math.floor(Math.random() * intros.length)]
};
exports.describeTalkTo = function (voxaEvent) {
  const state = voxaEvent.model.control.npcStateToDescribe;
  const voice = nc.npcs[voxaEvent.model.control.elementOrObjectToDescribe].voice;
  const speech = nc.npcs[voxaEvent.model.control.elementOrObjectToDescribe].states[state].speech;

  return "<voice name='" + voice + "'>" + speech + "</voice>";
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
  let instrosElementsObjects = "";
  let instrosInter = " "

  if (elements || objects) {
    instrosElementsObjects = intros[Math.floor(Math.random() * intros.length)] + " " + intros2[Math.floor(Math.random() * intros2.length)]
  }

  if (elements && objects) {
    instrosInter = ". También " + intros2[Math.floor(Math.random() * intros2.length)] + " ";
  }

  return instrosElementsObjects + " " + elements + "." + instrosInter + objects + ". " + describeNpcs(voxaEvent) + ". " + describeExistingPaths(voxaEvent)+".";
};

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
  let res = "";

  // For each object in the objects object reflected in the session we get the mention quote
  const length = Object.keys(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects).length;
  for (let i = 0; i < length; i++) {
    res += oc.objects[Object.entries(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects)[i][0]].mentionQuote;

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

describeNpcs = function (voxaEvent) {
  const npcs = voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].npcs;
  const keys = Object.keys(npcs);
  let alreadyTalkedNpcs = []
  let notTalkedNpcs = []

  // for each npc, put it into an array depending if the player has already talked to him
  for (let i = 0; i < keys.length; i++) {
    if (npcs[keys[i]]){
      alreadyTalkedNpcs.push(keys[i]);
    } else {
      notTalkedNpcs.push(keys[i]);
    }
  }

  let alreadyTalkedNpcRes = "";
  let notTalkedNpcRes = "";

  // For each npc in alreadyTalkedNpcs array, concat their names in a string
  for(let i = 0; i < alreadyTalkedNpcs.length; i++){
    alreadyTalkedNpcRes += alreadyTalkedNpcs[i];
    // add conjuncion before last element
    if (i === alreadyTalkedNpcs.length - 2) {
      alreadyTalkedNpcRes += " y ";
    }
    // add coma
    if (i < alreadyTalkedNpcs.length - 2) {
      alreadyTalkedNpcRes += ", ";
    };
  }

  // For each npc in notTalkedNpcs array, concat their names in a string with a different setup
  for(let i = 0; i < notTalkedNpcs.length; i++){
    // add conjuncion before last element
    if (i === notTalkedNpcs.length - 2) {
      notTalkedNpcRes += " y ";
    }
    notTalkedNpcRes += " a "
    notTalkedNpcRes += notTalkedNpcs[i];
    notTalkedNpcRes += voxaEvent.model.getNpcProperties(notTalkedNpcs[i]).states[voxaEvent.model.game.npcs[notTalkedNpcs[i]]].mentionQuote;
    // add coma
    if (i < notTalkedNpcs.length - 2) {
      notTalkedNpcRes += ", ";
    };
  }

  // Set the intros depending on the quantity of npcs in each array
  let intros = [""];
  let intro2 = "";
  if (alreadyTalkedNpcs.length == 1){
    intros = [" está aquí.", " anda por aquí."];
    intro2 = "También ";
  } else if (alreadyTalkedNpcs.length > 1) {
    intros = [" están aquí.", " andan por aquí."];
    intro2 = "También ";
  }

  let intro3 = "";
  if (notTalkedNpcs.length > 0){
    intro3 = "he visto por aquí";
  }

  return alreadyTalkedNpcRes + intros[Math.floor(Math.random() * intros.length)] + intro2 + intro3 + notTalkedNpcRes;
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

  if (keys.length === 0) {
    return "";
  } else if (keys.length === 1) {
    intermediateIntro = "un solo camino,"
  } else {
    intermediateIntro = "varios caminos."
  }

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    locQuote = m.locations[to[key].goesTo].locationQuote;
    cardinal = symbolToCardinal[key];
    intros2 = ["el camino del " + cardinal + " lleva hacia", "ir hacia el " + cardinal + " me llevará a", "dirección " + cardinal + " llegaré a", "caminando hacia el " + cardinal + " iré a"];
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


