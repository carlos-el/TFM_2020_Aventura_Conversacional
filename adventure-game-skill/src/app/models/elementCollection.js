const Element = require("./element");

module.exports = class ElementCollection {
    constructor() {
        this.elements = {
            bag_1: new Element({
                names: ["bolsa", "bolsa de tela"],
                mentionQuote: "una bolsa de tela que parece tener algo dentro. Debería inspeccionarla",
                mentionAlreadyInspectedQuote: "Una bolsa de tela que ya he revisado",
                inspectQuote: "Parece que dentro de la bolsa hay bastante agua y alimento. La cogeré, me vendrá bien.",
                alreadyInspectedQuote: "Ya he revisado esta bolsa, no hay nada más de interés.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.food += 20;
                        voxaEvent.model.game.resources.water += 22;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            door_metalFence_1_closed: new Element({
                names: ["verja", "verja metálica", "verja de metal"],
                mentionQuote: "una verja metálica cerrada",
                mentionAlreadyInspectedQuote: "una verja metálica cerrada",
                inspectQuote: "Es una verja metálica. está cerrada y me impide el paso hacia el camino del oeste que lleva a la central hidroeléctrica. Quizás pueda encontrar algo para abrirla.",
                alreadyInspectedQuote: "Es una verja metálica. está cerrada y me impide el paso hacia el camino del oeste que lleva a la central hidroeléctrica. Quizás pueda encontrar algo para abrirla.",
                useObjectQuote: "Abriré un agujero en la verja con esto. Perfecto, ya puedo pasar.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    // if the object is the one intended
                    if (object === "metalShears") {
                        // open the path we want, delete the closed element and add the open element (cause it is a door)
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].to.O.canGo = true;
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["door_metalFence_1_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["door_metalFence_1_closed"];
                        // return true cause the object can be used
                        return true;
                    }

                    return false;
                },
            }),
            door_metalFence_1_open: new Element({
                names: ["verja", "verja metálica", "verja de metal"],
                mentionQuote: "una verja metálica que ya abrí",
                mentionAlreadyInspectedQuote: "una verja metálica que ya abrí",
                inspectQuote: "Es una verja metálica que impedía el paso hacia el camino del oeste que lleva a la central hidroeléctrica. Ya está abierta.",
                alreadyInspectedQuote: "Es una verja metálica que impedía el paso hacia el camino del oeste que lleva a la central hidroeléctrica. Ya está abierta.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            animalPath_1: new Element({   // it is a pair with animalPath_1_withTrap
                names: ["sendero", "sendero de animales", "camino", "camino de animales"],
                mentionQuote: "un sendero por donde parece que suelen pasar animales",
                mentionAlreadyInspectedQuote: "un sendero por donde parece que suelen pasar animales",
                inspectQuote: "Es un sendero hecho por animales al pasar de manera habitual. Puede que logre atrapar alguno con una trampa.",
                alreadyInspectedQuote: "Es un sendero hecho por animales al pasar de manera habitual. Puede que logre atrapar alguno con una trampa.",
                useObjectQuote: "Pondré esta trampa en el sendero. Puede que capture algún animal del que sacar una buena cantidad de comida.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {

                    // if the object is the one intended
                    if (object === "trapSmall_1_06h") {
                        // delete the animalPath_X and add the corresponding element animalPath_X_withTrap 
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPath_1"];
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPath_1_withTrap"] = false;
                        // delete the trap used in the player inventory
                        delete voxaEvent.model.game.inventory.objects[object]
        
                        // save when the trap: the animalPath_X_withTrap element, the element to replace on the animalPath_X_withTrap,
                        // the trap used and the time when it was used
                        voxaEvent.userDator.saveUserTrapSet(voxaEvent.user.id, "animalPath_1_withTrap", object, "animalPath_1", Date.now())

                        // return true cause the object can be used
                        return true;
                    }

                    return false;
                },
            }),
            animalPath_1_withTrap: new Element({
                names: ["trampa", "sendero con trampa", "sendero"],
                mentionQuote: "una trampa que puse en el sendero de animales",
                mentionAlreadyInspectedQuote: "una trampa que puse en un sendero de animales",
                inspectQuote: "Puse está trampa en un sendero donde pasan animales para ver si atrapaba algo.",
                alreadyInspectedQuote: "Puse está trampa en un sendero donde pasan animales para ver si atrapaba algo.",
                useObjectQuote: "",
                inspectActionTaken: async function (voxaEvent, alreadyInspected) {
                    // dont set alreadyInspected to true as it does not matter (this function has to be executed everytime the element is inspected)
                    // check database for this animalPath_X_withTrap 
                    const trap = await voxaEvent.userDator.getUserTrapSet(voxaEvent.user.id, "animalPath_1_withTrap")
                    // if there is a trap set like this
                    if (trap) {
                        // get the trap used and the element replaced and the timeSet
                        const timeSet = trap.timeSet;
                        const trapObjectUsed = trap.trapObjectUsed;
                        const elementToReplace = trap.elementToReplace;

                        // if has passed enough time based on the trap then add the resources 
                        // (the trap specifies the time to pass in the 2 penultimates letters of his name)
                        const hoursSinceTrapWasSet = (Date.now() - timeSet) / 3600000; // miliseconds to hours
                        const trapHours = parseInt(trapObjectUsed.substr(trapObjectUsed.length - 3, 2));
                        if (hoursSinceTrapWasSet >= trapHours) { // 'trapHours' is real value, set 0.008 (30 secs) for testing 
                            // give the user the trap back
                            voxaEvent.model.game.inventory.objects[trapObjectUsed] = 1;
                            // replace the element
                            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPath_1_withTrap"];
                            voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements[elementToReplace] = false;
                            // delete the trap set in the database
                            voxaEvent.userDator.removeUserTrapSet(voxaEvent.user.id, "animalPath_1_withTrap")

                            // add resources return the cathFoundOnTrapScene depending on the size (time of the trap) of the cath.
                            if (trapHours >= 24) {
                                voxaEvent.model.game.resources.food += 70;
                                return "cathBigFoundOnTrapScene";
                            } else if (trapHours >= 12) {
                                voxaEvent.model.game.resources.food += 30;
                                return "cathMediumFoundOnTrapScene";
                            } else if (trapHours >= 6) {
                                voxaEvent.model.game.resources.food += 10;
                                return "cathSmallFoundOnTrapScene";
                            } else {
                                voxaEvent.model.game.resources.food += 5;
                                return "cathVerySmallFoundOnTrapScene";
                            }
                        }

                        // in other case dont do anything, just return to the nothingFoundOnTrapScene.
                        return "nothingFoundOnTrapScene";
                    }

                    return "";
                },
                useObjectActionTaken: function (movoxaEventdel, object) {
                    return false;
                },
            }),
        }
    }
}