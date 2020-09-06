const _ = require("lodash");
const Map = require("./models/map.js");
const ElementCollection = require("./models/elementCollection.js");
const ObjectCollection = require("./models/objectCollection.js");
const NpcCollection = require("./models/npcCollection.js");
const Camp = require("./models/camp.js");

const m = new Map();
const ec = new ElementCollection();
const oc = new ObjectCollection();
const nc = new NpcCollection();
const c = new Camp();

class Model {
  constructor(data = {}) {
    this.game = {
      // Stores the players discovered places and some infor about them.
      map: {
        obtained: false,
        currentLocation: null,
        mainLocations: [], //Name of the locations where the player can travel to
        locations: {},
      },
      inventory: {
        obtained: false,
        size: 3,
        objects: {}
      },
      resources: {
        junk: 0,
        food: 0,
        water: 0,
      },
      // Stores the players important choices in the game
      choices: {},
      npcs: {},
      merchants: {},
    };

    this.control = {
      confirmation: {
        nextState: null,
        previousState: null,
      },
      elementOrObjectToDescribe: "",
      elementOrObjectToDescribeAlreadyInspected: false,
      npcStateToDescribe: "",
      pathToDescribe: { location: "", path: "", problem: ""}
    };

    _.assign(this, data);
  }

  static deserialize(data) {
    return new this(data);
  }

  serialize() {
    return this;
  }

  getDefultGameModel() {
    return {
      // Stores the players discovered places and some infor about them.
      map: {
        obtained: false,
        currentLocation: null,
        mainLocations: [], //Name of the locations where the player can travel to
        locations: {},
      },
      inventory: {
        obtained: false,
        size: 3,
        objects: {}
      },
      resources: {
        junk: 0,
        food: 0,
        water: 0,
      },
      // Stores the players important choices in the game
      choices: {},
      npcs: {},
      merchants: {},
    }
  }

  // Functions
  // Gets element and its properties by name of the element
  getElementProperties(elementId) {
    return ec.elements[elementId];
  }
  getObjectProperties(objectId) {
    return oc.objects[objectId];
  }
  getPathProperties(location, symbol) {
    return m.locations[location].to[symbol];
  }
  getNpcProperties(npcId) {
    return nc.npcs[npcId];
  }
  getCampRelevantLevelProperties(level){
    return c.getRelevantLevel(level)
  }
  getCampLevelByQuantity(quantity){
    return c.getLevelByQuantity(quantity);
  }


  // Gets elements or object identifier corresponding to the name passed as argument.
  // The element or object must be in the currentLocation.
  // Returns null if no object or element with that name is found in the currentLocation.
  getCurrentLocationElementIdByName(elementName) {
    for (let e in this.game.map.locations[this.game.map.currentLocation].elements) {
      let ep = this.getElementProperties(e);
      if (ep.names.includes(elementName)) {
        return e;
      }
    }

    return null;
  }
  getObjectIdByName(objectName){
    for(let o of Object.keys(oc.objects)){
      let op = this.getObjectProperties(o);
      if (op.names.includes(objectName)){
        return o
      }
    }

    return null;
  }
  getCurrentLocationObjectIdByName(objectName) {
    for(let o in this.game.map.locations[this.game.map.currentLocation].objects){
      let op = this.getObjectProperties(o);
      if (op.names.includes(objectName)){
        return o
      }
    }

    return null;
  }
  getCurrentLocationNpcIdByName(npcName) {
    for(let n in this.game.map.locations[this.game.map.currentLocation].npcs){
      let np = this.getNpcProperties(n);
      if (np.names.includes(npcName)){
        return n
      }
    }

    return null;
  }
  getLocationIdByName(locationName) {
    for(let n in m.locations){
      let np = m.locations[n];
      if (np.names.includes(locationName)){
        return n
      }
    }

    return null;
  }

  // Gets object identifier corresponding to the name passed as argument.
  // The object must be in the player inventory.
  // Returns null if no object with that name is found in the inventory.
  getInventoryObjectIdByName(objectName) {
    for(let o in this.game.inventory.objects){
      let op = this.getObjectProperties(o);
      if (op.names.includes(objectName)){
        return o
      }
    }

    return null;
  }

  // Adds a newly discovered location to the model
  discoverLocation(location) {
    // Add the location data to the model
    this.game.map.locations[location] = m.getLocationDiscoverData(location, this.game)
    // If the location is main add it too
    if (m.isMainLocation(location)) {
      this.game.map.mainLocations.push(location);
    }
  }

}

module.exports = Model;
