const Location = require("./location");
const Path = require("./path");

module.exports = class Map {
    constructor() {
        // Initial state of the locations the first time the player enters them
        this.locations = {
            southForest1: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el bosque al sureste de la central hidroeléctrica",
                storyQuote: "Sandra dice que antes de la explosión a este sitio solía venir mucha gente a hacer picnics y deporte. Supongo que debe de haber perdido encanto desde entonces.",
                main: false,
                elements: function (game) {
                    return {
                        bag_1: false // False for and element means that the element has not being inspected by the player before
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        metalShears: false // false for objects that were not dropped by the player
                    };
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: [],
                    }),
                }
            }),
            hydroelectricPowerPlantOutskirts: new Location({
                names: [],
                locationQuote: "las afueras de la central hidroeléctrica.",
                storyQuote: "No hay mucho que decir sobre este sitio.",
                main: false,
                elements: function (game) {
                    return {
                        door_metalFence_1_closed: false,
                    }
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        lanternEmpty: false,
                    };
                },
                to: {
                    N: new Path({
                        goesTo: "road_Camp_hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: [],
                    }),
                    S: new Path({
                        goesTo: "southForest1",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "hydroelectricPowerPlant",
                        canGo: function (game) {
                            // If the door is closed still
                            if("door_metalFence_1_closed" in game.map.locations[game.map.currentLocation].elements){
                                // return problem 0
                                return 0;
                            }
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: ["Hay una verja metálica con un candado que me impide el paso. Tal vez pueda encontrar algo con lo que desacerme del candado."],
                    }),
                }
            }),
            hydroelectricPowerPlant: new Location({
                names: ["la central", "central", "central hidroeléctrica", "lacentral hidroeléctrica"],
                locationQuote: "la central hidroeléctrica",
                storyQuote: "No hay mucho que decir sobre este sitio.",
                main: true,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    return {};
                },
                objects: function (game) {
                    return {
                        battery_small: false,
                    };
                },
                to: {
                    E: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: [],
                    }),
                }
            }),
            road_Camp_hydroelectricPowerPlantOutskirts: new Location({
                names: [],
                locationQuote: "el camino que comunica el campamento con la central hidroeléctrica",
                storyQuote: "No hay mucho que decir sobre este sitio.",
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
                    return {};
                },
                to: {
                    S: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: [],
                    }),
                    N: new Path({
                        goesTo: "camp",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
                        problemMentionQuotes: [],
                    }),
                }
            }),
            camp: new Location({
                names: ["el campamento", "campamento"],
                locationQuote: "el campamento",
                storyQuote: ". Este es el asentamiento al que vinimos a vivir unos cuantos supervivientes y yo poco despues de la explosión. Ojalá todavía fueramos tantos como antes.",
                main: true,
                elements: function (game) {
                    return {}
                },
                npcs: function (game) {
                    if (game.npcs["sandra"] == 2 ){
                        return {
                            sandra: false, // npc with false (the player did not talk to him)
                        };
                    }

                    return {};
                },
                objects: function (game) {
                    return {};
                },
                to: {
                    S: new Path({
                        goesTo: "road_Camp_hydroelectricPowerPlantOutskirts",
                        canGo: function (game) {
                            return true;
                        },
                        go: function (game) {return "";},
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
