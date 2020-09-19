const Element = require("./element");

module.exports = class ElementCollection {
    constructor() {
        this.elements = {
            bushes1: new Element({
                names: ["arbusto", "arbusto con bayas", "arbusto con algunas bayas"],
                mentionQuote: "un arbusto con algunas bayas, debería inspeccionarlo",
                mentionAlreadyInspectedQuote: "un simple arbusto",
                inspectQuote: "Este arbusto tiene algunas cuantas bayas. Serán una buena ración de alimento, las recogeré.",
                alreadyInspectedQuote: "Ya he recogido los frutos que tenía este arbusto.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.food += 15;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            eolicWindmill: new Element({
                names: ["molino", "molino de viento", "pequeño molino de viento"],
                mentionQuote: "un pequeño molino de viento con mucho óxido",
                mentionAlreadyInspectedQuote: "un pequeño molino de viento",
                inspectQuote: "Es un pequeño molino de viento. Parece que Sandra lo estaba reparando o quitándole el óxido. A su lado hay una caja con algunas piezas de chatarra. Me las llevaré por ahora.",
                alreadyInspectedQuote: "Es un pequeño molino de viento. Parece que Sandra lo estaba reparando.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 5;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            waterFilter: new Element({
                names: ["máquina", "maquina", "maquina de filtrado", "máquina de filtrado", "maquina de filtrado de agua", "máquina de filtrado de agua"],
                mentionQuote: "una máquina de filtrado de agua",
                mentionAlreadyInspectedQuote: "una máquina de filtrado",
                inspectQuote: "Una máquina de filtrado de agua. Otro de los inventos de Sandra. Nos ha venido muy bien últimamente para no tener que salir tando del campamento. Parece que todavía le queda algo de agua limpia. Me la llevaré.",
                alreadyInspectedQuote: "Una máquina de filtrado de agua. Otro de los inventos de Sandra. Nos ha venido muy bien últimamente para no tener que salir tando del campamento.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 5;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            gasPump: new Element({
                names: ["surtidor", "surtidor de combustible"],
                mentionQuote: "un surtidor de combustible",
                mentionAlreadyInspectedQuote: "un surtidor de combustible",
                inspectQuote: "Un surtidor de combustible. No parece que quede nada en su interior. Aunque sí podría llevarme algunas de sus piezas para usarlas como chatarra.",
                alreadyInspectedQuote: "Un surtidor de combustible. No parece que quede nada en su interior.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 10;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            brokenTruck: new Element({
                names: ["camión", "camion", "camion averiado", "camión averiado"],
                mentionQuote: "un camión averiado",
                mentionAlreadyInspectedQuote: "un camión averiado",
                inspectQuote: "Es solo un camión averiado aunque debería mirar si tiene algo en el remolque. <audio src='soundbank://soundlibrary/doors/doors_metal/metal_02'/> Vaya, parece que le quedan una cuantas botetllas de agua. Las cogeré.",
                alreadyInspectedQuote: "Es solo un camión averiado. Ya revisé su interior.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 10;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            bustedMotorbike: new Element({
                names: ["moto", "moto destrozada"],
                mentionQuote: "una moto destrozada",
                mentionAlreadyInspectedQuote: "una moto destrozada",
                inspectQuote: "Una moto destrozada. No tiene ruedas y el motor está roto, pero puedo sacar algo de chatarra de sus piezas.",
                alreadyInspectedQuote: "Una moto destrozada. Es completamente inservible.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 5;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            wallCity: new Element({
                names: ["muro", "muro de cemento"],
                mentionQuote: "un muro de cemento",
                mentionAlreadyInspectedQuote: "un muro de cemento",
                inspectQuote: "Es un muro de cemento muy alto. También parece bastante grueso. No creo que sea posible cruzarlo. Está en el camino que llevaba a la ciudad, así que supongo que lo levantaron cuando empezó la infección para que nadie entrara, o saliera.",
                alreadyInspectedQuote: "Es un muro de cemento muy alto. También parece bastante grueso. No creo que sea posible cruzarlo. Está en el camino que llevaba a la ciudad, así que supongo que lo levantaron cuando empezó la infección para que nadie entrara, o saliera.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            table: new Element({
                names: ["mesa", "mesa del comedor"],
                mentionQuote: "la mesa del comedor",
                mentionAlreadyInspectedQuote: "la mesa del comedor",
                inspectQuote: "La mesa del comedor de la casa. Sobre ella hay algunas de comida y agua. Me las llevaré, me será útiles. Parece que también hay un cuchillo que debería coger.",
                alreadyInspectedQuote: "La mesa del comedor de la casa. No hay mucho más que decir.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.food += 15;
                        voxaEvent.model.game.resources.water += 10;
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["knife"] = false
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            sofa_closed: new Element({
                names: ["sofá", "sofa"],
                mentionQuote: "un sofá",
                mentionAlreadyInspectedQuote: "un sofá",
                inspectQuote: "Un sofá no muy cómodo. <say-as interpret-as='interjection'>mmh</say-as>. Parece que hay algo debajo de la piel del asiento.",
                alreadyInspectedQuote: "Un sofá no muy cómodo. Es posible que haya algo debajo de la piel del asiento.",
                useObjectQuote: "Rajaré la piel del sofá con el cuchillo. <audio src='soundbank://soundlibrary/cloth_leather_paper/leather/leather_05'/>. Listo. Debería inspeccionar a ver que hay dentro.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "knife") {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sofa_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sofa_closed"];
                        return true;
                    }

                    return false;
                },
            }),
            sofa_open: new Element({
                names: ["sofá", "sofá rajado", "sofa", "sofa rajado"],
                mentionQuote: "un sofá rajado",
                mentionAlreadyInspectedQuote: "un sofá rajado",
                inspectQuote: "Un sofá rajado. Parece dentro del tapizado hay un objeto pequeño. Vaya parece un relicario. Se ha caído al suelo. Debería cogerlo.",
                alreadyInspectedQuote: "Un sofá rajado. En su interior había un relicario.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["reliquary"] = false
                        voxaEvent.model.game.choices.reliquaryObtained = true;
                        game.npcs["takumi"] = 3;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            hangingCupboard: new Element({
                names: ["armario", "armario grande", "armario bastante grande"],
                mentionQuote: "un armario bastante grande e inclinado al lado de un sofá",
                mentionAlreadyInspectedQuote: "un armario bastante grande e inclinado al lado de un sofá",
                inspectQuote: "Este armario está algo inclinado. Lo único que evita que se caiga es una cuerda atada al suelo. Si la corto seguro que el armario caerá encima del sofá.",
                alreadyInspectedQuote: "Este armario está algo inclinado. Lo único que evita que se caiga es una cuerda atada al suelo. Si la corto seguro que el armario caerá encima del sofá.",
                useObjectQuote: "<audio src='soundbank://soundlibrary/wood/breaks/breaks_02'/>. El armario ha caído justo encima del sofá. Con lo que pesa ya puedo olvidarme de moverlo para acceder al sofá.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "knife") {
                        if (!("reliquaryObtained" in voxaEvent.model.game.choices)) {
                            voxaEvent.model.game.choices.reliquaryObtained = false;
                            game.npcs["takumi"] = 4;
                        }

                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["fallenCupboard"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sofa_open"];
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sofa_closed"];
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["hangingCupboard"];
                        return true;
                    }

                    return false;
                },
            }),
            fallenCupboard: new Element({
                names: ["armario", "armario grande"],
                mentionQuote: "un armario bastante grande tirado sobre un sofá",
                mentionAlreadyInspectedQuote: "un armario bastante grande tirado sobre un sofá",
                inspectQuote: "El armario que tiré sobre el sofá cuando corté la cuerda que lo sostenía. No creo que pueda moverlo para acceder al sofá.",
                alreadyInspectedQuote: "El armario que tiré sobre el sofá cuando corté la cuerda que lo sostenía. No creo que pueda moverlo para acceder al sofá.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            docker: new Element({
                names: ["contenedor", "contenedor de mercancías", "contenedor de mercancias"],
                mentionQuote: "un contenedor de mercancías",
                mentionAlreadyInspectedQuote: "un contenedor de mercancías vacío",
                inspectQuote: "Un contendor de mercancías. Supongo que lo usarian para llevar suministros al polígono industrtial que hay hacia el este. Parece que dentro tiene algo de chatarra. Me la llevaré.",
                alreadyInspectedQuote: "Un contendor de mercancías. Supongo que lo usarian para llevar suministros al polígono industrtial que hay hacia el este. Está vacío.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 15;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            door_metalFence_1_closed: new Element({
                names: ["valla", "valla metálica", "valla de metal"],
                mentionQuote: "una valla metálica cerrada",
                mentionAlreadyInspectedQuote: "una valla metálica cerrada",
                inspectQuote: "Es una valla metálica. Está cerrada y me impide el paso hacia el camino del este que lleva al polígono industrial. Tiene un candado bastante fuerte. Quizás haciendo palanca pueda abrirla.",
                alreadyInspectedQuote: "Es una valla metálica. Está cerrada y me impide el paso hacia el camino del este que lleva al polígono industrial. Tiene un candado bastante fuerte. Quizás haciendo palanca pueda abrirla.",
                useObjectQuote: "Abriré la puerta de la valla con la palanca. Perfecto, ya puedo pasar.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    // if the object is the one intended
                    if (object === "lever") {
                        // open the path we want, delete the closed element and add the open element (cause it is a door)
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["door_metalFence_1_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["door_metalFence_1_closed"];
                        // return true cause the object can be used
                        return true;
                    }

                    return false;
                },
            }),
            door_metalFence_1_open: new Element({
                names: ["valla", "valla metálica", "valla de metal"],
                mentionQuote: "una valla metálica que ya abrí",
                mentionAlreadyInspectedQuote: "una valla metálica que ya abrí",
                inspectQuote: "Es una valla metálica que impedía el paso hacia el camino del este que lleva al polígono industrial. Ya está abierta.",
                alreadyInspectedQuote: "Es una valla metálica que impedía el paso hacia el camino del este que lleva al polígono industrial. Ya está abierta.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            brokenPc: new Element({
                names: ["ordenador", "ordenador roto", "ordenador de escritorio", "ordenador de escritorio roto"],
                mentionQuote: "un ordenador de escritorio roto",
                mentionAlreadyInspectedQuote: "un ordenador de escritorio roto",
                inspectQuote: "Un ordenador de escritorio. Esta roto y no tiene utilidad pero algunas de sus piezas son una chatarra bastante valiosa. Lo desmantelaré.",
                alreadyInspectedQuote: "Un ordenador de escritorio roto. Ya me llevé todo lo que me podía ser útil de él.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 20;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            deskWood: new Element({
                names: ["escritorio", "escritorio de madera"],
                mentionQuote: "un escritorio de madera",
                mentionAlreadyInspectedQuote: "un escritorio de madera",
                inspectQuote: "Un escritorio de madera bastante bonito. Debía ser del director de la central. Puede que dentro de los cajones haya algo útil. <audio src='soundbank://soundlibrary/wood/moves/moves_08'/>. Sí, algunos frutos secos y agua. Me será útil.",
                alreadyInspectedQuote: "Un escritorio de madera bastante bonito. Debía ser del director de la central. No tiene nada en los cajones.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 10;
                        voxaEvent.model.game.resources.food += 10;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            locker_closed: new Element({
                names: ["taquilla"],
                mentionQuote: "una taquilla",
                mentionAlreadyInspectedQuote: "una taquilla",
                inspectQuote: "Es una taquilla. Seguramente la usaran los empleados de la gasolinera. Esta cerrada con llave. Necesitaré una herramienta para abrirla.",
                alreadyInspectedQuote: "Es una taquilla. Seguramente la usaran los empleados de la gasolinera. Esta cerrada con llave. Necesitaré una herramienta para abrirla.",
                useObjectQuote: "Con la palanca podré forzar la cerradura. Listo. Ya está abierta.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "lever") {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["locker_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["locker_closed"];
                        return true;
                    }

                    return false;
                },
            }),
            locker_open: new Element({
                names: ["taquilla", "taquilla abierta"],
                mentionQuote: "una taquilla abierta",
                mentionAlreadyInspectedQuote: "una taquilla abierta",
                inspectQuote: "Una taquilla abierta. Dentro hay una pequeña botella de agua y, ¿qué es esto? Parece una especie de riñonera. Me la pondré, me servirá para llevar más objetos.",
                alreadyInspectedQuote: "Una taquilla abierta. Ya la revisé. Ahora está vacía.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 10;
                        voxaEvent.model.game.inventory.size += 1;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            carTrunk: new Element({
                names: ["coche", "coche siniestrado"],
                mentionQuote: "un coche siniestrado",
                mentionAlreadyInspectedQuote: "un coche siniestrado",
                inspectQuote: "Es un coche que parece que se estrelló con una farola. Parece que a causa del impacto el maletero esta abierto. Dentro hay algo de chatarra. También puedo ver un soplete. Debería cogerlo.",
                alreadyInspectedQuote: "Es un coche que parece que se estrelló con una farola. Parece que a causa del impacto el maletero esta abierto. No hay nada dentro.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["brokenBlowTorch"] = false
                        voxaEvent.model.game.resources.junk += 5;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            merchantWarehouse: new Element({
                names: ["almacén", "almacén del mercader", "almacen", "almacen del mercader"],
                mentionQuote: "un almacén no muy grande",
                mentionAlreadyInspectedQuote: "un almacén no muy grande",
                inspectQuote: "Un almacén de mercancías. No es muy grande y pasa bastante desapercibido. Debe ser del mercader que hay en la entrada del polígono. Vaya dentro hay mucha comida en una caja. ¡Estoy de suerte! También hay un cargador de balas y un cartucho de dinamita. Debería recoger ambas cosas.",
                alreadyInspectedQuote: "Un almacén de mercancías. No es muy grande y pasa bastante desapercibido. Debe ser del mercader que hay en la entrada del polígono. Ya me llevé lo que había dentro.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["bullets"] = false
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["dynomite"] = false
                        voxaEvent.model.game.resources.food += 30;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            sporeCluster2: new Element({
                names: ["cúmulo de esporas", "cumulo de esporas", "cúmulo", "cumulo"],
                mentionQuote: "un cúmulo de esporas grande",
                mentionAlreadyInspectedQuote: "un cúmulo de esporas",
                inspectQuote: "Un cúmulo de esporas como los que aparecieron despues de la explosión. El mercader del polígono me pidió que los quemara. Debería eliminarlo en cuanto pueda.",
                alreadyInspectedQuote: "Un cúmulo de esporas como los que aparecieron despues de la explosión. El mercader del polígono me pidió que los quemara. Debería eliminarlo en cuanto pueda.",
                useObjectQuote: "Lo eliminaré con el lanzallamas. Listo.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "flameThrower") {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sporeCluster2"];

                        if(!("sporeCluster3" in voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements)){
                            voxaEvent.model.game.choices["industrialSiteClean"] = true;
                            // change hugo state
                            voxaEvent.model.game.npcs["hugo"] = 2;
                            // Set already talked to true in this location 
                            game.map.locations["industrialParkEntrance"].npcs["hugo"] = false;
                            // cahnge merchant state
                            game.merchants["hugo"]["state"] = 2
                        }

                        return true;
                    }

                    return false;
                },
            }),
            sporeCluster3: new Element({
                names: ["cúmulo de esporas", "cumulo de esporas", "cúmulo", "cumulo"],
                mentionQuote: "un cúmulo de esporas pequeño",
                mentionAlreadyInspectedQuote: "un cúmulo de esporas",
                inspectQuote: "Un cúmulo de esporas como los que aparecieron despues de la explosión. El mercader del polígono me pidió que los quemara. Debería eliminarlo en cuanto pueda.",
                alreadyInspectedQuote: "Un cúmulo de esporas como los que aparecieron despues de la explosión. El mercader del polígono me pidió que los quemara. Debería eliminarlo en cuanto pueda.",
                useObjectQuote: "Me desharé de él con el lanzallamas casero. Listo.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "flameThrower") {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sporeCluster3"];

                        if(!("sporeCluster2" in voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements)){
                            voxaEvent.model.game.choices["industrialSiteClean"] = true;
                            // change hugo state
                            voxaEvent.model.game.npcs["hugo"] = 2;
                            // Set already talked to true in this location 
                            game.map.locations["industrialParkEntrance"].npcs["hugo"] = false;
                            // cahnge merchant state
                            game.merchants["hugo"]["state"] = 2
                        }

                        return true;
                    }

                    return false;
                },
            }),
            truckWithToolBox: new Element({
                names: ["camión", "camion"],
                mentionQuote: "un camión",
                mentionAlreadyInspectedQuote: "un camión",
                inspectQuote: "Un camión sin combustible. En la cabina hay una caja de herramientas. Parece que dentro hay una cizalla. Debería cogerla. Puede serme muy útil.",
                alreadyInspectedQuote: "Un camión sin combustible. No hay nada en su interior.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["metalShears"] = false
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            sporeInfestation2_closed: new Element({
                names: ["cúmulo de esporas", "cumulo de esporas", "cúmulo", "cumulo"],
                mentionQuote: "un cúmulo de esporas muy grande",
                mentionAlreadyInspectedQuote: "un cúmulo de esporas muy grande",
                inspectQuote: "Es un cúmulo de esporas enorme. Es de los más grandes que he visto. Tapa completamente la entrada a la calle este del polígono industrial. Tendré que eliminarlo antes de poder pasar como me dijo el mercader de la entrada.",
                alreadyInspectedQuote: "Es un cúmulo de esporas enorme. Es de los más grandes que he visto. Tapa completamente la entrada a la calle este del polígono industrial. Tendré que eliminarlo antes de poder pasar como me dijo el mercader de la entrada.",
                useObjectQuote: "Ahora que tengo un lanzallamas puedo hacerlo cenizas. Me aseguraré de que no queda nada o podría volver a aparecer.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "flameThrower") {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sporeInfestation2_closed"];
                        return true;
                    }

                    return false;
                },
            }),
            floatingCrate: new Element({
                names: ["caja", "caja de madera", "caja de madera colgada"],
                mentionQuote: "una caja de madera colgada de un cable",
                mentionAlreadyInspectedQuote: "una caja de madera colgada de un cable",
                inspectQuote: "Es una caja de madera. Esta colgada de un cable que sale de la parte superior de un muro. Me pregunto como podré bajarla.",
                alreadyInspectedQuote: "Es una caja de madera. Esta colgada de un cable que sale de la parte superior de un muro. Me pregunto como podré bajarla.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            onGroundCrate: new Element({
                names: ["caja", "caja de madera"],
                mentionQuote: "una caja de madera algo golpeada",
                mentionAlreadyInspectedQuote: "una caja de madera algo golpeada",
                inspectQuote: "Es la caja de madera que antes estaba colgando de un cable. Parece que se ha caido al suelo. Por una rendija puedo ver que dentro tiene un par de cosas. La abriré y las cogeré.",
                alreadyInspectedQuote: "Es la caja de madera que antes estaba colgando de un cable. Parece que se ha caido al suelo. Ya saqué lo que había dentro.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["steelPipe"] = false
                        if (!voxaEvent.model.game.choices.reliquaryObtained || !("reliquaryObtained" in voxaEvent.model.game.choices)) {
                            voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["gasCan1"] = false
                        }
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            creaneWithSteelCable: new Element({
                names: ["grúa", "grua"],
                mentionQuote: "una grua",
                mentionAlreadyInspectedQuote: "una grúa",
                inspectQuote: "Una grúa bastante alta. Parece que el cable que va desde la base hasta la punta se ha quedado atascado al otro lado de un muro. Si lo corto puede que lo desenrede.",
                alreadyInspectedQuote: "Una grúa bastante alta. Parece que el cable que va desde la base hasta la punta se ha quedado atascado al otro lado de un muro. Si lo corto puede que lo desenrede.",
                useObjectQuote: "Usaré la cizalla para cortar el cable. <break time='1s'/>  <audio src='soundbank://soundlibrary/wood/breaks/breaks_10'/> <say-as interpret-as='interjection'>mmh</say-as>. Me pregunto que habrá sido ese ruido.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "metalShears") {
                        voxaEvent.model.game.map.locations["industrialParkEntrance"].elements["onGroundCrate"] = false;
                        delete voxaEvent.model.game.map.locations["industrialParkEntrance"].elements["floatingCrate"];

                        voxaEvent.model.game.map.locations["industrialParkEntrance"].elements["creaneWithSteelCableDummy"] = false;
                        delete voxaEvent.model.game.map.locations["industrialParkEntrance"].elements["creaneWithSteelCable"];

                        return true;
                    }

                    return false;
                },
            }),
            creaneWithSteelCableDummy: new Element({
                names: ["grúa", "grua"],
                mentionQuote: "una grua",
                mentionAlreadyInspectedQuote: "una grúa",
                inspectQuote: "Una grúa bastante alta. Tenía un cable de acero por todo el mástil pero ya lo corté.",
                alreadyInspectedQuote: "Una grúa bastante alta. Tenía un cable de acero por todo el mástil pero ya lo corté.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            fuseBoxEmpty: new Element({
                names: ["caja de fusibles", "caja"],
                mentionQuote: "una caja de fusibles",
                mentionAlreadyInspectedQuote: "una caja de fusibles",
                inspectQuote: "Una caja de fusibles sin mucho interés. Tiene unos cuantos tornillos dentro que me servirán como chatarra.",
                alreadyInspectedQuote: "Una caja de fusibles sin mucho interés. Está vacía.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 5;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            fuseBoxHidden: new Element({
                names: ["caja de fusibles", "caja"],
                mentionQuote: "una caja de fusibles",
                mentionAlreadyInspectedQuote: "una caja de fusibles",
                inspectQuote: "Una caja de fusibles takumi me dijo que tenía un compartimento oculto. !Es cierto¡ Hay una palanca en un falso fondo. Tiraré de ella. <audio src='soundbank://soundlibrary/switches_levers/switches_levers_02'/> Parece que se ha abierto la puerta de alguna habitación.",
                alreadyInspectedQuote: "Una caja de fusibles con una palanca oculta. Ya tiré de la palanca. Eso debió de haber abierto alguna puerta.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["door_metalFence_closed"];
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            door_metalFence_closed: new Element({
                names: ["puerta de metal", "puerta"],
                mentionQuote: "una puerta de metal",
                mentionAlreadyInspectedQuote: "una puerta de metal",
                inspectQuote: "Una puerta de metal. Está cerrada a cal y canto. Me impide el paso a la habitación del norte de las instalaciones.",
                alreadyInspectedQuote: "Una puerta de metal. Está cerrada a cal y canto. Me impide el paso a la habitación del norte de las instalaciones.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            bridge2_closed: new Element({
                names: ["puente", "puente de cemento"],
                mentionQuote: "un puente de cemento",
                mentionAlreadyInspectedQuote: "un puente de cemento",
                inspectQuote: "Es el puente de cemento que pasa por encima del dique que tiene la central hidroeléctrica en el río. Parece que la parte central está derruida. Justo al otro lado del puente quedan unas varandillas de hierro. Debería buscar una manera de cruzar.",
                alreadyInspectedQuote: "Es el puente de cemento que pasa por encima del dique que tiene la central hidroeléctrica en el río. Parece que la parte central está derruida. Justo al otro lado del puente quedan unas varandillas de hierro. Debería buscar una manera de cruzar.",
                useObjectQuote: "Puedo lanzar este gancho a la barandilla del otro lado del puente y montar una tirolina para pasar. Hecho.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "ropeWithHook") {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["bridge2_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["bridge2_closed"];
                        delete voxaEvent.model.game.inventory.objects["ropeWithHook"];
                        voxaEvent.model.game.choices.bridge2Open = true;

                        if (!("riverBankPowerPlant" in game.map.locations)) {
                            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["bridge2_closed_look"];
                        }

                        if (!("chadAlive" in voxaEvent.model.game.choices)) {
                            voxaEvent.model.game.choices.chadAlive = false;
                        }
                        return true;
                    }

                    return false;
                },
            }),
            bridge2_open: new Element({
                names: ["puente", "puente de cemento"],
                mentionQuote: "un puente de cemento",
                mentionAlreadyInspectedQuote: "un puente de cemento",
                inspectQuote: "Es el puente de cemento que pasa por encima del dique que tiene la central hidroeléctrica en el río. La parte central está derruida pero ya monté una tirolina para poder pasar.",
                alreadyInspectedQuote: "Es el puente de cemento que pasa por encima del dique que tiene la central hidroeléctrica en el río. La parte central está derruida pero ya monté una tirolina para poder pasar.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            fishermanHut: new Element({
                names: ["cabaña", "cabaña de madera"],
                mentionQuote: "una cabaña de madera",
                mentionAlreadyInspectedQuote: "una cabaña de madera",
                inspectQuote: "Una cabaña de madera. Aquí debía vivir alguien cuando en esta aldea era concurrida para la pesca. Dentro hay algunos anzuelos viejos que puedo usar como chatarra y un poco de agua en una botella.",
                alreadyInspectedQuote: "Una cabaña de madera. Aquí debía vivir alguien cuando en esta aldea era concurrida para la pesca. No queda nada dentro.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 5;
                        voxaEvent.model.game.resources.water += 10;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            boathouse: new Element({
                names: ["caseta", "caseta para barcas"],
                mentionQuote: "una caseta para barcas",
                mentionAlreadyInspectedQuote: "una caseta para barcas",
                inspectQuote: "Una caseta para barcas. En este sitio los pescadores guardaban sus barcas para tenerlas a mano. No parece haber ninguna ahora pero sí que hay una cuerda. Debería cogerla. Seguro que me servirá.",
                alreadyInspectedQuote: "Una caseta para barcas. En este sitio los pescadores guardaban sus barcas para tenerlas a mano. No parece haber ninguna ahora.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["rope"] = false
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            bridge1_closed: new Element({
                names: ["puente", "puente levadizo"],
                mentionQuote: "un puente levadizo",
                mentionAlreadyInspectedQuote: "un puente levadizo",
                inspectQuote: "Es el puente levadizo que cruza el río. Esta hizado. Hay huellas que indican que un grupo lo ha cruzado hace poco. Parece que no quieren que los sigamos. Tendré que encontrar la manera de hacer que baje de nuevo.",
                alreadyInspectedQuote: "Es el puente levadizo que cruza el río. Esta hizado. Hay huellas que indican que un grupo lo ha cruzado hace poco. Parece que no quieren que los sigamos. Tendré que encontrar la manera de hacer que baje de nuevo.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            bridge1_open: new Element({
                names: ["puente", "puente levadizo"],
                mentionQuote: "un puente levadizo",
                mentionAlreadyInspectedQuote: "un puente levadizo",
                inspectQuote: "Es el puente levadizo que cruza el río. Ya he conseguido hacerlo bajar y se puede cruzar con seguridad.",
                alreadyInspectedQuote: "Es el puente levadizo que cruza el río. Ya he conseguido hacerlo bajar y se puede cruzar con seguridad.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            generator: new Element({
                names: ["generador", "generador eléctrico", "generador electrico"],
                mentionQuote: "un generador eléctrico",
                mentionAlreadyInspectedQuote: "un generador eléctrico",
                inspectQuote: "Es el generador eléctrico que da energía al puente. Parece que no le queda nada de combustible. Si consigo un poco podría elevar el puente fácilmente.",
                alreadyInspectedQuote: "Es el generador eléctrico que da energía al puente. Parece que no le queda nada de combustible. Si consigo un poco podría elevar el puente fácilmente.",
                useObjectQuote: "Con este poco de combustible debería ser suficiente para hacerlo funcionar. <audio src='soundbank://soundlibrary/vehicles/buses/buses_06'/> Perfecto, ya esta bajando el puente.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "gasCan1" || object === "gasCan2" || object === "gasCan3") {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["bridge1_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["bridge1_closed"];

                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["generatorDummy"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["generator"];

                        delete voxaEvent.model.game.inventory.objects[object]

                        voxaEvent.model.game.choices.bridge1Open = true;

                        // delete the bridge in the other side if we already were there
                        if (!("road_fishermanVillage_highway" in game.map.locations)) {
                            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["bridge1_closed_look"];
                        }

                        if (!("chadAlive" in voxaEvent.model.game.choices)) {
                            voxaEvent.model.game.choices.chadAlive = true;
                        }
                        return true;
                    }

                    return false;
                },
            }),
            generatorDummy: new Element({
                names: ["generador", "generador eléctrico", "generador electrico"],
                mentionQuote: "un generador eléctrico",
                mentionAlreadyInspectedQuote: "un generador eléctrico",
                inspectQuote: "Es el generador eléctrico que da energía al puente. No necesito usarlo más, el puente ya está bajado.",
                alreadyInspectedQuote: "Es el generador eléctrico que da energía al puente. No necesito usarlo más, el puente ya está bajado.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            fridgeFallBack: new Element({
                names: ["frigorifico", "frigorífico"],
                mentionQuote: "un frigorífico",
                mentionAlreadyInspectedQuote: "un frigorífico",
                inspectQuote: "Un frigorífico viejo sobre un contenedor, junto a una pila de basura. Parece un poco inestable. <audio src='soundbank://soundlibrary/ropes_cables_climbing/cables_metal/cables_metal_09'/> Vaya parece que ha caído hacia la montaña de basura. No pienso acercarme a verlo dentro de toda esa basura.",
                alreadyInspectedQuote: "Un frigorífico viejo que ha caído en medio de una pila de basura. No pienso rebuscar entre esa montaña de basura para ver que tiene dentro.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            fridgeFallFront: new Element({
                names: ["frigorifico", "frigorífico"],
                mentionQuote: "un frigorífico",
                mentionAlreadyInspectedQuote: "un frigorífico",
                inspectQuote: "Un frigorífico viejo. Se ha caído de encima de un contenedor. Algunas piezas me valdrá como chatarra.",
                alreadyInspectedQuote: "Un frigorífico viejo que se ha caído de encima de un contenedor. Ya lo he desmantelado",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 30;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            container: new Element({
                names: ["contenedor", "contenedor de basura"],
                mentionQuote: "un contenedor de basura",
                mentionAlreadyInspectedQuote: "un contenedor de basura",
                inspectQuote: "Un contenedor de basura. Puede que tenga algo útil dentro. Al fin y al cabo la basura de unos es el tesoro de otros. <audio src='soundbank://soundlibrary/doors/doors_metal/metal_02'/> Parece que dentro hay una palanca. Debería cogerla, seguro que me será de ayuda en alguna situación.",
                alreadyInspectedQuote: "Es el generador eléctrico que da energía al puente. Parece que no le queda nada de combustible. Si consigo un poco podría elevar el puente fácilmente.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["lever"] = false;
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["fridgeFallFront"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["fridgeFallBack"];
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            bushes2: new Element({
                names: ["arbusto", "arbusto con bayas", "arbusto con muchas bayas"],
                mentionQuote: "un arbusto con muchas bayas",
                mentionAlreadyInspectedQuote: "un simple arbusto",
                inspectQuote: "Este arbusto tiene muchas cuantas bayas. Serán una gran ración de alimento, las recogeré.",
                alreadyInspectedQuote: "Ya he recogido los frutos que tenía este arbusto.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.food += 30;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            guardTent: new Element({
                names: ["caseta", "caseta del vigilante"],
                mentionQuote: "la caseta del vigilante del vertedero",
                mentionAlreadyInspectedQuote: "la caseta del vigilante del vertedero",
                inspectQuote: "Es la caseta del vigilante del vertedero. Parece que dentro hay algunos restos de comida. Me los llevaré.",
                alreadyInspectedQuote: "Es la caseta del vigilante del vertedero. No hay nada en su interior.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.food += 20;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            spring: new Element({
                names: ["manantial"],
                mentionQuote: "un pequeño manantial",
                mentionAlreadyInspectedQuote: "un pequeño manantial seco",
                inspectQuote: "Un pequeño manantial a la orilla de la carretera. Apenas tiene agua. Me llevaré una poca.",
                alreadyInspectedQuote: "Un pequeño manantial a la orilla de la carretera. Parece que se ha secado.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 25;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            rocksBloking: new Element({
                names: ["derrumbe de rocas", "derrumbe"],
                mentionQuote: "un derrumbe de rocas",
                mentionAlreadyInspectedQuote: "un derrumbe de rocas",
                inspectQuote: "Es un derrumbe de rocas que evita la entrada a la cueva que hay hacia el sur. Me pregunto como podré ingeniarmelas para pasar por aquí.",
                alreadyInspectedQuote: "Es un derrumbe de rocas que evita la entrada a la cueva que hay hacia el sur. Me pregunto como podré ingeniarmelas para pasar por aquí.",
                useObjectQuote: "¡Abrete sésamo! <audio src='soundbank://soundlibrary/explosions/explosions/explosions_04'/> Listo, ya puedo pasar.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "dynomite") {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["rocksBloking"];
                        return true;
                    }

                    return false;
                },
            }),
            workersLocker_closed: new Element({
                names: ["taquilla"],
                mentionQuote: "una taquilla",
                mentionAlreadyInspectedQuote: "una taquilla",
                inspectQuote: "Es una taquilla. Seguramente la usaran los empleados del restaurante. Esta cerrada con una cadena atada a un candado. Necesitaré una herramienta que corte metal para poder abrirla.",
                alreadyInspectedQuote: "Es una taquilla. Seguramente la usaran los empleados del restaurante. Esta cerrada con una cadena atada a un candado. Necesitaré una herramienta que corte metal para poder abrirla.",
                useObjectQuote: "Con la cizalla podré romper la cadena. Listo. Ya está abierta.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "metalshears") {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["workersLocker_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["workersLocker_closed"];
                        return true;
                    }

                    return false;
                },
            }),
            workersLocker_open: new Element({
                names: ["taquilla", "taquilla abierta"],
                mentionQuote: "una taquilla abierta",
                mentionAlreadyInspectedQuote: "una taquilla abierta",
                inspectQuote: "Una taquilla abierta. Dentro hay una pequeña botella de agua. También hay un mechero. aun parece que no tiene gas debería cogerlo. Puedo necesitarlo.",
                alreadyInspectedQuote: "Una taquilla abierta. Ya la revisé. No tiene nada.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 5;
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["lighter"] = false;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            bridge2_closed_look: new Element({
                names: ["puente", "puente de cemento"],
                mentionQuote: "un puente de cemento",
                mentionAlreadyInspectedQuote: "un puente de cemento",
                inspectQuote: "Es el puente de cemento que pasa por encima del dique que tiene la central hidroeléctrica en el río. Parece que la parte central está derruida. No creo que pueda hacer nada al respecto desde este lado.",
                alreadyInspectedQuote: "Es el puente de cemento que pasa por encima del dique que tiene la central hidroeléctrica en el río. Parece que la parte central está derruida. No creo que pueda hacer nada al respecto desde este lado.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            shelf: new Element({
                names: ["estantería", "estanteria"],
                mentionQuote: "una estantería",
                mentionAlreadyInspectedQuote: "una estantería",
                inspectQuote: "Una estantería de aluminio típica de un almacén. Parece que alguien la ha usado de alacena. Tiene unas buenas raciones de agua y comida. Me las llevaré.",
                alreadyInspectedQuote: "Una estantería de aluminio típica de un almacén. Ya me he llevado todo lo que había.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 10;
                        voxaEvent.model.game.resources.food += 10;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            trunk: new Element({
                names: ["arcón metálico", "arcon", "arcón", "arcon metalico", "arcón metalico", "arcon metálico"],
                mentionQuote: "un arcón metálico",
                mentionAlreadyInspectedQuote: "un arcón metálico",
                inspectQuote: "Un arcón metálico para guardar cosas. Dentro tiene mucha comida y agua. Alguien lo usaba para guardar provisiones. AAhora es todo para mí.",
                alreadyInspectedQuote: "Un arcón metálico para guardar cosas. Alguien lo usaba para guardar provisiones pero ya las cogí todas.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 40;
                        voxaEvent.model.game.resources.food += 30;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            trunk2: new Element({
                names: ["bolsa", "bolsa de deporte"],
                mentionQuote: "una bolsa de deporte",
                mentionAlreadyInspectedQuote: "una bolsa de deporte",
                inspectQuote: "Es una bolsa de deporte común. Pesa mucho. Vaya dentro tiene de todo, agua comida y chatarra. Me lo llevaré todo.",
                alreadyInspectedQuote: "Es una bolsa de deporte común. Ya la revisé, está vacía.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.water += 15;
                        voxaEvent.model.game.resources.food += 15;
                        voxaEvent.model.game.resources.junk += 20;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            skeleton: new Element({
                names: ["esqueleto"],
                mentionQuote: "un esqueleto",
                mentionAlreadyInspectedQuote: "un esqueleto",
                inspectQuote: "Debe ser el esqueleto de la persona que se ocultaba aquí cuando las rocas de la entrada cayeron. Se quedó atrapado aquí. Me pregunto por que no agotó las provisiones que tenía en la cueva antes de morir.",
                alreadyInspectedQuote: "Debe ser el esqueleto de la persona que se ocultaba aquí cuando las rocas de la entrada cayeron. Se quedó atrapado aquí. Me pregunto por que no agotó las provisiones que tenía en la cueva antes de morir.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            chadCorpse: new Element({
                names: ["cadáver de Chad", "cadáver", "cadaver de Chad", "cadaver"],
                mentionQuote: "el cadáver de Chad",
                mentionAlreadyInspectedQuote: "el cadáver de Chad",
                inspectQuote: "Es el cuerpo sin vida de mi compañero de expediciones, Chad. Llegamos muy tarde para salvarlo. Qué extraño, parece que se ha arrastado hasta aquí desde el Oeste. También tiene incisiones alrededor de todo el cuerpo. Tiene una herida bastante más grande en el cuello que parece haber sido la causa de la muerte. Bueno, debería enterrarlo.",
                alreadyInspectedQuote: "Es el cuerpo sin vida de mi compañero de expediciones, Chad. Llegamos muy tarde para salvarlo. Qué extraño, parece que tiene incisiones alrededor de todo el cuerpo. Tiene una herida bastante más grande en el cuello que parece haber sido la causa de la muerte. Bueno, debería enterrarlo.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["chadCorpse"];
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["chadTomb"] = false

                    }

                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            chadTomb: new Element({
                names: ["tumba", "tumba de Chad", "tumba de chad"],
                mentionQuote: "la tumba de Chad",
                mentionAlreadyInspectedQuote: "la tumba de Chad",
                inspectQuote: "Es la tumba de Chad. Lo enterré aquí cuando encontré su cuerpo. Descanse en paz.",
                alreadyInspectedQuote: "Es la tumba de Chad. Lo enterré aquí cuando encontré su cuerpo. Descanse en paz.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            bridge1_closed_look: new Element({
                names: ["puente", "puente levadizo"],
                mentionQuote: "un puente levadizo",
                mentionAlreadyInspectedQuote: "un puente levadizo",
                inspectQuote: "Es el puente levadizo que cruza el río. Esta hizado. Solo puedo bajarlo desde el otro lado.",
                alreadyInspectedQuote: "Es el puente levadizo que cruza el río. Esta hizado. Solo puedo bajarlo desde el otro lado.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            safeBox_closed: new Element({
                names: ["caja fuerte", "caja"],
                mentionQuote: "una caja fuerte",
                mentionAlreadyInspectedQuote: "una caja fuerte",
                inspectQuote: "Es una caja fuerte. Alguien debía ir con prisas y parece que no la cerró bien. Tal vez con alguna herramienta pueda abrirla.",
                alreadyInspectedQuote: "Es una caja fuerte. Alguien debía ir con prisas y parece que no la cerró bien. Tal vez con alguna herramienta pueda abrirla.",
                useObjectQuote: "Con la palanca podré forzar la puerta. Listo. Ya está abierta.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "lever") {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["safeBox_open"] = false;
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["safeBox_closed"];
                        return true;
                    }

                    return false;
                },
            }),
            safeBox_open: new Element({
                names: ["caja fuerte", "caja"],
                mentionQuote: "una caja fuerte",
                mentionAlreadyInspectedQuote: "una caja fuerte",
                inspectQuote: "Una caja fuerte que ya abrí. Dentro tiene un arma sib balas y una linterna sin batería. Debería de coger ambas cosas.",
                alreadyInspectedQuote: "Una caja fuerte que ya abrí. No tiene nada.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["gunEmpty"] = false;
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects["lanternEmpty"] = false;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            door_blocked: new Element({
                names: ["puerta", "puerta bloqueada"],
                mentionQuote: "una puerta",
                mentionAlreadyInspectedQuote: "una puerta",
                inspectQuote: "Es una puerta que lleva a la habitación del este. Está bloqueda por un pilar de cemento. Va a ser imposible abrirla.",
                alreadyInspectedQuote: "Es una puerta que lleva a la habitación del este. Está bloqueda por un pilar de cemento. Va a ser imposible abrirla.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            brokenFence: new Element({
                names: ["valla", "valla de hierro", "valla de hierro rota"],
                mentionQuote: "una valla de hierro rota",
                mentionAlreadyInspectedQuote: "una valla de hierro rota",
                inspectQuote: "Es una valla de hierro rota. Puedo sacar un buen puñado de chatarra de ella si me llevo los postes. No hay mucho más que hacer con ella.",
                alreadyInspectedQuote: "Es una valla de hierro rota. Ya me llevé todo lo que tenía alguna utilidad.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 20;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            sporeInfestation_closed: new Element({
                names: ["cúmulo de esporas", "cumulo de esporas", "cúmulo", "cumulo"],
                mentionQuote: "un cúmulo de esporas descomunal",
                mentionAlreadyInspectedQuote: "un cúmulo de esporas descomunal",
                inspectQuote: "Es un cúmulo de esporas descomunal. Nunca había visto uno tan grande. Me impide el paso hacia el laboratorio por donde han huido algunos de esos rabiosos. Debería deshacerme de él con fuego pero voy a necesitar algo más potente que un mechero.",
                alreadyInspectedQuote: "Es un cúmulo de esporas descomunal. Nunca había visto uno tan grande. Me impide el paso hacia el laboratorio por donde han huido algunos de esos rabiosos. Debería deshacerme de él con fuego pero voy a necesitar algo más potente que un mechero.",
                useObjectQuote: "Ahora que tengo un lanzallamas puedo hacerlo cenizas. Me aseguraré de que no queda nada.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    if (object === "flameThrower") {
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["sporeInfestation_closed"];
                        return true;
                    }

                    return false;
                },
            }),
            cabinet: new Element({
                names: ["armario"],
                mentionQuote: "un armario",
                mentionAlreadyInspectedQuote: "un armario",
                inspectQuote: "Es un armario para guardar material de laboratorio. Dentro tiene lago de agua y algunas herramientas que me pueden servir como chatarra.",
                alreadyInspectedQuote: "Es un armario para guardar material de laboratorio. Ya lo revisé y está vacío.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 20;
                        voxaEvent.model.game.resources.water += 10;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            watchTower: new Element({
                names: ["torre", "torre de vigilancia"],
                mentionQuote: "una torre de vigilancia",
                mentionAlreadyInspectedQuote: "una torre de vigilancia",
                inspectQuote: "Es una torre de vigilancia. Puede que desde ahí pueda ver algo más. No se ve nada del almacén del laboratorio pero hacia al norte, en las instalaciones del laboratorio se puede ver que algún aparato asomando por un hueco enorme en la pared. Debo acercarme más para ver exactamente que es.",
                alreadyInspectedQuote: "Es una torre de vigilancia. Puede que desde ahí pueda ver algo más. No se ve nada del almacén del laboratorio pero hacia al norte, en las instalaciones del laboratorio se puede ver que algún aparato asomando por un hueco enorme en la pared. Debo acercarme más para ver exactamente que es.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),
            sporeCluster: new Element({
                names: ["cúmulo de esporas", "cumulo de esporas", "cúmulo", "cumulo"],
                mentionQuote: "un cúmulo de esporas",
                mentionAlreadyInspectedQuote: "un cúmulo de esporas",
                inspectQuote: "Es un cúmulo de esporas. Parece que cuanto más me aproximo al norte aparecen más signos de las dichosas esporas. Espero que no se extiendan más y el problema no se vuelva peor de lo que ya está.",
                alreadyInspectedQuote: "Es un cúmulo de esporas. Parece que cuanto más me aproximo al norte aparecen más signos de las dichosas esporas. Espero que no se extiendan más y el problema no se vuelva peor de lo que ya está.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {
                    return false;
                },
            }),
            artifactDestroyed: new Element({
                names: ["artefacto", "artefacto extraño"],
                mentionQuote: "un artefacto extraño",
                mentionAlreadyInspectedQuote: "un artefacto extraño",
                inspectQuote: "Es el artefacto extraño que montaron los sectarios para aumentar la dispersión de las esporas. Está destrozado y no queda mucho de él pero puedo llevarme mucha chatarra.",
                alreadyInspectedQuote: "Es el artefacto extraño que montaron los sectarios para aumentar la dispersión de las esporas. Está destrozado y no queda mucho de él.",
                useObjectQuote: "",
                inspectActionTaken: function (voxaEvent, alreadyInspected) {
                    if (!alreadyInspected) {
                        voxaEvent.model.game.resources.junk += 40;
                    }
                    return "";
                },
                useObjectActionTaken: function (voxaEvent, object) { return false; },
            }),




            animalPath_1: new Element({   // it is a pair with animalPath_1_withTrap
                names: ["sendero", "sendero de animales", "camino", "camino de animales"],
                mentionQuote: "un sendero pequeño y estrecho por donde parece que suelen pasar animales",
                mentionAlreadyInspectedQuote: "un sendero estrecho por donde parece que suelen pasar animales",
                inspectQuote: "Es un sendero hecho por animales al pasar de manera habitual. Puede que logre atrapar alguno con una trampa.",
                alreadyInspectedQuote: "Es un sendero hecho por animales al pasar de manera habitual. Puede que logre atrapar alguno con una trampa.",
                useObjectQuote: "Pondré esta trampa en el sendero. Puede que capture algún animal del que sacar un poco de comida.",
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

            animalPathTree_1: new Element({   
                names: ["árbol", "arbol"],
                mentionQuote: "un árbol",
                mentionAlreadyInspectedQuote: "un árbol",
                inspectQuote: "Un árbol no muy grande. Se escucha bastante ruido de pájaron cantando en la copa. Puede que con la trampa adecuada puede capturar algunos y cocinarlos.",
                alreadyInspectedQuote: "Un árbol no muy grande. Se escucha bastante ruido de pájaron cantando en la copa. Puede que con la trampa adecuada puede capturar algunos y cocinarlos.",
                useObjectQuote: "Colocaré la red sobre algunas ramas. Puede que capture algún animal del que sacar algo de comida.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {

                    // if the object is the one intended
                    if (object === "trapMedium_1_12h") {
                        // delete the animalPath_X and add the corresponding element animalPath_X_withTrap 
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPathTree_1"];
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPathTree_1_withTrap"] = false;
                        // delete the trap used in the player inventory
                        delete voxaEvent.model.game.inventory.objects[object]

                        // save when the trap: the animalPath_X_withTrap element, the element to replace on the animalPath_X_withTrap,
                        // the trap used and the time when it was used
                        voxaEvent.userDator.saveUserTrapSet(voxaEvent.user.id, "animalPathTree_1_withTrap", object, "animalPathTree_1", Date.now())

                        // return true cause the object can be used
                        return true;
                    }

                    return false;
                },
            }),
            animalPathTree_1_withTrap: new Element({
                names: ["red", "árbol con red", "arbol con red"],
                mentionQuote: "una red que coloqué sobre un árbol",
                mentionAlreadyInspectedQuote: "una red que coloqué sobre un árbol",
                inspectQuote: "Puse está red sobre un árbol donde parecía que pasaban muchos pájaros para ver si atrapaba algo.",
                alreadyInspectedQuote: "Puse está red sobre un árbol donde parecía que pasaban muchos pájaros para ver si atrapaba algo.",
                useObjectQuote: "",
                inspectActionTaken: async function (voxaEvent, alreadyInspected) {
                    // dont set alreadyInspected to true as it does not matter (this function has to be executed everytime the element is inspected)
                    // check database for this animalPath_X_withTrap 
                    const trap = await voxaEvent.userDator.getUserTrapSet(voxaEvent.user.id, "animalPathTree_1_withTrap")
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
                            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPathTree_1_withTrap"];
                            voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements[elementToReplace] = false;
                            // delete the trap set in the database
                            voxaEvent.userDator.removeUserTrapSet(voxaEvent.user.id, "animalPathTree_1_withTrap")

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

            animalPathInWater_1: new Element({   
                names: ["poza", "poza pequeña"],
                mentionQuote: "una pequeña poza",
                mentionAlreadyInspectedQuote: "una pequeña poza",
                inspectQuote: "Una poza de pequeño tamaño donde parece que los peces habitualmente se paran a descansar o buscar comida. Sería un buen sitio para poner algún tipo de trampa y capturarlos.",
                alreadyInspectedQuote: "Una poza de pequeño tamaño donde parece que los peces habitualmente se paran a descansar o buscar comida. Sería un buen sitio para poner algún tipo de trampa y capturarlos.",
                useObjectQuote: "Colocaré la botella de pesca en la poza. Seguro que pesco algún pez.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {

                    // if the object is the one intended
                    if (object === "trapVerySmall_1_01h") {
                        // delete the animalPath_X and add the corresponding element animalPath_X_withTrap 
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPathInWater_1"];
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPathInWater_1_withTrap"] = false;
                        // delete the trap used in the player inventory
                        delete voxaEvent.model.game.inventory.objects[object]

                        // save when the trap: the animalPath_X_withTrap element, the element to replace on the animalPath_X_withTrap,
                        // the trap used and the time when it was used
                        voxaEvent.userDator.saveUserTrapSet(voxaEvent.user.id, "animalPathInWater_1_withTrap", object, "animalPathInWater_1", Date.now())

                        // return true cause the object can be used
                        return true;
                    }

                    return false;
                },
            }),
            animalPathInWater_1_withTrap: new Element({
                names: ["trampa", "trampa en poza", "trampa en una poza", "poza"],
                mentionQuote: "una trampa en una poza",
                mentionAlreadyInspectedQuote: "una trampa en una poza",
                inspectQuote: "Puse está botella de pesca en una poza por donde parecía que pasaban muchos peces. Espero atrapar alguno.",
                alreadyInspectedQuote: "Puse está botella de pesca en una poza por donde parecía que pasaban muchos peces. Espero atrapar alguno.",
                useObjectQuote: "",
                inspectActionTaken: async function (voxaEvent, alreadyInspected) {
                    // dont set alreadyInspected to true as it does not matter (this function has to be executed everytime the element is inspected)
                    // check database for this animalPath_X_withTrap 
                    const trap = await voxaEvent.userDator.getUserTrapSet(voxaEvent.user.id, "animalPathInWater_1_withTrap")
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
                            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPathInWater_1_withTrap"];
                            voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements[elementToReplace] = false;
                            // delete the trap set in the database
                            voxaEvent.userDator.removeUserTrapSet(voxaEvent.user.id, "animalPathInWater_1_withTrap")

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

            animalPath_2: new Element({   // it is a pair with animalPath_2_withTrap
                names: ["sendero", "sendero de animales", "camino", "camino de animales"],
                mentionQuote: "un sendero bastante amplio por donde parece que suelen pasar animales",
                mentionAlreadyInspectedQuote: "un sendero bastante amplio por donde parece que suelen pasar animales",
                inspectQuote: "Es un sendero hecho por animales al pasar de manera habitual. Hay huellas batante grandes y el sendero es bantante ancho. Puede que logre atrapar algún animal con una trampa lo suficientemente grande.",
                alreadyInspectedQuote: "Es un sendero hecho por animales al pasar de manera habitual. Hay huellas batante grandes y el sendero es bantante ancho. Puede que logre atrapar algún animal con una trampa lo suficientemente grande.",
                useObjectQuote: "Pondré este cepo grande en el sendero. Puede que capture algún animal del que sacar una buena cantidad de comida.",
                inspectActionTaken: function (voxaEvent, alreadyInspected) { return ""; },
                useObjectActionTaken: function (voxaEvent, object) {

                    // if the object is the one intended
                    if (object === "trapBig_1_24h") {
                        // delete the animalPath_X and add the corresponding element animalPath_X_withTrap 
                        delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPath_2"];
                        voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPath_2_withTrap"] = false;
                        // delete the trap used in the player inventory
                        delete voxaEvent.model.game.inventory.objects[object]

                        // save when the trap: the animalPath_X_withTrap element, the element to replace on the animalPath_X_withTrap,
                        // the trap used and the time when it was used
                        voxaEvent.userDator.saveUserTrapSet(voxaEvent.user.id, "animalPath_2_withTrap", object, "animalPath_2", Date.now())

                        // return true cause the object can be used
                        return true;
                    }

                    return false;
                },
            }),
            animalPath_2_withTrap: new Element({
                names: ["trampa", "sendero con trampa", "sendero"],
                mentionQuote: "una trampa que puse en el sendero de animales",
                mentionAlreadyInspectedQuote: "una trampa que puse en un sendero de animales",
                inspectQuote: "Puse está trampa en un sendero donde pasan animales de bastante tamaño. Espero haber atrapado algo.",
                alreadyInspectedQuote: "Puse está trampa en un sendero donde pasan animales de bastante tamaño. Espero haber atrapado algo.",
                useObjectQuote: "",
                inspectActionTaken: async function (voxaEvent, alreadyInspected) {
                    // dont set alreadyInspected to true as it does not matter (this function has to be executed everytime the element is inspected)
                    // check database for this animalPath_X_withTrap 
                    const trap = await voxaEvent.userDator.getUserTrapSet(voxaEvent.user.id, "animalPath_2_withTrap")
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
                            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements["animalPath_2_withTrap"];
                            voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements[elementToReplace] = false;
                            // delete the trap set in the database
                            voxaEvent.userDator.removeUserTrapSet(voxaEvent.user.id, "animalPath_2_withTrap")

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