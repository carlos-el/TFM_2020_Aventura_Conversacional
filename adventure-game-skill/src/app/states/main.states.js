function register(voxaApp) {
  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "LaunchMainMenu",
      to: "tellMainMenu",
    };
  });

  voxaApp.onState("confirmationState", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent"){
      // go to next state
      return {
        flow: "continue",
        reply: "empty",
        to: voxaEvent.model.control.confirmation.nextState
      };
    }else if (voxaEvent.intent.name === "NoIntent"){
      // go to penultimateState to repeat the question
      return {
        flow: "continue",
        reply: "empty",
        to: voxaEvent.model.control.confirmation.previousState
      };
    }else { 
      // go to penultimateState too
      return {
        flow: "continue",
        reply: "empty",
        to: voxaEvent.model.control.penultimateState
      };
    }
  });

  // Lists main menu options before starting the game
  voxaApp.onState("tellMainMenu", () => {
    return {
      flow: "yield",
      reply: "tellMainMenuOptionView",
      to: "getMainMenuOption",
    };
  });

  // Gets the main menu option selected
  voxaApp.onState("getMainMenuOption", voxaEvent => {
    if (voxaEvent.intent.name === "ContinueGameIntent") {
      return {
        flow: "terminate",
        reply: "continueGameView",
      };
    }else if (voxaEvent.intent.name === "StartNewGameIntent") {
      return {
        flow: "continue",
        reply: "startGameView",
        to: "scene1_intro"
      };
    }else if (voxaEvent.intent.name === "PlayTutorialIntent") {
      return {
        flow: "terminate",
        reply: "startTutorialView",
      };
    }else { 
      return {
        flow: "terminate",
        reply: "notDesiredIntentView",
      };
    }
  });

  // Presents the intro of the scene
  voxaApp.onState("scene1_intro", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene1_intro_NarrativeView",
      to: "scene1_askPlayerName",
    };
  });

  // Ask the player for the name of the main character
  voxaApp.onState("scene1_askPlayerName", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene1_askPlayerName_NarrativeView",
      to: "scene1_getPlayerNameConfirm",
    };
  });

  // Gets the players name with confirmation
  voxaApp.onState("scene1_getPlayerNameConfirm", voxaEvent => {
    if (voxaEvent.intent.name === "GetPlayerNameIntent" ){
      // set player name 
      voxaEvent.model.player.playerName = voxaEvent.intent.params.playerName;
      // set next state after confirmation and the state to return if confirmantion y negative
      voxaEvent.model.control.confirmation.nextState = "scene1_sendToBath";
      voxaEvent.model.control.confirmation.previousState = "scene1_askPlayerName"
      // send to the confirm state
      return {
        flow: "yield",
        reply: "scene1_getPlayerNameConfirm_NarrativeView",
        to: "confirmationState"
      };
    }else { 
      return {
        flow: "terminate",
        reply: "notDesiredIntentView",
      };
    }
  });

  // askplayerSex scenes sequence 
  voxaApp.onState("scene1_sendToBath", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene1_sendToBath_NarrativeView",
      to: "scene1_askPlayerSex",
    };
  });
  voxaApp.onState("scene1_askPlayerSex", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene1_askPlayerSex_NarrativeView",
      to: "scene1_getPlayerSexConfirm",
    };
  });
  voxaApp.onState("scene1_getPlayerSexConfirm", voxaEvent => {
    if ((voxaEvent.intent.name === "GetPlayerSexIntent" || voxaEvent.intent.name === "GetColor" || voxaEvent.intent.name === "GetPosition")
          && (voxaEvent.intent.params.color === "rosa" || voxaEvent.intent.params.color === "azul" 
          || voxaEvent.intent.params.position === "izquierda" || voxaEvent.intent.params.position === "derecha" 
          || voxaEvent.intent.params.position === "de la izquierda" || voxaEvent.intent.params.position === "de la derecha")){

      // set player sex based on the door chosen
      if(voxaEvent.intent.params.color === "rosa" || voxaEvent.intent.params.position === "derecha" || voxaEvent.intent.params.position === "de la derecha"){
        voxaEvent.model.player.playerSex = "female";
      }else if (voxaEvent.intent.params.color === "azul" || voxaEvent.intent.params.position === "izquierda" || voxaEvent.intent.params.position === "de la izquierda"){
        voxaEvent.model.player.playerSex = "male";
      }

      // set next state after confirmation and the state to return if confirmantion y negative
      voxaEvent.model.control.confirmation.nextState = "scene1_describePlayground";
      voxaEvent.model.control.confirmation.previousState = "scene1_askPlayerSex"
      return {
        flow: "yield",
        reply: "scene1_getPlayerSexConfirm_NarrativeView",
        to: "confirmationState"
      };
    }

    return {
      flow: "terminate",
      reply: "notDesiredIntentView",
    };
  });

  // player choses playgroundSide scene sequence
  voxaApp.onState("scene1_describePlayground", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene1_describePlayground_NarrativeView",
      to: "scene1_askPlaygroundSide",
    };
  });
  voxaApp.onState("scene1_askPlaygroundSide", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene1_askPlaygroundSide_NarrativeView",
      to: "scene1_getPlaygroundSide",
    };
  });
  voxaApp.onState("scene1_getPlaygroundSide", voxaEvent => {
    if (voxaEvent.intent.name === "GetPlaygroundSide") {
      if (voxaEvent.intent.params.playgroundObject === "niños"){
        // if play with children (right) go to one different scene branch
        return {
          flow: "continue",
          reply: "tellMainMenu",
        };
        // if play alone (left) go to one different scene branch
      }else if (voxaEvent.intent.params.playgroundObject === "juguetes"){
        return {
          flow: "continue",
          reply: "tellMainMenu",
        };
      }
    }

    return {
      flow: "terminate",
      reply: "notDesiredIntentView",
    };
  });

}

module.exports = register;
