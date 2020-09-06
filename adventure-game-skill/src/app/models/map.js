const Location = require("./location");
const Path = require("./path");

module.exports = class Map {
    constructor() {
        // Initial state of the locations the first time the player enters them
        this.locations = {
            southForest1: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el bosque al sureste de la central hidroeléctrica",
                storyQuote: "Sandra dice que antes de la explosión a este sitio solía venir mucha gente a hacer picnics y deporte. Supongo que debe de haber perdido encanto desde entonces aunque todavía queda algo de vegetación.",
                main: false,
                elements: function (game) {
                    return {
                        animalPathTree_1: false,
                        bushes1: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            hydroelectricPowerPlantOutskirts: new Location({
                names: [],
                locationQuote: "las afueras de la central hidroeléctrica",
                storyQuote: "El terreno está bastante allanado y no hay casi hierba o plantas. Parece que en una época pasada debieron de pasar muchos vehículos que se dirigían a la central hidroeléctrica.",
                main: false,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: {
                    N: new Path({
                        goesTo: "road_Camp_hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "southForest1",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "hydroelectricPowerPlant",
                        canGo: function (game) {
                            // If the door is closed still
                            if ("door_metalFence_1_closed" in game.map.locations[game.map.currentLocation].elements) {
                                // return problem 0
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["Hay una verja metálica con un candado que me impide el paso. Tal vez pueda encontrar algo con lo que desacerme del candado."],
                    }),
                }
            }),
            hydroelectricPowerPlant: new Location({
                names: ["central", "central hidroeléctrica", "central hidroelectrica"], // names with and without accents
                locationQuote: "la central hidroeléctrica",
                storyQuote: "Recuerdo todo el revuelo que se monto cuando iban a comenzar la construcción de este sitio. Decían que el dique que iban a construir reduciría tanto el caudal del río que el resto de ploblaciones pesqueras en su cauce desaparecerían. Al final llevaban razón",
                main: true,
                elements: function (game) {
                    let e = {
                        door_metalFence_closed: false,
                        bridge2_closed: false,
                    }

                    if (game.choices.reliquaryReturned) {
                        e.fuseBoxEmpty = false
                    } else {
                        e.fuseBoxHidden = false
                    }

                    return e;
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: {
                    N: new Path({
                        goesTo: "powerPlantLockedRoom",
                        canGo: function (game) {
                            if ("door_metalFence_closed" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            }

                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["La puerta de metal del despacho esta cerrada a cal y canto. No puedo entrar."],
                    }),
                    E: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "riverBankPowerPlant",
                        canGo: function (game) {
                            if ("bridge2_closed" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            } else if (!("fishermanVillage" in game.map.locations)){
                                return 1;
                            }

                            return true;
                        },
                        go: function (game) {
                            if (!("riverBankPowerPlant" in game.map.locations)) {
                                return "scene7_crossBridge2";
                            }

                            return "";
                        },
                        problemMentionQuotes: ["El puente que debo cruzar esta roto e impide que pase. Debería inspeccionarlo más a fondo para averiguar como cruzarlo.", "Debería de investigar el pueblo pesquero con Sandra antes de continuar por este camino."],
                    }),
                }
            }),
            powerPlantLockedRoom: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el despacho del director de la central",
                storyQuote: "Es un despacho elegante aunque hay papeles y archivadores por todas partes. Supongo que el director de este sitio debía de trabajar mucho.",
                main: false,
                elements: function (game) {
                    return {
                        brokenPc: false,
                        deskWood: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        trapMedium_1_12h: false,
                    };
                },
                to: { // Contains the paths connected with this location
                    S: new Path({
                        goesTo: "hydroelectricPowerPlant",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            road_Camp_hydroelectricPowerPlantOutskirts: new Location({
                names: [],
                locationQuote: "el sendero que comunica el campamento con la central hidroeléctrica",
                storyQuote: "No hay mucho que decir sobre este sitio. Es simplemente un camino hecho por la maquinaria que iba y venia constantemente de la central hidroeléctrica.",
                main: false,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    // set npc initial state
                    game.npcs["sandra"] = "1";

                    return {
                        sandra: false, // return npc with false (the player did not talk to him)
                    };
                },
                objects: function (game) {
                    return {
                        trapSmall_1_06h: false,
                    };
                },
                to: {
                    S: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    N: new Path({
                        goesTo: "camp",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            camp: new Location({
                names: ["el campamento", "campamento"],
                locationQuote: "el campamento",
                storyQuote: "Este es el asentamiento que levantamos para vivir unos cuantos supervivientes y yo poco despues de la explosión. Ojalá todavía fueramos tantos como antes. Al menos los que quedamos podemos mantenernos vivos por nuestra cuenta.",
                main: true,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    // set merchant takumi npc initial state
                    game.npcs["takumi"] = "1";
                    game.npcs["tom"] = "1";

                    if (game.npcs["sandra"] == 2) {
                        return {
                            sandra: false, // npc with false (the player did not talk to him)
                            takumi: false,
                            tom: false,
                        };
                    }

                    return {
                        takumi: false,
                        tom: false,
                    };
                },
                objects: function (game) {
                    return {};
                },
                to: {
                    N: new Path({
                        goesTo: "northForest1",
                        canGo: function (game) {
                            if (game.npcs["sandra"] < 3) {
                                return 0;
                            }

                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["Debería de hablar con Sandra antes de ir hacia el Norte del campamento."],
                    }),
                    S: new Path({
                        goesTo: "road_Camp_hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "campWarehouse",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),


            campWarehouse: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el almacén del campamento",
                storyQuote: "Es más bien una cabaña grande que construimos en el campamento hace ya bastantes años. Aquí guardamos todos los aparatos de utilidad. Sydney pasa aquí la mayor del tiempo reparando máquinas o creando aparatos nuevos.",
                main: false,
                elements: function (game) {
                    return {
                        eolicWindmill: false,
                        waterFilter: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    O: new Path({
                        goesTo: "camp",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            northForest1: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el bosque del norte del campamento",
                storyQuote: "Es un bosque bastante denso y con mucha fauna. Nos sirvió de refugio mucho tiempo hasta que establecimos el campamento. Nadie podía encontrarnos aquí. Ni siquiera los rabiosos. Ahora sigue siendo una buena fuente de recursos.",
                main: false,
                elements: function (game) {
                    return {
                        animalPath_1: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "crossRoads",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "camp",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            crossRoads: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el cruce de caminos",
                storyQuote: "No es más que un pequeño cruce donde se unen el camino del bosque y el camino que va de el poblado de pescadores a la estación. Pasamos mucho por aquí cuando salimos del campamento por su parte norte.",
                main: false,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    if (game.npcs["sandra"] == 3) {
                        return {
                            sandra: false, // npc with false (the player did not talk to him)
                        };
                    }

                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    S: new Path({
                        goesTo: "northForest1",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "gasStation",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {
                            if (!("gasStation" in game.map.locations)) {
                                return "scene4_enterGasStation";
                            }

                            return "";
                        },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "fishermanVillage",
                        canGo: function (game) {
                            if (game.npcs["sandra"] < 4) {
                                return 0;
                            }

                            return true;
                        },
                        go: function (game) { 
                            if (!("fishermanVillage" in game.map.locations)) {
                                return "scene3_goToFishermanVillage";
                            }

                            return ""; 
                        },
                        problemMentionQuotes: ["Debería hablar con Sandra antes de ir al pueblo pesquero."],
                    }),
                }
            }),
            fishermanVillage: new Location({
                names: ["pueblo", "pueblo pesquero", "pueblo de pescadores"], // (only needed if main == true)
                locationQuote: "el pueblo pesquero",
                storyQuote: "Es un pequeño pueblo de pescadores abandonado. Despues de construir la central hidroeléctrica el caudal del río bajó tanto que todos sus habitantes tuvieron que mudarse. Aquí es donde Chad y Sydney vinieron a buscar recursos del campamento y donde los rabiosos los capturaron. Para cruzar el río desde aquí es necesario bajar un puente levadizo cuyo motor es alimentado por un generador.",
                main: true,
                elements: function (game) {
                    return {
                        boathouse: false,
                        fishermanHut: false,
                        generator: false,
                        bridge1_closed: false,
                    }
                },
                npcs: function (game) {
                    if (game.npcs["chad"] == 6 && game.choices.chadAlive == true) {
                        return {
                            chad: false, // npc with false (the player did not talk to him)
                        };
                    }
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    E: new Path({
                        goesTo: "crossRoads",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "road_fishermanVillage_highway",
                        canGo: function (game) {
                            if ("bridge1_closed" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) { 
                            if (!("road_fishermanVillage_highway" in game.map.locations)) {
                                return "scene5_crossBridge1";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: ["Debo de bajar el puente levadizo si quiero ir al otro lado de la orilla del río."],
                    }),
                }
            }),
            gasStation: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la gasolinera",
                storyQuote: "Me acuerdo de esta gasolinera. Mi padre siempre repostaba aquí cuando tenía que acompañarlo al trabajo en el laboratorio. Creo que el dueño del lugar tenía un perro. Supongo que ha sido el que he encontrado atrapado justo antes de llegar.",
                main: false,
                elements: function (game) {
                    return {
                        gasPump: false,
                    }
                },
                npcs: function (game) {
                    if(game.choices.dogSaved){
                        game.npcs["dog"] = "1";

                        return {
                            dog: false,
                        }
                    }

                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "gasStationBuilding",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "littleVillage",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "road_gasStation_city",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "crossRoads",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            gasStationBuilding: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "edificio de la gasolinera",
                storyQuote: "No es más que el edificio que hay junto a los surtidores de la gasolinera. Antes albergaba una pequeña tienda con algunas cosas. No queda nada a causa de los saqueos que provocó la expansión de la enfermedad.",
                main: false,
                elements: function (game) {
                    return {
                        locker_open: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        gasCan1: false,
                    };
                },
                to: { // Contains the paths connected with this location
                    S: new Path({
                        goesTo: "gasStation",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            road_gasStation_city: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el camino que comunica la ciudad con la gasolinera",
                storyQuote: "La carretera esta llena de vehículos estrellados o rotos. Es un caos total. También es de esperar que ocurra cuando intentas levantar un muro de 14 metros alrredor de una ciudad para que nadie entre ni salga debido a una epidemia.",
                main: false,
                elements: function (game) {
                    return {
                        brokenTruck: false,
                        bustedMotorbike: false,
                        wallCity: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    O: new Path({
                        goesTo: "gasStation",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            littleVillage: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "una aldea",
                storyQuote: "Apenas tiene un puñado de casas. La mayoría de pescadores que vinieron a trabajar al polígono industrial depués de la construcción de la central hidroeléctrica.",
                main: true,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "gasStation",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "merchantHouse",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "industrialParkOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            merchantHouse: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la casa de Takumi, el mercader del campamento",
                storyQuote: "Parece bastante antigua y no hay mucho lujo. Supongo que su familia era bastante humilde. Este sitio tiene un aire de nostalgia.",
                main: false,
                elements: function (game) {
                    return {
                        table: false,
                        sofa_closed: false,
                        hangingCupboard: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "littleVillage",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            industrialParkOutskirts: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "las afueras del polígono industrial",
                storyQuote: "Aquí hay mucha basura, contenedores y camiones de mercancias pero nada más. Supongo que es lo normal en la entrada a un polígono.",
                main: false,
                elements: function (game) {
                    return {
                        docker: false,
                        door_metalFence_1_closed: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    E: new Path({
                        goesTo: "industrialParkEntrance",
                        canGo: function (game) {
                            if ("door_metalFence_1_closed" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            }

                            return true;
                        },
                        go: function (game) { 
                            if (!("industrialParkEntrance" in game.map.locations)) {
                                return "scene11_meetsHugoInIndustrial";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: ["Hay una valla metálica que me impide el paso. Si la inspecciono tal vez averigue como pasar."],
                    }),
                    O: new Path({
                        goesTo: "littleVillage",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            industrialParkEntrance: new Location({
                names: ["polígono", "poligono", "poligono industrial", "polígono industrial"], // (only needed if main == true)
                locationQuote: "el polígono industrial",
                storyQuote: "Esta llena de vehículos y contenedores de cargar. Tambíen hay muchos signos de esas malditas esporas. Seguramente a causa de toda la gente infectada que huyó hasta aquí justo antes de que confinaran la ciudad. Aunque tambíen puede ser de los que vinieron depues a intentar sobrevivir.",
                main: true,
                elements: function (game) {
                    return {
                        truckWithToolBox: false,
                        floatingCrate: false,
                        sporeInfestation2_closed: false,
                    }
                },
                npcs: function (game) {
                    game.npcs["hugo"] = "1";
                    return {
                        hugo: false,
                    };
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "industrialParkNorthStreet",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "industrialParkSouthStreet",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "industrialParkEastStreet",
                        canGo: function (game) {
                            if ("sporeInfestation2_closed" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["No puedo pasar. Hay un cúmulo de esporas enorme. Tendré que eliminarlo primero."],
                    }),
                    O: new Path({
                        goesTo: "industrialParkOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            industrialParkNorthStreet: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la calle norte del polígono",
                storyQuote: "En esta calle vendian mayoritariamente ropa. Todavía hay algunos trapos rotos por el suelo.",
                main: false,
                elements: function (game) {
                    return {
                        carTrunk: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    S: new Path({
                        goesTo: "industrialParkEntrance",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            industrialParkSouthStreet: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la calle sur del polígono",
                storyQuote: "Aquí se movían sobre todo materiales de construcción aunque casi todo ha sido saqueado.",
                main: false,
                elements: function (game) {
                    return {
                        creaneWithSteelCable: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "industrialParkEntrance",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            industrialParkEastStreet: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la calle este del polígono",
                storyQuote: "Nunca entre en este sitio pero ahora parece que los cúmulos de esporas se han adueñado de él. No debería pasar mucho tiempo aquí o puede que acabe infectandome.",
                main: false,
                elements: function (game) {
                    return {
                        merchantWarehouse: false,
                        sporeCluster2: false,
                        sporeCluster3: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    O: new Path({
                        goesTo: "industrialParkEntrance",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            road_fishermanVillage_highway: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el camino que conecta el pueblo pesquero y la carretera principal",
                storyQuote: "Fue por donde los rabiosos huyeron despues de raptar a Sydney y atacar a Chad. Hay huellas por todos lados y signos de pelea.",
                main: false,
                elements: function (game) {
                    if (game.choices.chadAlive === false){
                        if (game.choices.bridge1Open === true) {
                            return {
                                chadCorpse: false,
                            }
                        }

                        return {
                            chadCorpse: false,
                            bridge1_closed_look: false,
                        }
                    }

                    return {}
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    E: new Path({
                        goesTo: "fishermanVillage",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "highway_1",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            highway_1: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la carretera principal",
                storyQuote: "Hay un cruce donde la carretara se divide. Hacia el norte lleva a las instalaciones militares y a laboratorio y hacia el sur lleva la montaña. El camino del Oeste lleva a otras poblaciones pero no recuerdo haber ido con mi padre por allí.",
                main: false,
                elements: function (game) {
                    return {
                        wallHighway: false,
                    }
                },
                npcs: function (game) {
                    if (game.choices.chadAlive){
                        game.npcs["chad"] = "1";

                        return {
                            chad: false,
                        }
                    }

                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "militaryCampusEntrance",
                        canGo: function (game) {
                            if (!("road_fishermanVillage_highway" in game.map.locations)) {
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) { 
                            if (!("militaryCampusEntrance" in game.map.locations)) {
                                return "scene9_findEnemies";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: ["Antes de continuar explorando debería ir a otro lado del puente del pueblo pesquero. Creo que desde aquí puedo llegar llendo hacia el Este."],
                    }),
                    S: new Path({
                        goesTo: "dumpOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "road_fishermanVillage_highway",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { 
                            if (!("road_fishermanVillage_highway" in game.map.locations)) {
                                return "scene6_reachBridge1FromOtherSide";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            dumpOutskirts: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "las afueras del vertedero",
                storyQuote: "La carretera de la montaña lleva directo a este sitio. La verdad es que podían haber puesto el vertedo en un lugar más alejado del río y las montañas. El asfalto de la carreta está muy agrietado. Es normal con la cantidad de camiones que han tenido que pasar poe aquí.",
                main: false,
                elements: function (game) {
                    return {
                        guardTent: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "highway_1",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "highway_2",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "dump",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            dump: new Location({
                names: ["vertedero"], // (only needed if main == true)
                locationQuote: "el vertedero",
                storyQuote: "Uf, que peste, no se por que nadie querría venir aquí. Aunque supongo que hasta en un vertedero se pueden encontrar cosas útiles. Sandra siempre dice que la gente antes tiraba cosas por las que ahora mataríamos.",
                main: true,
                elements: function (game) {
                    return {
                        sancontainerdra: false,
                        fridgeFallBack: false
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    E: new Path({
                        goesTo: "dumpOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            highway_2: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la carretra que lleva a la montaña",
                storyQuote: "También se puede ir hasta la orilla del río desde aquí.",
                main: false,
                elements: function (game) {
                    return {
                        bushes2: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "dumpOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "mountainRoad",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "riverBankRestaurant",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            riverBankRestaurant: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el restaurante de la orilla del río",
                storyQuote: "Me encantaba este sitio. Los fines de semana solíamos venir a comer y depués metíamos los pies en el agua y nos bañabamos. Esta prácticamente igual a como lo recuerdo, solo que un poco más viejo.",
                main: false,
                elements: function (game) {
                    return {
                        workersLocker_closed: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    S: new Path({
                        goesTo: "riverBankPowerPlant",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { 
                            if (!("riverBankPowerPlant" in game.map.locations)) {
                                return "scene8_reachBridge2FromOtherSide";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "highway_2",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            riverBankPowerPlant: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la orilla del río que se comunica con la central hidroeléctrica",
                storyQuote: "El dique de la central llega hasta esta orilla desde el otro lado del río. La verdad es que es mucho más feo de lo que lo recuerdo. Desde luego la central no le hizo bien ni a la gente que vivía río abajo ni la que estaba río arriba.",
                main: false,
                elements: function (game) {
                    if (game.choices.bridge2Open === true) {
                        return {
                            animalPathInWater_1: false,
                        }
                    }

                    return {
                        animalPathInWater_1: false,
                        bridge2_closed_look: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "riverBankRestaurant",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "hydroelectricPowerPlant",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            mountainRoad: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el camino de la montaña",
                storyQuote: "Recuerdo haber pasado por aquí con mi padre algunas veces. Hay muy buenas vistas y mucha naturaleza. No creo que siga habiendo mucha gente que pueda disfrutarlas.",
                main: false,
                elements: function (game) {
                    return {
                        spring: false,
                        animalPath_2: false,
                        rocksBloking: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "highway_2",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "cave",
                        canGo: function (game) {
                            if ("rocksBloking" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            } else if (!("lanternFull" in game.inventory.objects)){
                                return 1;
                            }
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["Ha habido un derrumbe y las rocas me impiden entrar en la cueva. Debería deshacerme de ellas si quiero entrar.", "La cueva está demasiado oscura. No veo nada. Necesitaré llevar una linterna con batería en la mochila si quiero entrar."],
                    }),
                }
            }),
            cave: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la cueva",
                storyQuote: "Nunca había entrado a esta cueva en concreto pero si que recuerdo que había varias de camino a la parte alta de la montaña. Papá me traía de vez en cuando y creo que hasta vine con el colegio alguna vez.",
                main: false,
                elements: function (game) {
                    return {
                        shelf: false,
                        trunk: false,
                        trunk2: false,
                        skeleton: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        trapBig_1_24h: false,
                    };
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "mountainRoad",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            militaryCampusEntrance: new Location({
                names: ["campus militar", "campus"], // (only needed if main == true)
                locationQuote: "el campus militar",
                storyQuote: "A pesar de ser del gobierno nunca hubo mucha seguridad. Claramente fue un error. Mi padre trabajaba en el laboratorio asociado de los militares cuando ocurrió la explosión. Aún recuerdo el barullo que se formó para salir de aquí después del a explosión.",
                main: true,
                elements: function (game) {
                    return {
                        sporeInfestation_closed: false,
                    }
                },
                npcs: function (game) {
                    let n = {}

                    if (game.npcs["chad"] == 2 && game.choices.chadAlive === true) {
                        n.chad = false;
                    }

                    if (game.npcs["sandra"] == 6) {
                        n.sandra = false;
                    }

                    return n;
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "militaryLaboratoryOutskirts",
                        canGo: function (game) {
                            if ("sporeInfestation_closed" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            }

                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["Hay un cúmulo de esporas enorme que no me permite cruzar. Debo encontrar la manera de eliminarlo."],
                    }),
                    S: new Path({
                        goesTo: "highway_1",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "militaryBaseOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            militaryBaseOutskirts: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "las afueras de la base militar",
                storyQuote: "No hay mucho que decir de este lugar.",
                main: false,
                elements: function (game) {
                    return {
                        brokenFence: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    E: new Path({
                        goesTo: "militaryBaseMainBuilding",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { 
                            if (!("militaryBaseMainBuilding" in game.map.locations)) {
                                return "scene10_entersMilitaryBuilding";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "militaryCampusEntrance",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            militaryBaseMainBuilding: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la base militar",
                storyQuote: "Supongo que aquí residian los militares asignados a este sitio. No hay casi muebles y tampoco queda casi material militar. Probablemente se lo llevaron o lo usaron para combatir la epidemia.",
                main: false,
                elements: function (game) {
                    if(game.choices.killEnemy2){
                        return {
                            desk: false,
                        }
                    }

                    return {
                        desk: false,
                        door_blocked: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    E: new Path({
                        goesTo: "militaryBaseArmory",
                        canGo: function (game) {
                            if ("door_blocked" in game.map.locations[game.map.currentLocation].elements) {
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["Una puerta bloqueada impide el paso. No creo que pueda hacer nada al respecto."],
                    }),
                    O: new Path({
                        goesTo: "militaryBaseOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            militaryBaseArmory: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "la armnería militar",
                storyQuote: "Bueno, aquí guardaban claramente el arsenal. Aqunque no queda mucho que saquear la verdad.",
                main: false,
                elements: function (game) {
                    return {
                        safeBox_closed: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    O: new Path({
                        goesTo: "militaryBaseMainBuilding",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            militaryLaboratoryOutskirts: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "las afueras del laboratorio",
                storyQuote: "Está el aparcamiento donde mi padre dejaba siempre el coche antes de entrar a trabajar. Hay algo extraño en el aire. Como si pesara. No me gusta este sitio.",
                main: false,
                elements: function (game) {
                    return {
                        watchTower: false,
                        sporeCluster: false,
                    }
                },
                npcs: function (game) {
                    let n = {}

                    if (game.npcs["sandra"] == 7) {
                        n.sandra = false;
                    }
                    if (game.npcs["chad"] == 3 && game.choices.chadAlive === true) {
                        n.chad = false;
                    }
                    if (game.npcs["dog"] == 2 && game.choices.dogSaved === true) {
                        n.dog = false;
                    }
                    if (game.npcs["sydney"] == 2 && game.choices.sydneyAlive === true) {
                        n.sydney = false;
                    }

                    return n;
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "militaryLaboratoryFacilities",
                        canGo: function (game) {
                            if (game.npcs["sandra"] < 8) {
                                return 0;
                            }
                            if (!("gasMask" in game.inventory.objects)) {
                                return 1;
                            }

                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: ["Tengo que hablar con Sandra y pedirle consejo antes de avanzar por aquí.", "En las instalaciones del laboratorio habrá demasiada concentración de esporas. No puedo ir allí sin algo que me proteja de ellas."],
                    }),
                    S: new Path({
                        goesTo: "militaryCampusEntrance",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                    E: new Path({
                        goesTo: "militaryLaboratoryWarehouse",
                        canGo: function (game) {
                            if (game.npcs["sandra"] < 7) {
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) { 
                            if (!("militaryLaboratoryWarehouse" in game.map.locations)) {
                                return "scene13_enterLaboratoryWarehouse";
                            }
                            return ""; 
                        },
                        problemMentionQuotes: ["Debería buscar a Sandra y hablar con ella antes de seguir avanzando."],
                    }),
                }
            }),
            militaryLaboratoryWarehouse: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el almacén del laboratorio",
                storyQuote: "Es donde se guardaba el material de laboratorio. Me pregunto poer que estaría en un edificio distinto. Solo hay armarios y utensilios de cristal por todas partes.",
                main: false,
                elements: function (game) {
                    return {
                        cabinet: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: { // Contains the paths connected with this location
                    O: new Path({
                        goesTo: "militaryLaboratoryOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            militaryLaboratoryFacilities: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "las instalaciones del laboratorio",
                storyQuote: "Aquí trabajaba mi padre. Esta todo destrozado a causa de la explosión. Ni siquiera se puede entrar sin una máscara de gas por culpa de las esporas. Ya no recuerdo ni lo que estaban investigando antes de la explosión, pero desde luego no era nada bueno.",
                main: false,
                elements: function (game) {
                    return {
                        artifactDestroyed: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        battery: false,
                    };
                },
                to: { // Contains the paths connected with this location
                    S: new Path({
                        goesTo: "militaryLaboratoryOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) { return ""; },
                        problemMentionQuotes: [],
                    }),
                }
            }),
        }
    }



    getLocationDiscoverData(location, game) {
        let paths = {};
        let key = "";

        for (key in (this.locations[location].to)) {

            paths[key] = {
                goesTo: this.locations[location].to[key].goesTo,
            }
        }

        return {
            elements: this.locations[location].elements(game),
            npcs: this.locations[location].npcs(game),
            objects: this.locations[location].objects(game),
            to: paths,
        };
    }

    isMainLocation(location) {
        return this.locations[location].main;
    }

}
