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

  voxaEvent.userDator = userDator;
});


// Try to catch Stop and Cancel Intents as the onIntent function does not work
voxaApp.onBeforeReplySent(async (voxaEvent, reply, transition) => {
  if(voxaEvent.intent.name === "StopIntent" || voxaEvent.intent.name === "CancelIntent"){
    console.log("Stop or Cancel Intent")
    // Save game in the alternative save slot
    voxaEvent.userDator.saveUserAlternativeGame(voxaEvent.user.id, voxaEvent.model.game, voxaEvent.session.attributes.state);

    // End session and return a proper response
    reply.response.shouldEndSession = true
    reply.response.outputSpeech = {
      ssml: '<speak>La próxima vez asegúrate de guardar la partida si lo deseas. ¡Hasta pronto!</speak>',
      type: 'SSML'
    }
  }

  return reply;
});

exports.voxaApp = voxaApp;
