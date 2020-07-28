function register(voxaApp) {
  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "LaunchMainMenu",
      to: "tellMainMenu",
    };
  });

  // Lists main menu options before starting the game
  voxaApp.onState("tellMainMenu", voxaEvent => {
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
    } else if (voxaEvent.intent.name === "StartNewGameIntent") {
      return {
        flow: "continue",
        reply: "startGameView",
        to: "scene1_intro"
      };
    } else if (voxaEvent.intent.name === "PlayTutorialIntent") {
      return {
        flow: "terminate",
        reply: "startTutorialView",
      };
    } else {
      return {
        flow: "terminate",
        reply: "notDesiredIntentView",
      };
    }
  });

  ////// CONFIRMATION STATE ///////
  voxaApp.onState("confirmationState", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      // go to next state
      return {
        flow: "continue",
        reply: "empty",
        to: voxaEvent.model.control.confirmation.nextState
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      // go to penultimateState to repeat the question
      return {
        flow: "continue",
        reply: "empty",
        to: voxaEvent.model.control.confirmation.previousState
      };
    } else {
      // go to penultimateState too
      return {
        flow: "continue",
        reply: "empty",
        to: voxaEvent.model.control.penultimateState
      };
    }
  });

  //////////////////////////////
  ////// FREE ROAM STATE ///////
  //////////////////////////////
  voxaApp.onState("freeRoamState", voxaEvent => {
    if (voxaEvent.intent.name === "ActionInspect") {
      // Get instents element or object if present (we may get element or object but it can be both)
      let elementOrObjectName = "";
      if (voxaEvent.intent.params.element || voxaEvent.intent.params.object) {
        if (voxaEvent.intent.params.element) {
          elementOrObjectName = voxaEvent.intent.params.element
        }
        else {
          elementOrObjectName = voxaEvent.intent.params.object
        }

        let elementOrObject = "";
        let elementOrObjectProperties = "";
        let isObject = false;
        // Inspect FIRST the elements in the location
        for (e in voxaEvent.model.map.locations[voxaEvent.model.map.currentLocation].elements) {
          let ep = voxaEvent.model.getElementProperties(e);
          if (ep.names.includes(elementOrObjectName)) {
            elementOrObject = e;
            elementOrObjectProperties = ep;
            type = "element";
            break;
          }
        }

        // If nothing found inspect the objects
        // if(!elementOrObject){
        //   for(o of voxaEvent.model.map.locations[voxaEvent.model.map.currentlocation].objects){
        //     op = voxaEvent.model.getObjectProperties(o);
        //     if (elementOrObjectName in op.names){
        //       elementOrObject = o;
        //       elementOrObjectProperties = op;
        //       isObject = true;
        //       break;
        //     }
        //   }
        // }

        // If the elementOrObject was found then proceed to describe.
        if (elementOrObject) {
          let alreadyInspected = false;
          if (!isObject) {
            // If it is element, check that has not been already inspected and execute action and set the inspected value to true if that is the case
            alreadyInspected = voxaEvent.model.map.locations[voxaEvent.model.map.currentLocation].elements[elementOrObject];
            if (!alreadyInspected) {
              elementOrObjectProperties.inspectActionTaken(voxaEvent.model);
              voxaEvent.model.map.locations[voxaEvent.model.map.currentLocation].elements[elementOrObject] = true;
            }
          } else {
            //If it is object do the appropiate things
          }

          // Set the element or object to describe and the alreadyInspected variable (nedded in variable.js for choosing quote)
          voxaEvent.model.control.elementOrObjectToDescribe = elementOrObject;
          voxaEvent.model.control.elementOrObjectToDescribeAlreadyInspected = alreadyInspected;

          return {
            flow: "yield",
            reply: "DescribeInspectElementOrObjectView",
            to: "freeRoamState",
          };
        }

      }

    } else if (voxaEvent.intent.name === "other intent") {

    } else if (voxaEvent.model.control.toFreeFromScene) { // Control when coming from an scene
      let reply = "DescribePlaceView"
      voxaEvent.model.control.toFreeFromScene = false;

      // Current location must be set in the last scene. 
      // If current location is a new place we add it to the locations and describe it with the story
      if (!(voxaEvent.model.map.currentLocation in voxaEvent.model.map.locations)) {
        voxaEvent.model.discoverLocation(voxaEvent.model.map.currentLocation);
        reply = "DescribePlaceWithStoryView"
      }

      return {
        flow: "yield",
        reply: reply,
        to: "freeRoamState",
      };
    }

    return {
      flow: "terminate",
      reply: "notDesiredIntentView",
    };
  });


  ////// SCENE 1 ///////
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
    if (voxaEvent.intent.name === "GetPlayerNameIntent") {
      // set player name 
      voxaEvent.model.choices.name = voxaEvent.intent.params.playerName;
      // set next state after confirmation and the state to return if confirmantion y negative
      voxaEvent.model.control.confirmation.nextState = "scene1_sendToBath";
      voxaEvent.model.control.confirmation.previousState = "scene1_askPlayerName"
      // send to the confirm state
      return {
        flow: "yield",
        reply: "scene1_getPlayerNameConfirm_NarrativeView",
        to: "confirmationState"
      };
    }

    return {
      flow: "terminate",
      reply: "notDesiredIntentView",
    };
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
        || voxaEvent.intent.params.position === "de la izquierda" || voxaEvent.intent.params.position === "de la derecha")) {

      // set player sex based on the door chosen
      if (voxaEvent.intent.params.color === "rosa" || voxaEvent.intent.params.position === "derecha" || voxaEvent.intent.params.position === "de la derecha") {
        voxaEvent.model.choices.sex = "female";
      } else if (voxaEvent.intent.params.color === "azul" || voxaEvent.intent.params.position === "izquierda" || voxaEvent.intent.params.position === "de la izquierda") {
        voxaEvent.model.choices.sex = "male";
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
      if (voxaEvent.intent.params.playgroundObject === "niños") {
        // if play with Sandra (right) go to one different scene branch
        return {
          flow: "continue",
          reply: "empty",
          to: "scene1_2_explosionWithSandra"
        };
        // if play alone (left) go to one different scene branch
      } else if (voxaEvent.intent.params.playgroundObject === "juguetes") {
        return {
          flow: "continue",
          reply: "empty",
          to: "tellMainMenu"
        };
      }
    }

    return {
      flow: "terminate",
      reply: "notDesiredIntentView",
    };
  });

  voxaApp.onState("scene1_2_explosionWithSandra", voxaEvent => {
    voxaEvent.model.choices.explosionWith = "sandra";

    return {
      flow: "continue",
      reply: "scene1_2_explosionWithSandra_NarrativeView",
      to: "scene1_2_wakeUpWithSandra"
    };
  });
  voxaApp.onState("scene1_2_wakeUpWithSandra", voxaEvent => {
    voxaEvent.model.resources.water += 5;
    // As the next state is the freeRoam state we set in control 
    // variable so the next state can manage it.
    // Set the current location as well.
    voxaEvent.model.control.toFreeFromScene = true;
    voxaEvent.model.map.currentLocation = "southForest1";
    return {
      flow: "continue",
      reply: "scene1_2_wakeUpWithSandra_NarrativeView",
      to: "freeRoamState"
    };
  });

}

module.exports = register;
