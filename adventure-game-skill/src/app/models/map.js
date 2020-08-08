const Location = require("./location");
const Path = require("./path");

module.exports = class Map {
    constructor() {
        // Initial state of the locations the first time the player enters them
        this.locations = {
            southForest1: new Location({
                names: [], // (only needed if main == true)
                locationQuote: "el bosque al sureste de la central hidroeléctrica.",
                storyQuote: "Sandra dice que antes de la explosión a este sitio solía venir mucha gente a hacer picnics y deporte. Supongo que debe de haber perdido encanto desde entonces.",
                main: false,
                elements: function (choices) {
                    return {
                        bag_1: false // False for and element means that the element has not being inspected by the player before
                    }
                },
                npcs: function (choices) {
                    return {};
                },
                objects: function (choices) {
                    return {
                        metalShears: false // false for objects that were not dropped by the player
                    };
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (model) {
                            return true;
                        },
                        problemMentionQuotes: [],
                    }),
                }
            }),
            hydroelectricPowerPlantOutskirts: new Location({
                names: [],
                locationQuote: "las afueras de la central hidroeléctrica.",
                storyQuote: "No hay mucho que decir sobre este sitio.",
                main: false,
                elements: function (choices) {
                    return {
                        door_metalFence_1_closed: false,
                    }
                },
                npcs: function (choices) {
                    return {};
                },
                objects: function (choices) {
                    return {
                        lanternEmpty: false,
                    };
                },
                to: {
                    S: new Path({
                        goesTo: "southForest1",
                        canGo: function (model) {
                            return true;
                        },
                        problemMentionQuotes: [],
                    }),
                    O: new Path({
                        goesTo: "hydroelectricPowerPlant",
                        canGo: function (model) {
                            // If the door is close still
                            if("door_metalFence_1_closed" in model.game.map.locations[model.game.map.currentLocation].elements){
                                // return problem 0
                                return 0;
                            }
                            return true;
                        },
                        problemMentionQuotes: ["Hay una verja metálica con un candado que me impide el paso. Tal vez pueda encontrar algo con lo que desacerme del candado."],
                    }),
                }
            }),
            hydroelectricPowerPlant: new Location({
                names: ["la central", "central", "central hidroeléctrica", "lacentral hidroeléctrica"],
                locationQuote: "la central hidroeléctrica.",
                storyQuote: "No hay mucho que decir sobre este sitio.",
                main: true,
                elements: function (choices) {
                    return {}
                },
                npcs: function (choices) {
                    return {};
                },
                objects: function (choices) {
                    return {
                        battery_small: false,
                    };
                },
                to: {
                    E: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: function (model) {
                            return true;
                        },
                        problemMentionQuotes: [],
                    }),
                }
            }),
        }
    }

    getLocationDiscoverData(location, choices) {
        let paths = {};
        let key = "";

        for (key in (this.locations[location].to)) {

            paths[key] = {
                goesTo: this.locations[location].to[key].goesTo,
            }
        }

        return {
            elements: this.locations[location].elements(choices),
            npcs: this.locations[location].npcs(choices),
            objects: this.locations[location].objects(choices),
            to: paths,
        };
    }

    isMainLocation(location) {
        return this.locations[location].main;
    }

}
