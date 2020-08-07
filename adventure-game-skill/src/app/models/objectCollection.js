const Object = require("./object");

module.exports = class objectCollection {
    constructor() {
        this.objects = {
            metalShears: new Object({
                names: ["cizalla"],
                isMale: false,
                mentionQuote: "una cizalla",
                inspectQuote: "Una cizalla. Puede servirme para cortar cables u objectos metálicos",
            }),
        }
    }
}