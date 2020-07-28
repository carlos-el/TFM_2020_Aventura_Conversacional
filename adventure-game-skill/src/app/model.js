const _ = require("lodash");
const Map = require("./content/map.js");
const ElementCollection = require("./content/elementCollection.js");

const m = new Map();
const ec = new ElementCollection();

class Model {
  constructor(data = {}) {
    // Stores the players important choices in the game
    this.choices = {};
    // Stores the players discovered places and some infor about them.
    this.map = {
      obtained: false,
      currentLocation: null,
      mainLocations: [], //Name of the locations where the player can travel to
      locations: {},
    };
    this.resources = {
      junk: 0,
      food: 0,
      water: 0,
    };
    this.control = {
      confirmation: {
        nextState: null,
        previousState: null,
      },
      toFreeFromScene: false,
      elementOrObjectToDescribe: "",
      elementOrObjectToDescribeAlreadyInspected: false,
    };

    _.assign(this, data);
  }

  static deserialize(data) {
    return new this(data);
  }

  serialize() {
    return this;
  }

  // Functions
  // Gets element and its properties by name of the element
  getElementProperties(elementName){
    return ec.elements[elementName];
  }

  // Adds a newly discovered location to the model
  discoverLocation(location) {
    // Add the location data to the model
    this.map.locations[location] = m.getLocationDiscoverData(location, this.choices)
    // If the location is main add it too
    if(m.isMainLocation(location)){
      this.map.mainLocations.push(location);
    }
  }

}

module.exports = Model;
