const Element = require("./element");

module.exports = class ElementCollection {
    constructor() {
        this.elements = {
            bag_1: new Element({
                names: ["bolsa", "bolsa de tela"],
                mentionQuote: "una bolsa de tela que parece tener algo dentro. Debería inspeccionarla",
                mentionAlreadyInspectedQuote: "Una bolsa de tela que ya he revisado",
                inspectQuote: "Parece que dentro de la bolsa hay algo de chatarra y agua. La cogeré, me vendrá bien.",
                alreadyInspectedQuote: "Ya he revisado esta bolsa, no hay nada más de interés.",
                useObjectQuote: "",
                inspectActionTaken: function (game, alreadyInspected) {
                    if (!alreadyInspected){
                        game.resources.junk += 10;
                        game.resources.water += 2;
                    }
                    return "";
                },
                useObjectActionTaken: function (game, object) { return false; },
            }),
            door_metalFence_1_closed: new Element({
                names: ["verja", "verja metálica", "verja de metal"],
                mentionQuote: "una verja metálica cerrada",
                mentionAlreadyInspectedQuote: "una verja metálica cerrada",
                inspectQuote: "Es una verja metálica. está cerrada y me impide el paso hacia el camino del oeste que lleva a la central hidroeléctrica. Quizás pueda encontrar algo para abrirla.",
                alreadyInspectedQuote: "Es una verja metálica. está cerrada y me impide el paso hacia el camino del oeste que lleva a la central hidroeléctrica. Quizás pueda encontrar algo para abrirla.",
                useObjectQuote: "Abriré una agujero en la verja con esto. Perfecto, ya puedo pasar.",
                inspectActionTaken: function (game, alreadyInspected) {return "";},
                useObjectActionTaken: function (game, object) {
                    // if the object is the one intended
                    if (object === "metalShears") {
                        // open the path we want, delete the closed element and add the open element (cause it is a door)
                        game.map.locations[game.map.currentLocation].to.O.canGo = true;
                        game.map.locations[game.map.currentLocation].elements["door_metalFence_1_open"] = false;
                        delete game.map.locations[game.map.currentLocation].elements["door_metalFence_1_closed"];
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
                inspectActionTaken: function (game, alreadyInspected) {return "";},
                useObjectActionTaken: function (game, object) {
                    return false;
                },
            }),
        }
    }
}