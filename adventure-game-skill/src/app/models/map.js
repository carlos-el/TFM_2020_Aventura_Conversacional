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
                    return {};
                },
                to: { // Contains the paths connected with this location
                    N: new Path({
                        goesTo: "hydroelectricPowerPlantOutskirts",
                        canGo: true,
                        problem: 0,
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
                    return {}
                },
                npcs: function (choices) {
                    return {};
                },
                objects: function (choices) {
                    return {};
                },
                to: {
                    S: new Path({
                        goesTo: "southForest1",
                        canGo: true,
                        problem: 0,
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
                canGo: this.locations[location].to[key].canGo,
                problem: this.locations[location].to[key].problem,
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
