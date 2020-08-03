const _ = require("lodash");
const Map = require("./models/map.js");
const ElementCollection = require("./models/elementCollection.js");

const m = new Map();
const ec = new ElementCollection();

class Model {
  constructor(data = {}) {
    this.game = {
      // Stores the players important choices in the game
      choices: {}, 
      // Stores the players discovered places and some infor about them.
      map: {
        obtained: false,
        currentLocation: null,
        mainLocations: [], //Name of the locations where the player can travel to
        locations: {},
      },
      resources: {
        junk: 0,
        food: 0,
        water: 0,
      },
    };

    this.control = {
      confirmation: {
        nextState: null,
        previousState: null,
      },
      elementOrObjectToDescribe: "",
      elementOrObjectToDescribeAlreadyInspected: false,
      pathToDescribe: {location: "", path: ""}
    };

    _.assign(this, data);
  }

  static deserialize(data) {
    return new this(data);
  }

  serialize() {
    return this;
  }

  getDefultGameModel(){
    return {
      // Stores the players important choices in the game
      choices: {}, 
      // Stores the players discovered places and some infor about them.
      map: {
        obtained: false,
        currentLocation: null,
        mainLocations: [], //Name of the locations where the player can travel to
        locations: {},
      },
      resources: {
        junk: 0,
        food: 0,
        water: 0,
      },
    }
  }

  // Functions
  // Gets element and its properties by name of the element
  getElementProperties(elementName){
    return ec.elements[elementName];
  }

  // Adds a newly discovered location to the model
  discoverLocation(location) {
    // Add the location data to the model
    this.game.map.locations[location] = m.getLocationDiscoverData(location, this.game.choices)
    // If the location is main add it too
    if(m.isMainLocation(location)){
      this.game.map.mainLocations.push(location);
    }
  }

}

module.exports = Model;
