const Object = require("./object");

module.exports = class objectCollection {
    constructor() {
        this.objects = {
            metalShears: new Object({
                names: ["cizalla"],
                isMale: false,
                mentionQuote: "una cizalla",
                inspectQuote: "Una cizalla. Puede servirme para cortar cables u objectos metálicos.",
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
                mentionQuote: "Una batería pequeña",
                inspectQuote: "Una batería pequeña. Tal vez pueda ponersela a algún aparato",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
        }
    }
}