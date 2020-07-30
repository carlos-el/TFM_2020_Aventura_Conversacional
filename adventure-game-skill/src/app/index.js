const {
  AlexaPlatform,
  plugins,
  VoxaApp
} = require("voxa");
const config = require("../config");
const Model = require("./model");
const UserDator = require("../services/userDator");
const MongoClient = require('mongodb').MongoClient;
const states = require("./states");
const variables = require("./variables");
const views = require("./views.json");

const voxaApp = new VoxaApp({ Model, views, variables });
states(voxaApp);

exports.alexaSkill = new AlexaPlatform(voxaApp);

plugins.replaceIntent(voxaApp);

/**
 * Load User Dator into the model when the user starts the skill
 */

voxaApp.onRequestStarted(async (voxaEvent) => {
  const userDator = await UserDator.getDator();
  const game = await userDator.getUserGame(voxaEvent.user.id)

  // If the player had a saved game then we load it
  if (game) {
    voxaEvent.model.game = game;
  }

  voxaEvent.user.userDator = userDator;
});

exports.voxaApp = voxaApp;
