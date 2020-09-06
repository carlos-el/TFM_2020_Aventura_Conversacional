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
            hook: new Object({
                names: ["gancho"],
                isMale: true,
                mentionQuote: "un gancho",
                inspectQuote: "Un gancho de acero. Puede servir para colgar algo de él o para agarrarse a algún sitio. Si le ato una cuerda quizás pueda usarlo para escalar.",
                combineActionTaken: function (game, object) {
                    if (object === "rope") {
                        // add new object
                        game.inventory.objects["ropeWithHook"] = 1;
                        // delete objects
                        delete game.inventory.objects["rope"];
                        delete game.inventory.objects["hook"];
                        // return object created
                        return "ropeWithHook";
                    }

                    return null;
                },
            }),
            rope: new Object({
                names: ["cuerda", "soga"],
                isMale: false,
                mentionQuote: "una cuerda",
                inspectQuote: "Una cuerda bastante larga. Ya veré que uso se me ocurre darle.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            ropeWithHook: new Object({
                names: ["gancho arrojadizo", "cuerda", "cuerda con gancho", "gancho"],
                isMale: true,
                mentionQuote: "un gancho arrojadizo",
                inspectQuote: "Un gancho atado a una cuerda. Muy útil para atrapar algo o engancharlo a algún sitio al que quiera llegar.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            lever: new Object({
                names: ["palanca"],
                isMale: false,
                mentionQuote: "una palanca",
                inspectQuote: "Una palanca rígida de acero. Me vendrá bien para abrir cajas o puertas poco resistentes. O incluso para atizarle a alguien si se da el caso.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            gasMask: new Object({
                names: ["máscara", "mascara", "máscara de gas", "mascara de gas"],
                isMale: false,
                mentionQuote: "una máscara de gas",
                inspectQuote: "Una máscara de gas que cubre toda la cara. Esto me protegerá de las esporas de esos malditos hongos si me hace falta.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            reliquary: new Object({
                names: ["relicario", "colgante", "colgante con relicario", "relicario con cadena"],
                isMale: true,
                mentionQuote: "un relicario de plata",
                inspectQuote: "Un relicario de plata con una cadena para atarselo al cuello. Tiene una foto de una persona. De hecho se parece bastante a Takumi.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            knife: new Object({
                names: ["cuchillo", "cuchilla"],
                isMale: true,
                mentionQuote: "un cuchillo oxidado",
                inspectQuote: "Un cuchillo de caza oxidado. Parece que aún tiene el filo suficiente para un par de cortes más.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            flameThrower: new Object({
                names: ["lanzallamas", "lanza llamas"],
                isMale: true,
                mentionQuote: "un lanzallamas",
                inspectQuote: "Un lanzallamas de factura casera. No parece ser lo más seguro que he usado pero servirá para quemar cualquier cosa, eso seguro.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            brokenBlowTorch: new Object({
                names: ["soplete", "soplete roto"],
                isMale: true,
                mentionQuote: "un soplete de cocina",
                inspectQuote: "Un soplete de cocina roto y sin gas. No parece que esto vaya a servir de mucho en este estado.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            lighter: new Object({
                names: ["mechero"],
                isMale: true,
                mentionQuote: "un mechero",
                inspectQuote: "Un mechero común. No tiene gas, pero al menos hace chispa.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            steelPipe: new Object({
                names: ["tubería", "tubería de acero", "tuberia", "tuberia de acero"],
                isMale: false,
                mentionQuote: "una tubería de acero",
                inspectQuote: "Una tubería de acero no muy larga. A simple vista no se me ocurre para que usarla.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            gasCan1: new Object({ // given by takumi in industrialParkEntrance and in gas station.
                names: ["lata", "lata de gasolina", "gasolina"],
                isMale: false,
                mentionQuote: "una lata de gasolina",
                inspectQuote: "Una pequeña lata de gasolina. No contiene mucho combustible, pero es mejor que nada.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            // gasCan2: new Object({ // the one in the gas station building
            //     names: ["garrafa", "garrafa de gasolina", "gasolina"],
            //     isMale: false,
            //     mentionQuote: "una garrafa de gasolina",
            //     inspectQuote: "Una garrafa de gasolina de color rojo. No esta llena del todo pero aún le queda bastante combustible.",
            //     combineActionTaken: function (game, object) {
            //         return null;
            //     },
            // }),

            // gasCan3: new Object({ // obtained in industrialParkEntrance if reliquary was not obtained (takumi mission not completed)
            //     names: ["lata", "lata de gasolina", "gasolina"],
            //     isMale: false,
            //     mentionQuote: "una lata de gasolina",
            //     inspectQuote: "Una pequeña lata de gasolina. No contiene mucho combustible, pero es mejor que nada.",
            //     combineActionTaken: function (game, object) {
            //         return null;
            //     },
            // }),
            gunEmpty: new Object({
                names: ["pistola", "arma"],
                isMale: false,
                mentionQuote: "una pistola sin balas",
                inspectQuote: "Una pistola de 9 milímetros sin balas. Si quiero dispararla antes debo encontrar munición.",
                combineActionTaken: function (game, object) {
                    if (object === "bullets") {
                        game.inventory.objects["gunFull"] = 1;
                        delete game.inventory.objects["gunEmpty"];
                        delete game.inventory.objects["bullets"];

                        return "gunFull";
                    }

                    return null;
                },
            }),
            bullets: new Object({ // obtained in industrialParkEntrance if reliquary was not obtained (takumi mission not completed)
                names: ["balas", "bala", "cargador", "cargador de pistola"],
                isMale: true,
                mentionQuote: "un cargador de pistola",
                inspectQuote: "Un cargador de pistola lleno de balas. Si encuentro el arma adecuada podré usarlo.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            gunFull: new Object({
                names: ["pistola", "arma"],
                isMale: false,
                mentionQuote: "una pistola cargada",
                inspectQuote: "Una pistola cargada. Debo tener cuidado con lo que hago con ella, esto no es un juguete.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            dynomite: new Object({
                names: ["dinamita", "cartucho de dinamita", "cartucho"],
                isMale: true,
                mentionQuote: "un cartucho de dinamita",
                inspectQuote: "Un cartucho de dinamita. Supongo que puede ser útil para volar algo por los aires.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),

            trapVerySmall_1_01h: new Object({
                names: ["botella de pesca","botella"],
                isMale: false,
                mentionQuote: "una botella de pesca",
                inspectQuote: "Una botella que sirve para pescar. Es una botella de plástico a la que se le ha cortado el cuello y se le ha vuelto a pegar del revés. Los peces, una vez que entran, parecen no poder salir.",
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
            trapMedium_1_12h: new Object({
                names: ["red", "red para pájaros", "red para pajaros", "red de pájaros", "red de pajaros"],
                isMale: false,
                mentionQuote: "una red para pájaros",
                inspectQuote: "Una red fina para atrapar pequeñas aves. Si encuentro el sitio adecuado para colocarla puede que capture algún pájaro comestible.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
            trapBig_1_24h: new Object({
                names: ["cepo","cepo enorme", "cepo grande"],
                isMale: true,
                mentionQuote: "un cepo grande",
                inspectQuote: "Un cepo enorme. Parece la boca un tiburón. Con esto puedo atrapar casi cualquier animal, siempre que encuentre un sitio lo suficientemente amplio para ponerlo.",
                combineActionTaken: function (game, object) {
                    return null;
                },
            }),
        }
    }
}