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

// Try to catch 
voxaApp.onSessionEnded(async (voxaEvent) => {
  console.log("Session ending");

  // Save game in the alternative save slot only if not intent is found (taht means the user didnt used any input an this is a error)
  if(!voxaEvent.intent) {
    console.log("Saving session ending");
    voxaEvent.userDator.saveUserAlternativeGame(voxaEvent.user.id, voxaEvent.model.game, voxaEvent.session.attributes.state);
  }
});

// Save alternative game on error
voxaApp.onError((voxaEvent, error) => {
  console.log("On Error");

  // Save game in the alternative save slot
  voxaEvent.userDator.saveUserAlternativeGame(voxaEvent.user.id, voxaEvent.model.game, voxaEvent.session.attributes.state);
});

exports.voxaApp = voxaApp;
