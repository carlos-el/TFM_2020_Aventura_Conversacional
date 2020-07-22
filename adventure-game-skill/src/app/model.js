const _ = require("lodash");

class Model {
  constructor(data = {}) {
    this.player = {playerName: null, 
      playerSex: null //male or female
    };
    this.control = {
      confirmation: {
        nextState: null,
        previousState: null,
      },
    }
    
    _.assign(this, data);
  }

  static deserialize(data) {
    return new this(data);
  }

  serialize() {
    return this;
  }

  // This function must be called in all states at the end 
  setLastState(state) {
    this.control.penultimateState = this.control.lastState;
    this.control.lastState = state;
  }
}

module.exports = Model;
