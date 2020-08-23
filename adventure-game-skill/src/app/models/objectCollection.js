const Object = require("./object");

module.exports = class objectCollection {
    constructor() {
        this.objects = {
            metalShears: new Object({
                names: ["cizalla"],
                isMale: false,
                mentionQuote: "una cizalla",
                inspectQuote: "Una cizalla. Puedo usarla en algún elemento de metal para cortalo o abrirlo.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            lanternEmpty: new Object({
                names: ["linterna sin batería", "linterna"],
                isMale: false,
                mentionQuote: "una linterna sin batería",
                inspectQuote: "Una linterna sin bateria. Debería de encontrarle alguna antes de poder usarla.",
                combineActionTaken: function (game, object) {
                    if (object === "battery_small") {
                        game.inventory.objects["lanternFull"] = 1;
                        delete game.inventory.objects["lanternEmpty"];
                        delete game.inventory.objects["battery_small"];

                        return "lanternFull";
                    }

                    return null;
                },
            }),
            lanternFull: new Object({
                names: ["linterna"],
                isMale: false,
                mentionQuote: "una linterna",
                inspectQuote: "Una linterna. Útil para iluminar algún sitio oscuro.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            battery_small: new Object({
                names: ["batería","batería pequeña", "bateria", "bateria pequeña"],
                isMale: false,
                mentionQuote: "una batería pequeña",
                inspectQuote: "Una batería pequeña. Tal vez pueda ponérsela a algún aparato.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            trapSmall_1_06h: new Object({
                names: ["cepo","cepo pequeño"],
                isMale: true,
                mentionQuote: "un cepo pequeño",
                inspectQuote: "Un cepo pequeño. Es de hierro y está bastante oxidado. Es posible que atrape algún animal con él si encuentro el sitio adecuado para usarlo.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
        }
    }
}