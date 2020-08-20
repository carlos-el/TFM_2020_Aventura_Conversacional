function register(voxaApp) {
  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "LaunchMainMenu",
      to: "tellMainMenu",
    };
  });

  ////// CLOSE STATE ///////
  voxaApp.onState("close", voxaEvent => {
    return {
      flow: "terminate",
      reply: "GoodBye",
    };
  });

  ////// MENU OPTIONS ///////
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
        flow: "continue",
        reply: "empty",
        to: "loadGame"
      };
    } else if (voxaEvent.intent.name === "StartNewGameIntent") {
      voxaEvent.model.control.confirmation.nextState = "startNewGame";
      voxaEvent.model.control.confirmation.previousState = "tellMainMenu"
      return {
        flow: "yield",
        reply: "startGameView",
        to: "confirmationState"
      };
    } else if (voxaEvent.intent.name === "PlayTutorialIntent") {
      return {
        flow: "terminate",
        reply: "startTutorialView",
      };
    }

    // Fallback: if the intents are not matched tell and go to main menu
    return {
      flow: "continue",
      reply: "NotUnderstoodFallbackView",
      to: "tellMainMenu",
    };
  });

  voxaApp.onState("loadGame", async voxaEvent => {
    const game = await voxaEvent.userDator.getUserGame(voxaEvent.user.id)
    // If the player had a saved game then we load it and go to freeRoam 
    if (game) {
      voxaEvent.model.game = game;

      // Go to describe location to let the player know where he is
      return {
        flow: "continue",
        reply: "gameLoadSuccessView",
        to: "describeLocationState"
      };
    }

    // If no saved game is found tell it an go to tellMainMenu
    return {
      flow: "continue",
      reply: "gameLoadErrorView",
      to: "tellMainMenu"
    };
  });

  voxaApp.onState("startNewGame", async voxaEvent => {
    voxaEvent.userDator.saveUserGame(voxaEvent.user.id, voxaEvent.model.getDefultGameModel())
    return {
      flow: "continue",
      reply: "startNewGameView",
      to: "scene1_intro"
    };
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
    }

    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "empty",
      to: voxaEvent.model.control.confirmation.previousState,
    };
  });

  ////// SAVE GAME AND CLOSE STATE ///////
  voxaApp.onState("saveGameAndClose", voxaEvent => {
    voxaEvent.userDator.saveUserGame(voxaEvent.user.id, voxaEvent.model.game);
    console.log("Saving game")
    return {
      flow: "continue",
      reply: "gameSavedView",
      to: "close",
    };
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
        elementOrObject = voxaEvent.model.getCurrentLocationElementIdByName(elementOrObjectName);
        if (elementOrObject) {
          elementOrObjectProperties = voxaEvent.model.getElementProperties(elementOrObject)
        }

        //If nothing found, inspect the objects in the location
        if (!elementOrObject) {
          elementOrObject = voxaEvent.model.getCurrentLocationObjectIdByName(elementOrObjectName);
          if (elementOrObject) {
            elementOrObjectProperties = voxaEvent.model.getObjectProperties(elementOrObject)
            isObject = true;
          }
        }

        //If nothing found, inspect the objects in the player inventory
        if (!elementOrObject) {
          elementOrObject = voxaEvent.model.getInventoryObjectIdByName(elementOrObjectName);
          if (elementOrObject) {
            elementOrObjectProperties = voxaEvent.model.getObjectProperties(elementOrObject)
            isObject = true;
          }
        }

        // If the elementOrObject was found then proceed to describe.
        if (elementOrObject) {
          let alreadyInspected = false;
          if (!isObject) {
            // If it is element, check that has not been already inspected and execute action and set the inspected value to true if that is the case
            alreadyInspected = voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements[elementOrObject];
            let nextScene = elementOrObjectProperties.inspectActionTaken(voxaEvent.model.game, alreadyInspected);
            if (!alreadyInspected) {
              voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].elements[elementOrObject] = true;
            }
            // If nextScene is a valid string then do describe and go to that scene
            if (nextScene) {
              return {
                flow: "continue",
                reply: "DescribeInspectElementOrObjectView",
                to: nextScene,
              };
            }

            // Set the element or object to describe and the alreadyInspected variable (nedded in variable.js for choosing quote)
            voxaEvent.model.control.elementOrObjectToDescribe = elementOrObject;
            voxaEvent.model.control.elementOrObjectToDescribeAlreadyInspected = alreadyInspected;

            return {
              flow: "yield",
              reply: "DescribeInspectElementOrObjectView",
              to: "freeRoamState",
            };
          } else {
            // If it is OBJECT just set object to describe and return cause object have no actions when they are inspected and dont need alreadyInspected state.
            // Set the element or object to describe and the alreadyInspected variable (nedded in variable.js for choosing quote)
            voxaEvent.model.control.elementOrObjectToDescribe = elementOrObject;

            return {
              flow: "yield",
              reply: "DescribeInspectElementOrObjectView",
              to: "freeRoamState",
            };
          }

        } else {
          // Fallback: if the element or object can not be found in the location or inventory
          return {
            flow: "yield",
            reply: "DescribeFallbackNotFoundView",
            to: "freeRoamState",
          };
        }

      } else {
        // Fallback: if the intent does not carry element or object
        return {
          flow: "yield",
          reply: "DescribeFallbackNotFoundView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionPickUp") {
      let object = "";
      const objectName = voxaEvent.intent.params.object;
      const currentLocation = voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation];

      // If the inventory is available
      if (voxaEvent.model.game.inventory.obtained) {
        // If there is size in the inventory
        if (voxaEvent.model.game.inventory.size > Object.keys(voxaEvent.model.game.inventory.objects).length) {
          // If the object requested is in the current location, 
          if (object = voxaEvent.model.getCurrentLocationObjectIdByName(objectName)) {
            // add it to the inventory
            voxaEvent.model.game.inventory.objects[object] = 1; // Add it equal to 1 to be able to add it as an object
            // remove it from the location
            delete voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects[object];
            // and return description od pick up action
            voxaEvent.model.control.elementOrObjectToDescribe = object;
            return {
              flow: "yield",
              reply: "DescribePickUpObjectView",
              to: "freeRoamState",
            };
          } else {
            // Fallback: if the object is not in the current location
            return {
              flow: "yield",
              reply: "DescribeFallbackNotFoundView",
              to: "freeRoamState",
            };
          }
        } else {
          // Fallback: if the inventory is full
          return {
            flow: "yield",
            reply: "DescribePickUpObjectFailFullInventoryView",
            to: "freeRoamState",
          };
        }
      } else {
        // Fallback: if the inventory is not available
        return {
          flow: "yield",
          reply: "DescribePickUpObjectFailNoInventoryView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionDrop") {
      const objectName = voxaEvent.intent.params.object;
      let object = "";

      // If the inventory is available
      if (voxaEvent.model.game.inventory.obtained) {
        // If the object is in the inventory
        if (object = voxaEvent.model.getInventoryObjectIdByName(objectName)) {
          // delete it from the inventory if it is the last
          delete voxaEvent.model.game.inventory.objects[object]

          // add it to the location objects with a value of true (because it was dropped) 
          voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].objects[object] = true

          // return the description of the dropping action
          voxaEvent.model.control.elementOrObjectToDescribe = object;
          return {
            flow: "yield",
            reply: "DescribeDropObjectView",
            to: "freeRoamState",
          };
        } else {
          // Fallback: if the object is not in the inventory
          return {
            flow: "yield",
            reply: "DescribeFallbackNotFoundInInventoryView",
            to: "freeRoamState",
          };
        }
      } else {
        // Fallback: if the inventory is not available
        return {
          flow: "yield",
          reply: "DescribeDropObjectFailNoInventoryView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionUseObject") {
      const objectName = voxaEvent.intent.params.object;
      const elementName = voxaEvent.intent.params.element;

      // If params arre correctly set
      if (objectName && elementName) {
        // If the object is in the inventory
        let object = "";
        let element = "";
        if ((object = voxaEvent.model.getInventoryObjectIdByName(objectName))) {
          // If the element is not in the location
          if ((element = voxaEvent.model.getCurrentLocationElementIdByName(elementName))) {
            // get the element properties
            const elementProperties = voxaEvent.model.getElementProperties(element)
            // if the object can be used in the element
            let canBeUsedOrNextScene = elementProperties.useObjectActionTaken(voxaEvent.model.game, object);
            if (canBeUsedOrNextScene) {
              // If the return is the name of a scene go to that scene.
              if (typeof canBeUsedOrNextScene === "string") {
                return {
                  flow: "continue",
                  reply: "empty",
                  to: canBeUsedOrNextScene,
                };
              } else {
                // return describe use action
                voxaEvent.model.control.elementOrObjectToDescribe = element;
                return {
                  flow: "yield",
                  reply: "DescribeUseObjectView",
                  to: "freeRoamState",
                };
              }
            } else {
              // return describe cant use that object on the element
              voxaEvent.model.control.elementOrObjectToDescribe = element;
              return {
                flow: "yield",
                reply: "DescribeUseObjectCantUseView",
                to: "freeRoamState",
              };
            }
          } else {
            // Fallback: if the element is not in the location
            return {
              flow: "yield",
              reply: "DescribeUseObjectFailNotFoundView",
              to: "freeRoamState",
            };
          }
        } else {
          // Fallback: if the object is not in the inventory 
          return {
            flow: "yield",
            reply: "DescribeUseObjectFailNotFoundInInventoryView",
            to: "freeRoamState",
          };
        }
      } else {
        // Fallback: if the params are not correctly
        return {
          flow: "yield",
          reply: "FreeRoamFallbackView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionCombineObject") {
      const objectOneName = voxaEvent.intent.params.object_one;
      const objectTwoName = voxaEvent.intent.params.object_two;
      let objectOne = "";
      let objectTwo = "";
      let objectResult = "";

      // If both object names have been caught
      if (objectOneName && objectTwoName) {
        // If both objects are in the player inventory
        if ((objectOne = voxaEvent.model.getInventoryObjectIdByName(objectOneName)) && (objectTwo = voxaEvent.model.getInventoryObjectIdByName(objectTwoName))) {
          // Get object 1 combination result
          let objectOnePoperties = voxaEvent.model.getObjectProperties(objectOne)
          objectResult = objectOnePoperties.combineActionTaken(voxaEvent.model.game, objectTwo)

          // If object 1 did not give a combination result try with object 2
          if (!objectResult) {
            let objectTwoPoperties = voxaEvent.model.getObjectProperties(objectTwo)
            objectResult = objectTwoPoperties.combineActionTaken(voxaEvent.model.game, objectOne)
          }

          // If one of them gave combination result then remove the other elements, add the new one and return
          if (objectResult) {
            delete voxaEvent.model.game.inventory.objects[objectOne]
            delete voxaEvent.model.game.inventory.objects[objectTwo]
            voxaEvent.model.game.inventory.objects[objectResult] = 1;

            voxaEvent.model.control.elementOrObjectToDescribe = objectResult;
            return {
              flow: "yield",
              reply: "DescribeCombineObjectView",
              to: "freeRoamState",
            };
          } else { // If none of them gave combination result then return unavailable combination
            return {
              flow: "yield",
              reply: "DescribeCombineObjectFailView",
              to: "freeRoamState",
            };
          }
        } else {
          // Fallback: if one or more objects are not in the player inventory
          return {
            flow: "yield",
            reply: "DescribeCombineObjectFailNoObjectFoundView",
            to: "freeRoamState",
          };
        }
      } else {
        // Fallback: if the params are not correctly set
        return {
          flow: "yield",
          reply: "FreeRoamFallbackView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionTalkTo") {
      const npcName = voxaEvent.intent.params.npc;
      let npc = "";

      // If the npc is in the location
      if (npc = voxaEvent.model.getCurrentLocationNpcIdByName(npcName)) {
        const alreadyTalked = voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].npcs[npc];
        const npcProperties = voxaEvent.model.getNpcProperties(npc);
        let npcState = voxaEvent.model.game.npcs[npc];
        const nextScene = npcProperties.states[npcState].talkActionTaken(voxaEvent.model.game, alreadyTalked);
        // If the action lead to a scene then go to it
        if (nextScene) {
          return {
            flow: "continue",
            reply: "empty",
            to: nextScene,
          };
        }
        // In other case describe the conversation with the npc.
        voxaEvent.model.control.elementOrObjectToDescribe = npc;
        voxaEvent.model.control.npcStateToDescribe = npcState;
        return {
          flow: "yield",
          reply: "DescribeTalkToView",
          to: "freeRoamState",
        };
      } else {
        // Fallback: if the npc is not in the location then say it
        return {
          flow: "yield",
          reply: "DescribeTalkToFailPersonNotFoundView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionBuy") {
      const objectName = voxaEvent.intent.params.object;
      const resourceName = voxaEvent.intent.params.resource;
      const resourceNameToId = { agua: "water", alimento: "food", comida: "food", chatarra: "junk" }
      let objectOrResourceName = "";
      let objectOrResource = "";
      let isObject = true;

      // Get the object or resource to buy
      if (objectName) {
        objectOrResourceName = objectName;
      } else if (resourceName) {
        objectOrResourceName = resourceName;
      }

      // If the param is set
      if (objectOrResourceName) {
        // if it is resource tranform it to resourceId and if it is object to objectId
        if (objectOrResourceName in resourceNameToId) {
          objectOrResource = resourceNameToId[objectOrResourceName]
          isObject = false;
        } else {
          objectOrResource = voxaEvent.model.getObjectIdByName(objectOrResourceName);
          isObject = true;
        }

        // if the object exists
        if (objectOrResource) {
          let myMerchantId = "";
          let objectOrResourcePrice = "";
          let goodsUnits = "";
          // Loop throught npcs in the location to check if merchants sell the object
          for (let npcId of Object.keys(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].npcs)) {
            let npcProperties = voxaEvent.model.getNpcProperties(npcId);
            // if the npc is merchant
            if (npcProperties.merchant) {
              // if the merchant sells in the current location
              if (npcProperties.merchant.locations.includes(voxaEvent.model.game.map.currentLocation)) {
                // If we have already talked to the merchant and set the merchant state in the model
                if (voxaEvent.model.game.merchants[npcId]) {
                  // if the merchant sells the object
                  if (objectOrResource in npcProperties.merchant.states[voxaEvent.model.game.merchants[npcId].state].goods) {
                    // if the object is available (the player has not bought the max number of items)
                    const bought = (voxaEvent.model.game.merchants[npcId].bought[objectOrResource]) ? voxaEvent.model.game.merchants[npcId].bought[objectOrResource] : 0;
                    if (bought < npcProperties.merchant.states[voxaEvent.model.game.merchants[npcId].state].goods[objectOrResource].maxBought) {
                      myMerchantId = npcId;
                      objectOrResourcePrice = npcProperties.merchant.states[voxaEvent.model.game.merchants[npcId].state].goods[objectOrResource].price;
                      // get good units only in case the object to buy is a resource
                      goodsUnits = npcProperties.merchant.states[voxaEvent.model.game.merchants[npcId].state].goods[objectOrResource].units;
                      break;
                    }
                  }
                }
              }
            }
          }

          // if a merchant sells the item
          if (myMerchantId) {
            // check that the player can pay
            let canPay = true;
            for (p of Object.keys(objectOrResourcePrice)) {
              // if it is resource
              if (["water", "food", "junk"].includes(p)) {
                // if the player does not have enough resources
                if (voxaEvent.model.game.resources[p] < objectOrResourcePrice[p]) {
                  canPay = false;
                  break;
                }
              } else {
                // if the player does not have the object
                if (!(p in voxaEvent.model.game.inventory.objects)) {
                  canPay = false;
                  break;
                }
              }
            }

            // if the player can pay 
            if (canPay) {
              // retrieve the price from the player
              for (p of Object.keys(objectOrResourcePrice)) {
                // if it is resource
                if (["water", "food", "junk"].includes(p)) {
                  voxaEvent.model.game.resources[p] -= objectOrResourcePrice[p]
                } else {
                  delete voxaEvent.model.game.inventory.objects[p]
                }
              }

              // add the object or resource
              if (isObject) {
                voxaEvent.model.game.inventory[objectOrResource] = 1;
              } else {
                voxaEvent.model.game.resources[objectOrResource] += goodsUnits;
              }

              // add to the bought variable for this merchant in the model
              if (voxaEvent.model.game.merchants[myMerchantId].bought[objectOrResource]) {
                voxaEvent.model.game.merchants[myMerchantId].bought[objectOrResource] += 1;
              } else {
                voxaEvent.model.game.merchants[myMerchantId].bought[objectOrResource] = 1;
              }

              // return to describe buy
              voxaEvent.model.control.elementOrObjectToDescribe = objectOrResourceName;
              return {
                flow: "yield",
                reply: "DrescribeBuyObjectView",
                to: "freeRoamState",
              };
            } else {
              // Fallback: the player cant pay
              return {
                flow: "yield",
                reply: "DrescribeBuyObjectFailCantPayView",
                to: "freeRoamState",
              };
            }
          }

        }

        // Fallback: if the object is not sell by any merchant or the object does not exist
        return {
          flow: "yield",
          reply: "DrescribeBuyObjectFailNoObjectView",
          to: "freeRoamState",
        };
      } else {
        // Fallback: if the params are not correctly set
        return {
          flow: "yield",
          reply: "FreeRoamFallbackView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionGoTo") {
      // Get the symbol of the cardinal point the player wants to go
      const cardinalToSymbol = { norte: "N", sur: "S", este: "E", oeste: "O" }
      const cardinal = voxaEvent.intent.params.cardinal;
      const symbol = cardinalToSymbol[cardinal];
      const path = voxaEvent.model.getPathProperties(voxaEvent.model.game.map.currentLocation, symbol)
      const locationName = voxaEvent.intent.params.location;

      if (cardinal) {
        // If there is a path in that direction
        if (path) {
          // Get the problem number (or true if there is no problem)
          const problemNumber = path.canGo(voxaEvent.model.game)
          if (problemNumber === true) { // If problem number is true then there is no problem and the player can go to the new location
            // Execute the "go" function with the consecuences of going to the new location.
            let nextScene = path.go(voxaEvent.model.game)
            // If nextScene is not empty then the player should go to the scene proposed, else the player should go to the goesTo location
            if (nextScene) {
              return {
                flow: "continue",
                reply: "empty",
                to: nextScene,
              };
            } else {
              // We first select the path to describe
              voxaEvent.model.control.pathToDescribe = { location: voxaEvent.model.game.map.currentLocation, path: symbol, problem: problemNumber }

              // Go to the new location
              voxaEvent.model.game.map.currentLocation = path.goesTo;

              // Describe the path and then the new location in the next state
              return {
                flow: "continue",
                reply: "DescribePathView",
                to: "describeLocationState"
              };
            }
          } else {
            // Prompt the problem that is not letting the player go to this location and dont change location
            voxaEvent.model.control.pathToDescribe = { location: voxaEvent.model.game.map.currentLocation, path: symbol, problem: problemNumber }
            return {
              flow: "yield",
              reply: "DescribePathProblemView",
              to: "freeRoamState"
            };
          }
        }

        // Fallback: if there is not path in the direction specified
        return {
          flow: "yield",
          reply: "DescribePathFailNoPathView",
          to: "freeRoamState",
        };
      }

      // If the location param is set
      if (locationName) {
        const locationId = voxaEvent.model.getLocationIdByName(locationName)

        // if the location is in main location (we have already traveled an it is a main location)
        if (voxaEvent.model.game.map.mainLocations.includes(locationId)) {
          // if we are not already in the location
          if (locationId !== voxaEvent.model.game.map.currentLocation) {
            voxaEvent.model.control.elementOrObjectToDescribe = locationId;
            voxaEvent.model.game.map.currentLocation = locationId;
            // Say the location we are going to and go to describe location
            return {
              flow: "continue",
              reply: "DescribeToDirectLocationView",
              to: "describeLocationState"
            };
          }

          // Fallback: the location to travel is the location the player is already in
          return {
            flow: "yield",
            reply: "DescribeToDirectLocationFailAlreadyThereView",
            to: "freeRoamState",
          };
        }

        // Fallback: the location is not a location or is not in mainLocation
        return {
          flow: "yield",
          reply: "DescribeToDirectLocationFailNotFoundView",
          to: "freeRoamState",
        };
      }
    } else if (voxaEvent.intent.name === "ActionCheckResources") {
      return {
        flow: "yield",
        reply: "DescribeCheckResourcesView",
        to: "freeRoamState",
      };
    } else if (voxaEvent.intent.name === "ActionCheckLocation") {
      return {
        flow: "continue",
        reply: "empty",
        to: "describeLocationState",
      };
    } else if (voxaEvent.intent.name === "ActionCheckInventory") {
      // if the player has a bag
      if (voxaEvent.model.game.inventory.obtained) {
        return {
          flow: "yield",
          reply: "DescribeCheckInventoryView",
          to: "freeRoamState",
        };
      }

      // Fallback: if the player does not have a bag
      return {
        flow: "yield",
        reply: "DescribeCheckInventoryFailNoBagView",
        to: "freeRoamState",
      };

    } else if (voxaEvent.intent.name === "ActionCheckMap") {
      // if the player has obtained a map
      if (voxaEvent.model.game.map.obtained) {
        return {
          flow: "yield",
          reply: "DescribeCheckMapView",
          to: "freeRoamState",
        };
      }

      // Fallback: else return that you dont have a map
      return {
        flow: "yield",
        reply: "DescribeCheckMapFailNoMapView",
        to: "freeRoamState",
      };

    } else if (voxaEvent.intent.name === "ActionCheckWhatToDo") {
      // Missions help here

    } else if (voxaEvent.intent.name === "ActionCheckWhoIsHere") {
      // if there are npcs return their description
      if (Object.keys(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].npcs).length) {
        return {
          flow: "yield",
          reply: "DescribeCheckWhoIsHereView",
          to: "freeRoamState",
        };
      }

      // Fallback: else return that there are not any
      return {
        flow: "yield",
        reply: "DescribeCheckWhoIsHereFailNoOneView",
        to: "freeRoamState",
      };

    } else if (voxaEvent.intent.name === "ActionCheckWhereCanIGo") {
      // if there are paths return their description
      if (Object.keys(voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].to).length) {
        return {
          flow: "yield",
          reply: "DescribeCheckWhereCanIGoView",
          to: "freeRoamState",
        };
      }

      // Fallback: else return that there are not any
      return {
        flow: "yield",
        reply: "DescribeCheckWhereCanIGoFailNoWhereView",
        to: "freeRoamState",
      };

    } else if (voxaEvent.intent.name === "HelpIntent" || voxaEvent.intent.name === "ActionCheckWhatCanIDo") {
      return {
        flow: "yield",
        reply: "DescribeHelp",
        to: "freeRoamState",
      };
    } else if (voxaEvent.intent.name === "ActionSaveGame") {
      voxaEvent.userDator.saveUserGame(voxaEvent.user.id, voxaEvent.model.game);
      console.log("Saving game")
      return {
        flow: "yield",
        reply: "saveGameView",
        to: "freeRoamState",
      };
    } else if (voxaEvent.intent.name === "CloseGame") {
      voxaEvent.model.control.confirmation.nextState = "saveGameAndClose"; // if confirmation is positive
      voxaEvent.model.control.confirmation.previousState = "close" // if confirmation is negative
      return {
        flow: "yield",
        reply: "DescribeCloseGame",
        to: "confirmationState",
      };
    }

    // Fallback: if the intents are not matched or the params are wrong
    return {
      flow: "yield",
      reply: "FreeRoamFallbackView",
      to: "freeRoamState",
    };
  });

  ////// Describe Location State ///////
  voxaApp.onState("describeLocationState", voxaEvent => {
    let reply = "DescribeLocationView"

    // Current location must be set in the last scene or state. 
    // If current location is a new location we add it to the locations and describe it with the story
    if (!(voxaEvent.model.game.map.currentLocation in voxaEvent.model.game.map.locations)) {
      voxaEvent.model.discoverLocation(voxaEvent.model.game.map.currentLocation);
      reply = "DescribeLocationWithStoryView"
    }

    return {
      flow: "yield",
      reply: reply,
      to: "freeRoamState",
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
      voxaEvent.model.game.choices.name = voxaEvent.intent.params.playerName;
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

    // Fallback: if the intents are not matched tell and repeat question
    return {
      flow: "continue",
      reply: "scene1_nameNotUnderstoodView",
      to: "scene1_askPlayerName",
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
        voxaEvent.model.game.choices.sex = "female";
      } else if (voxaEvent.intent.params.color === "azul" || voxaEvent.intent.params.position === "izquierda" || voxaEvent.intent.params.position === "de la izquierda") {
        voxaEvent.model.game.choices.sex = "male";
      }

      // set next state after confirmation and the state to return if confirmation is negative
      voxaEvent.model.control.confirmation.nextState = "scene1_describePlayground";
      voxaEvent.model.control.confirmation.previousState = "scene1_askPlayerSex"
      return {
        flow: "yield",
        reply: "scene1_getPlayerSexConfirm_NarrativeView",
        to: "confirmationState"
      };
    }

    // Fallback: if the intents are not matched tell and repeat question
    return {
      flow: "continue",
      reply: "scene1_doorNotUnderstoodView",
      to: "scene1_askPlayerSex",
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
        // Ff play with Sandra (right) go to one different scene branch
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
          to: "scene1_1_explosionAlone"
        };
      }
    }

    // Fallback: if the intents are not matched tell and repeat question
    return {
      flow: "continue",
      reply: "scene1_playgroundSideNotUnderstoodView",
      to: "scene1_askPlaygroundSide",
    };
  });

  voxaApp.onState("scene1_1_explosionAlone", voxaEvent => {
    voxaEvent.model.game.choices.explosionWith = "alone";

    return {
      flow: "continue",
      reply: "scene1_1_explosionAlone_NarrativeView",
      to: "scene1_1_wakeUpAlone"
    };
  });
  voxaApp.onState("scene1_1_wakeUpAlone", voxaEvent => {
    // As the next state is the freeRoam state we set in control 
    // variable so the next state can manage it.
    // Set the current location as well.
    voxaEvent.model.game.map.currentLocation = "southForest1";

    return {
      flow: "continue",
      reply: "scene1_1_wakeUpAlone_NarrativeView",
      to: "describeLocationState"
    };
  });

  voxaApp.onState("scene1_2_explosionWithSandra", voxaEvent => {
    voxaEvent.model.game.choices.explosionWith = "sandra";

    return {
      flow: "continue",
      reply: "scene1_2_explosionWithSandra_NarrativeView",
      to: "scene1_2_wakeUpWithSandra"
    };
  });
  voxaApp.onState("scene1_2_wakeUpWithSandra", voxaEvent => {
    voxaEvent.model.game.resources.water += 5;
    // Set next state to describeLocationState which leads to freeRoamState 
    // Set the current location as well.
    voxaEvent.model.game.map.currentLocation = "southForest1";
    return {
      flow: "continue",
      reply: "scene1_2_wakeUpWithSandra_NarrativeView",
      to: "describeLocationState"
    };
  });

}

module.exports = register;
