const Location = require("./location");

module.exports = class Map {
    constructor() {
        this.locations = {
            southForest1: new Location({
                names: [],
                locationQuote: "el bosque al sureste de la central hidroelectrica.",
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
            }),
        }
    }

    getLocationDiscoverData(location, choices) {
        return {
            elements: this.locations[location].elements(choices),
            npcs: this.locations[location].npcs(choices),
            objects: this.locations[location].objects(choices),
        };
    }

    isMainLocation(location) {
        return this.locations[location].main;
    }

}
