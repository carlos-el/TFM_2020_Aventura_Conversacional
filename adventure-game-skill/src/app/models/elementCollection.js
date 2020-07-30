const Element = require("./element");

module.exports = class ElementCollection {
    constructor() {
        this.elements = {
            bag_1: new Element({
                names: ["bolsa", "bolsa de tela"],
                mentionQuote: "una bolsa de tela que parece tener algo dentro",
                inspectQuote: "Parece que dentro de la bolsa hay algo de chatarra. La cogeré, me vendrá bien.",
                alreadyInspectedQuote: "Ya he revisado esta bolsa, no hay nada más de interés.",
                inspectActionTaken: function (model) {
                    model.game.resources.junk += 10;
                },
            }),
        }
    }
}