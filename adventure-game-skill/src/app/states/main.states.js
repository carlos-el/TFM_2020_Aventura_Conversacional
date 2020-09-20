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
        to: "askLoadAlternativeGame"
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
        flow: "continue",
        reply: "empty",
        to: "tuto1_tellAboutNotificationsGameWeb"
      };
    }

    // Fallback: if the intents are not matched tell and go to main menu
    return {
      flow: "continue",
      reply: "NotUnderstoodFallbackView",
      to: "tellMainMenu",
    };
  });

  voxaApp.onState("askLoadAlternativeGame", async voxaEvent => {
    const alternativeGame = await voxaEvent.userDator.getUserAlternativeGame(voxaEvent.user.id)

    // if there is and alternative game saved from an error or sudden exit ask if the user if he wants to load it
    if (alternativeGame != null && alternativeGame.game) {
      voxaEvent.model.control.confirmation.nextState = "loadAlternativeGame"; // if confirm is positive
      voxaEvent.model.control.confirmation.previousState = "loadGame"  // if confirm is negative
      return {
        flow: "yield",
        reply: "askLoadAlternativeGameView",
        to: "confirmationState"
      };
    }

    // if not go to load game directly
    return {
      flow: "continue",
      reply: "empty",
      to: "loadGame"
    };
  });

  voxaApp.onState("loadGame", async voxaEvent => {
    const game = await voxaEvent.userDator.getUserGame(voxaEvent.user.id)

    // If the player had a saved game then we load it and go to freeRoam 
    if (game) {
      // remove alternative game in case some didnt wanted to load it
      voxaEvent.userDator.removeUserAlternativeGame(voxaEvent.user.id)
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

  voxaApp.onState("loadAlternativeGame", async voxaEvent => {
    const alternativeGame = await voxaEvent.userDator.getUserAlternativeGame(voxaEvent.user.id)

    // If the player had a saved game then we load it and go to freeRoam 
    if (alternativeGame) {
      // remove alternative game and load it
      voxaEvent.userDator.removeUserAlternativeGame(voxaEvent.user.id)
      voxaEvent.model.game = alternativeGame.game;
      const lastState = alternativeGame.lastState

      // Go to describe location to let the player know where he is
      return {
        flow: "yield",
        reply: "alternativeGameLoadSuccessView",
        to: lastState,
      };
    }

    // If no saved alternative game is found tell it an go load normal game TODO
    return {
      flow: "continue",
      reply: "alternativeGameLoadErrorView",
      to: "loadGame"
    };
  });

  voxaApp.onState("startNewGame", async voxaEvent => {
    voxaEvent.userDator.saveUserGame(voxaEvent.user.id, voxaEvent.model.getDefultGameModel())
    voxaEvent.userDator.removeUserAlternativeGame(voxaEvent.user.id)
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
  voxaApp.onState("freeRoamState", async voxaEvent => {
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
            let nextScene = await elementOrObjectProperties.inspectActionTaken(voxaEvent, alreadyInspected);

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
            let canBeUsedOrNextScene = elementProperties.useObjectActionTaken(voxaEvent, object);
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
        // In other case describe the conversation with the npc depending on alreadyTalked
        voxaEvent.model.control.elementOrObjectToDescribe = npc;
        voxaEvent.model.control.npcStateToDescribe = npcState;

        if (alreadyTalked) {
          return {
            flow: "yield",
            reply: "DescribeTalkToAlreadyTalkedView",
            to: "freeRoamState",
          };
        } else {
          return {
            flow: "yield",
            reply: "DescribeTalkToView",
            to: "freeRoamState",
          };
        }
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
    } else if (voxaEvent.intent.name === "ActionGiveToAdministrator") {
      const quantity = parseInt(voxaEvent.intent.params.quantity);

      // if params set
      if (quantity && quantity >= 0) {
        // if the administrator is in the current location
        if ("tom" in voxaEvent.model.game.map.locations[voxaEvent.model.game.map.currentLocation].npcs) {
          // if the player is where the administrator is accepting resources
          if (voxaEvent.model.game.map.currentLocation === "camp") {
            // if quantity is a valid number
            if (quantity != 0) {
              // if the player can pay
              if (voxaEvent.model.game.resources.junk >= quantity && voxaEvent.model.game.resources.water >= quantity && voxaEvent.model.game.resources.food >= quantity) {
                // retrieve the resources
                voxaEvent.model.game.resources.junk -= quantity;
                voxaEvent.model.game.resources.water -= quantity;
                voxaEvent.model.game.resources.food -= quantity;

                // get the previous level
                const preLevel = voxaEvent.model.getCampLevelByQuantity(voxaEvent.model.game.merchants["tom"].bought["pack"]);
                // add to the bought variable for the administrator in the model
                if (voxaEvent.model.game.merchants["tom"].bought["pack"]) {
                  voxaEvent.model.game.merchants["tom"].bought["pack"] += quantity;
                } else {
                  voxaEvent.model.game.merchants["tom"].bought["pack"] = quantity;
                }
                // get the posterior level
                const postLevel = voxaEvent.model.getCampLevelByQuantity(voxaEvent.model.game.merchants["tom"].bought["pack"]);

                // if camp levels up execute level up function and save the levels so the describe function can return the speech.
                let levelsUp = [];
                for (let i = preLevel + 1; i <= postLevel; i++) {
                  let rl = voxaEvent.model.getCampRelevantLevelProperties(i);
                  levelsUp.push(i);

                  // if it is a relevant level execute action
                  if (rl) {
                    rl.levelActionTaken(voxaEvent.model.game)
                  }
                }

                // if the camp leveled up then return the speeches of the level up, in other case just return a normal quote.
                if (levelsUp.length > 0) {
                  // return the successful action
                  voxaEvent.model.control.elementOrObjectToDescribe = levelsUp;
                  return {
                    flow: "yield",
                    reply: "DescribeGiveToAdministratorLevelsUpView",
                    to: "freeRoamState",
                  };
                } else {
                  return {
                    flow: "yield",
                    reply: "DescribeGiveToAdministratorView",
                    to: "freeRoamState",
                  };
                }
              }

              // Fallback: not enough resources
              return {
                flow: "yield",
                reply: "DescribeGiveToAdministratorFailNoResourcesView",
                to: "freeRoamState",
              };
            }

            // Fallback: if the quantity is zero say that you should not give anything
            return {
              flow: "yield",
              reply: "DescribeGiveToAdministratorFailZeroView",
              to: "freeRoamState",
            };
          }

          // Fallback: The player is not where the administrator accepts resources
          return {
            flow: "yield",
            reply: "DescribeGiveToAdministratorFailNotAcceptingView",
            to: "freeRoamState",
          };
        }

        // Fallback: if the administrator is not in the location go to default fallback
      }

    } else if (voxaEvent.intent.name === "ActionGoTo") {
      // Get the symbol of the cardinal point the player wants to go
      const cardinalToSymbol = { norte: "N", sur: "S", este: "E", oeste: "O" }
      const cardinal = voxaEvent.intent.params.cardinal;
      const symbol = cardinalToSymbol[cardinal];
      const path = voxaEvent.model.getPathProperties(voxaEvent.model.game.map.currentLocation, symbol)
      const locationName = voxaEvent.intent.params.location;

      if (cardinal in cardinalToSymbol) {
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


      // If the location param is not set and cardinal is not a valid value it may be because the cardinal got the value we want for the location
      if (!locationName){
        locationName = cardinal;
      }
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

  ////// Describe trap catches states ///////
  voxaApp.onState("cathBigFoundOnTrapScene", voxaEvent => {
    return {
      flow: "yield",
      reply: "cathBigFoundOnTrapSceneView",
      to: "freeRoamState",
    };
  });
  voxaApp.onState("cathMediumFoundOnTrapScene", voxaEvent => {
    return {
      flow: "yield",
      reply: "cathMediumFoundOnTrapSceneView",
      to: "freeRoamState",
    };
  });
  voxaApp.onState("cathSmallFoundOnTrapScene", voxaEvent => {
    return {
      flow: "yield",
      reply: "cathSmallFoundOnTrapSceneView",
      to: "freeRoamState",
    };
  });
  voxaApp.onState("cathVerySmallFoundOnTrapScene", voxaEvent => {
    return {
      flow: "yield",
      reply: "cathVerySmallFoundOnTrapSceneView",
      to: "freeRoamState",
    };
  });
  voxaApp.onState("nothingFoundOnTrapScene", voxaEvent => {
    return {
      flow: "yield",
      reply: "nothingFoundOnTrapSceneView",
      to: "freeRoamState",
    };
  });


  ////// TUTORIAL ///////
  voxaApp.onState("tuto1_tellAboutNotificationsGameWeb", voxaEvent => {
    return {
      flow: "continue",
      reply: "tuto1_tellAboutNotificationsGameWeb",
      to: "tuto1_askTest",
    };
  });
  voxaApp.onState("tuto1_askTest", voxaEvent => {
    return {
      flow: "yield",
      reply: "tuto1_askTest",
      to: "tuto1_getTest"
    };
  });
  voxaApp.onState("tuto1_getTest", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "tuto1_take",
        to: "tuto1_tellEverything"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "tuto1_dontTake",
        to: "tellMainMenu"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "tutoFallback",
      to: "tuto1_askTest",
    };
  });
  voxaApp.onState("tuto1_tellEverything", voxaEvent => {
    return {
      flow: "continue",
      reply: "tuto1_tellEverything",
      to: "tellMainMenu",
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
    voxaEvent.model.game.choices.explosionWithSandra = false;

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
    voxaEvent.model.game.choices.explosionWithSandra = true;

    return {
      flow: "continue",
      reply: "scene1_2_explosionWithSandra_NarrativeView",
      to: "scene1_2_wakeUpWithSandra"
    };
  });
  voxaApp.onState("scene1_2_wakeUpWithSandra", voxaEvent => {
    voxaEvent.model.game.resources.water += 10;
    // Set next state to describeLocationState which leads to freeRoamState 
    // Set the current location as well.
    voxaEvent.model.game.map.currentLocation = "southForest1";
    return {
      flow: "continue",
      reply: "scene1_2_wakeUpWithSandra_NarrativeView",
      to: "describeLocationState"
    };
  });




  ////// SCENE 2 ///////
  voxaApp.onState("scene2_talkToSandraAtCamp", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "camp";

    return {
      flow: "continue",
      reply: "scene2_talkToSandraAtCamp",
      to: "describeLocationState"
    };
  });




  ////// SCENE 3 ///////
  voxaApp.onState("scene3_goToFishermanVillage", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "fishermanVillage";

    return {
      flow: "continue",
      reply: "scene3_goToFishermanVillage",
      to: "describeLocationState"
    };
  });




  ////// SCENE 4 ///////
  voxaApp.onState("scene4_enterGasStation", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene4_enterGasStation",
      to: "scene4_getApproachBack"
    };
  });
  voxaApp.onState("scene4_getApproachBack", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {

      return {
        flow: "continue",
        reply: "empty",
        to: "scene4_1_approachBack"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {

      return {
        flow: "continue",
        reply: "empty",
        to: "scene4_2_approachFront"
      };
    }

    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene4_enterGasStation",
    };
  });
  voxaApp.onState("scene4_1_approachBack", voxaEvent => {
    voxaEvent.model.game.choices.dogSaved = false;
    voxaEvent.model.game.map.currentLocation = "gasStation";

    return {
      flow: "continue",
      reply: "scene4_1_approachBack",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene4_2_approachFront", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene4_2_approachFront",
      to: "scene4_2_getFoodOrBall"
    };
  });
  voxaApp.onState("scene4_2_getFoodOrBall", voxaEvent => {
    if (voxaEvent.intent.params.choice === "comida") {

      return {
        flow: "continue",
        reply: "empty",
        to: "scene4_2_1_giveFoodAndLiftBeam"
      };
    } else if (voxaEvent.intent.params.choice === "pelota") {

      return {
        flow: "continue",
        reply: "empty",
        to: "scene4_2_2_giveBallDogScaresFastLift"
      };
    }

    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene4_2_approachFront",
    };
  });
  voxaApp.onState("scene4_2_1_giveFoodAndLiftBeam", voxaEvent => {
    voxaEvent.model.game.choices.dogSaved = true;
    voxaEvent.model.game.map.currentLocation = "gasStation";
    return {
      flow: "continue",
      reply: "scene4_2_1_giveFoodAndLiftBeam",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene4_2_2_giveBallDogScaresFastLift", voxaEvent => {
    voxaEvent.model.game.choices.dogSaved = false;
    voxaEvent.model.game.map.currentLocation = "gasStation";
    return {
      flow: "continue",
      reply: "scene4_2_2_giveBallDogScaresFastLift",
      to: "describeLocationState"
    };
  });





  ////// SCENE 5 ///////
  voxaApp.onState("scene5_crossBridge1", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "road_fishermanVillage_highway";

    return {
      flow: "continue",
      reply: "scene5_crossBridge1",
      to: "describeLocationState"
    };
  });




  ////// SCENE 6 ///////
  voxaApp.onState("scene6_reachBridge1FromOtherSide", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "road_fishermanVillage_highway";

    return {
      flow: "continue",
      reply: "scene6_reachBridge1FromOtherSide",
      to: "describeLocationState"
    };
  });




  ////// SCENE 7 ///////
  voxaApp.onState("scene7_crossBridge2", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "riverBankPowerPlant";

    return {
      flow: "continue",
      reply: "scene7_crossBridge2",
      to: "describeLocationState"
    };
  });




  ////// SCENE 8 ///////
  voxaApp.onState("scene8_reachBridge2FromOtherSide", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "riverBankPowerPlant";

    return {
      flow: "continue",
      reply: "scene8_reachBridge2FromOtherSide",
      to: "describeLocationState"
    };
  });





  ////// SCENE 9 ///////
  voxaApp.onState("scene9_findEnemies", voxaEvent => {
    if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene9_findEnemies",
        to: "scene9_1_chadCanConfront"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene9_findEnemies",
        to: "scene9_2_thinkConfrontBoth"
      };
    }
  });
  voxaApp.onState("scene9_1_chadCanConfront", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene9_1_chadCanConfront",
      to: "scene9_1_askPlayerIfConfront"
    };
  });
  voxaApp.onState("scene9_1_askPlayerIfConfront", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene9_1_askPlayerIfConfront",
      to: "scene9_1_getPlayerConfrontDecision"
    };
  });
  voxaApp.onState("scene9_1_getPlayerConfrontDecision", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene9_1_1chadConfront"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene9_1_2_waitTillEnemiesGone"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene9_1_askPlayerIfConfront",
    };
  });
  voxaApp.onState("scene9_1_1chadConfront", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy1 = true;
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene9_1_1chadConfront",
        to: "scene9_1_1_1playerConfront"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene9_1_1chadConfront",
        to: "scene9_1_1_2playerWaitsForChad"
      };
    }
  });
  voxaApp.onState("scene9_1_1_1playerConfront", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy2 = true;
    return {
      flow: "continue",
      reply: "scene9_1_1_1playerConfront",
      to: "scene9_emptyJoin"
    };
  });
  voxaApp.onState("scene9_1_1_2playerWaitsForChad", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy2 = false;
    return {
      flow: "continue",
      reply: "scene9_1_1_2playerWaitsForChad",
      to: "scene9_emptyJoin"
    };
  });
  voxaApp.onState("scene9_1_2_waitTillEnemiesGone", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy1 = false;
    voxaEvent.model.game.choices.killEnemy2 = false;
    return {
      flow: "continue",
      reply: "scene9_1_2_waitTillEnemiesGone",
      to: "scene9_emptyJoin"
    };
  });

  voxaApp.onState("scene9_2_thinkConfrontBoth", voxaEvent => {
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene9_2_thinkConfrontBoth",
        to: "scene9_2_1_askPlayerIfConfrontBoth"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene9_2_thinkConfrontBoth",
        to: "scene9_discardConfront"
      };
    }
  });
  voxaApp.onState("scene9_2_1_askPlayerIfConfrontBoth", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene9_2_1_askPlayerIfConfrontBoth",
      to: "scene9_1_getPlayerConfrontDecision"
    };
  });
  voxaApp.onState("scene9_2_1_getThinkConfrontBoth", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene9_2_1_1_bothEnemiesScape"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene9_2_1_2_firstEnemyScapes"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene9_2_1_askPlayerIfConfrontBoth",
    };
  });
  voxaApp.onState("scene9_2_1_1_bothEnemiesScape", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy1 = false;
    voxaEvent.model.game.choices.killEnemy2 = false;
    return {
      flow: "continue",
      reply: "scene9_2_1_1_bothEnemiesScape",
      to: "scene9_emptyJoin"
    };
  });
  voxaApp.onState("scene9_2_1_2_firstEnemyScapes", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy1 = false;
    return {
      flow: "continue",
      reply: "scene9_2_1_2_firstEnemyScapes",
      to: "scene9_2_1_2_askPlayerIfConfrontOne"
    };
  });
  voxaApp.onState("scene9_2_1_2_askPlayerIfConfrontOne", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene9_2_1_2_askPlayerIfConfrontOne",
      to: "scene9_2_1_2_getThinkConfrontOne"
    };
  });
  voxaApp.onState("scene9_2_1_2_getThinkConfrontOne", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene9_2_1_2_1_playerKillsOne"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene9_2_1_2_2_secondEnemyScapes"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene9_2_1_2_askPlayerIfConfrontOne",
    };
  });
  voxaApp.onState("scene9_2_1_2_1_playerKillsOne", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy2 = true;
    return {
      flow: "continue",
      reply: "scene9_2_1_2_1_playerKillsOne",
      to: "scene9_emptyJoin"
    };
  });
  voxaApp.onState("scene9_2_1_2_2_secondEnemyScapes", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy2 = false;
    return {
      flow: "continue",
      reply: "scene9_2_1_2_2_secondEnemyScapes",
      to: "scene9_emptyJoin"
    };
  });
  voxaApp.onState("scene9_discardConfront", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy1 = false;
    voxaEvent.model.game.choices.killEnemy2 = false;
    return {
      flow: "continue",
      reply: "scene9_discardConfront",
      to: "scene9_emptyJoin"
    };
  });
  voxaApp.onState("scene9_emptyJoin", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "militaryCampusEntrance";
    return {
      flow: "continue",
      reply: "empty",
      to: "describeLocationState"
    };
  });





  ////// SCENE 10 ///////
  voxaApp.onState("scene10_entersMilitaryBuilding", voxaEvent => {
    if (voxaEvent.model.game.choices.killEnemy2) {
      return {
        flow: "continue",
        reply: "scene10_entersMilitaryBuilding",
        to: "scene10_2_noEnemy"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene10_entersMilitaryBuilding",
        to: "scene10_1_seeEnemy"
      };
    }
  });
  voxaApp.onState("scene10_1_seeEnemy", voxaEvent => {
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene10_1_seeEnemy",
        to: "scene10_1_1_killWithLever"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene10_1_seeEnemy",
        to: "scene10_1_2_fightAndPilarDown"
      };
    }
  });
  voxaApp.onState("scene10_1_1_killWithLever", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy2 = true;
    voxaEvent.model.game.map.currentLocation = "militaryBaseMainBuilding";
    return {
      flow: "continue",
      reply: "scene10_1_1_killWithLever",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene10_1_2_fightAndPilarDown", voxaEvent => {
    voxaEvent.model.game.choices.killEnemy2 = false;
    voxaEvent.model.game.map.currentLocation = "militaryBaseMainBuilding";
    return {
      flow: "continue",
      reply: "scene10_1_2_fightAndPilarDown",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene10_2_noEnemy", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "militaryBaseMainBuilding";
    return {
      flow: "continue",
      reply: "scene10_2_noEnemy",
      to: "describeLocationState"
    };
  });






  ////// SCENE 11 ///////
  voxaApp.onState("scene11_meetsHugoInIndustrial", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "industrialParkEntrance";

    return {
      flow: "continue",
      reply: "scene11_meetsHugoInIndustrial",
      to: "describeLocationState"
    };
  });






  ////// SCENE 12 ///////
  voxaApp.onState("scene12_findEnemies", voxaEvent => {
    if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene12_findEnemies",
        to: "scene12_1_chadAndSandraTellsWhatTheyDo"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene12_findEnemies",
        to: "scene12_2_sandraTellsWhatTheyDo"
      };
    }
  });
  voxaApp.onState("scene12_1_chadAndSandraTellsWhatTheyDo", voxaEvent => {
    if ("lever" in voxaEvent.model.game.inventory.objects
      && "gunFull" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene12_1_chadAndSandraTellsWhatTheyDo",
        to: "scene12_1_1_askPlayerUseLeverOrGun"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene12_1_chadAndSandraTellsWhatTheyDo",
        to: "scene12_1_2_saveSandraWithChad"
      };
    }
  });
  voxaApp.onState("scene12_1_1_askPlayerUseLeverOrGun", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene12_1_1_askPlayerUseLeverOrGun",
      to: "scene12_1_1_getLeverOrGun"
    };
  });
  voxaApp.onState("scene12_1_1_getLeverOrGun", voxaEvent => {
    if (voxaEvent.intent.params.choiceLeverOrGun === "palanca") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene12_1_1_1_killEnemyWithLever"
      };
    } else if (voxaEvent.intent.params.choiceLeverOrGun === "pistola") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene12_1_1_2_killEnemyWithGun"
      };
    }
    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene12_1_1_askPlayerUseLeverOrGun",
    };
  });
  voxaApp.onState("scene12_1_1_1_killEnemyWithLever", voxaEvent => {
    voxaEvent.model.game.choices.sandraGetsHurt = false;
    voxaEvent.model.game.choices.saveSandraWithGun = false;
    return {
      flow: "continue",
      reply: "scene12_1_1_1_killEnemyWithLever",
      to: "scene12_3_sandraThanksAndGoToSaveSydney"
    };
  });
  voxaApp.onState("scene12_1_1_2_killEnemyWithGun", voxaEvent => {
    voxaEvent.model.game.choices.sandraGetsHurt = false;
    voxaEvent.model.game.choices.saveSandraWithGun = true;
    return {
      flow: "continue",
      reply: "scene12_1_1_2_killEnemyWithGun",
      to: "scene12_3_sandraThanksAndGoToSaveSydney"
    };
  });
  voxaApp.onState("scene12_1_2_saveSandraWithChad", voxaEvent => {
    voxaEvent.model.game.choices.sandraGetsHurt = true;
    voxaEvent.model.game.choices.saveSandraWithGun = true;
    return {
      flow: "continue",
      reply: "scene12_1_2_saveSandraWithChad",
      to: "scene12_3_sandraThanksAndGoToSaveSydney"
    };
  });

  voxaApp.onState("scene12_2_sandraTellsWhatTheyDo", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene12_2_sandraTellsWhatTheyDo",
      to: "scene12_2_askGoForSandra"
    };
  });
  voxaApp.onState("scene12_2_askGoForSandra", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene12_2_askGoForSandra",
      to: "scene12_2_getGoForSandra"
    };
  });
  voxaApp.onState("scene12_2_getGoForSandra", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene12_2_figthYourEnemy"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene12_2_figthYourEnemy"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene12_2_askGoForSandra",
    };
  });
  voxaApp.onState("scene12_2_figthYourEnemy", voxaEvent => {
    voxaEvent.model.game.choices.saveSandraWithGun = false;
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene12_2_figthYourEnemy",
        to: "scene12_2_1_useLeverForSave"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene12_2_figthYourEnemy",
        to: "scene12_2_2_useHandsForSave"
      };
    }
  });
  voxaApp.onState("scene12_2_1_useLeverForSave", voxaEvent => {
    voxaEvent.model.game.choices.sandraGetsHurt = false;
    return {
      flow: "continue",
      reply: "scene12_2_1_useLeverForSave",
      to: "scene12_3_sandraThanksAndGoToSaveSydney"
    };
  });
  voxaApp.onState("scene12_2_2_useHandsForSave", voxaEvent => {
    voxaEvent.model.game.choices.sandraGetsHurt = true;
    return {
      flow: "continue",
      reply: "scene12_2_2_useHandsForSave",
      to: "scene12_3_sandraThanksAndGoToSaveSydney"
    };
  });
  voxaApp.onState("scene12_3_sandraThanksAndGoToSaveSydney", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "militaryLaboratoryOutskirts";
    return {
      flow: "continue",
      reply: "scene12_3_sandraThanksAndGoToSaveSydney",
      to: "describeLocationState"
    };
  });






  ////// SCENE 13 ///////
  voxaApp.onState("scene13_enterLaboratoryWarehouse", voxaEvent => {
    if ("gunFull" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene13_enterLaboratoryWarehouse",
        to: "scene13_tryToShootButCant"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene13_enterLaboratoryWarehouse",
        to: "scene13_askPushClosetOrCharge"
      };
    }
  });
  voxaApp.onState("scene13_askPushClosetOrCharge", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene13_askPushClosetOrCharge",
      to: "scene13_getPushOrCharge"
    };
  });
  voxaApp.onState("scene13_getPushOrCharge", voxaEvent => {
    if (voxaEvent.intent.params.choiceAttackOrPush === "empujar"
      || voxaEvent.intent.params.choiceAttackOrPush === "empujo") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_trapEnemyAndSydney"
      };
    } else if (voxaEvent.intent.params.choiceAttackOrPush === "atacar"
      || voxaEvent.intent.params.choiceAttackOrPush === "ataco"
      || voxaEvent.intent.params.choiceSneakyOrAttack === "ataco"
      || voxaEvent.intent.params.choiceSneakyOrAttack === "atacar"
      || voxaEvent.intent.params.choiceAttackOrSave === "ataco"
      || voxaEvent.intent.params.choiceAttackOrSave === "atacar") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_goForEnemyButCantReach"
      };
    }
    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene13_askPushClosetOrCharge",
    };
  });
  voxaApp.onState("scene13_trapEnemyAndSydney", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene13_trapEnemyAndSydney",
      to: "scene13_askGoForEnemyOrForSydney"
    };
  });
  voxaApp.onState("scene13_askGoForEnemyOrForSydney", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene13_askGoForEnemyOrForSydney",
      to: "scene13_getEnemyOrSydney"
    };
  });
  voxaApp.onState("scene13_getEnemyOrSydney", voxaEvent => {
    if (voxaEvent.intent.params.choiceAttackOrSave === "salvar"
      || voxaEvent.intent.params.choiceAttackOrSave === "salvo") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_cantReachEnemyGoesForSydney"
      };
    } else if (voxaEvent.intent.params.choiceAttackOrSave === "atacar"
      || voxaEvent.intent.params.choiceAttackOrSave === "ataco"
      || voxaEvent.intent.params.choiceSneakyOrAttack === "ataco"
      || voxaEvent.intent.params.choiceSneakyOrAttack === "atacar"
      || voxaEvent.intent.params.choiceAttackOrPush === "ataco"
      || voxaEvent.intent.params.choiceAttackOrPush === "atacar") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_enemyScapesGoesForYou"
      };
    }
    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene13_askGoForEnemyOrForSydney",
    };
  });
  voxaApp.onState("scene13_cantReachEnemyGoesForSydney", voxaEvent => {
    if (voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene13_cantReachEnemyGoesForSydney",
        to: "scene13_dogSavesSydney"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene13_cantReachEnemyGoesForSydney",
        to: "scene13_sydneyDiesByEnemy"
      };
    }
  });
  voxaApp.onState("scene13_dogSavesSydney", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_dogSavesSydney",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sydneyDiesByEnemy", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_sydneyDiesByEnemy",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_enemyScapesGoesForYou", voxaEvent => {
    if (voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene13_enemyScapesGoesForYou",
        to: "scene13_dogSavesYou"
      };
    } else if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene13_enemyScapesGoesForYou",
        to: "scene13_chadSavesYou"
      };
    } else if (!voxaEvent.model.game.choices.sandraGetsHurt) {
      return {
        flow: "continue",
        reply: "scene13_enemyScapesGoesForYou",
        to: "scene13_sandraSavesYou"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene13_enemyScapesGoesForYou",
        to: "scene13_sydneyTriesToHelpAndDies"
      };
    }
  });
  voxaApp.onState("scene13_dogSavesYou", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_dogSavesYou",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_chadSavesYou", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_chadSavesYou",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sandraSavesYou", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_sandraSavesYou",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sydneyTriesToHelpAndDies", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_sydneyTriesToHelpAndDies",
      to: "scene13_emptyJoin"
    };
  });

  voxaApp.onState("scene13_goForEnemyButCantReach", voxaEvent => {
    if (voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene13_goForEnemyButCantReach",
        to: "scene13_dogDistractEnemy"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene13_goForEnemyButCantReach",
        to: "scene13_sydneyFightsEnemy"
      };
    }
  });
  voxaApp.onState("scene13_dogDistractEnemy", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene13_dogDistractEnemy",
      to: "scene13_askHelpDog"
    };
  });
  voxaApp.onState("scene13_askHelpDog", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene13_askHelpDog",
      to: "scene13_getHelpDog"
    };
  });
  voxaApp.onState("scene13_getHelpDog", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_goHelpDog"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_enemyScapesDogAndCatchesSydney"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene13_askHelpDog",
    };
  });
  voxaApp.onState("scene13_goHelpDog", voxaEvent => {
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene13_goHelpDog",
        to: "scene13_killEnemyWithLever"
      };
    } else if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene13_goHelpDog",
        to: "scene13_chadKillsEnemy"
      };
    } else if (!voxaEvent.model.game.choices.sandraGetsHurt) {
      return {
        flow: "continue",
        reply: "scene13_goHelpDog",
        to: "scene13_sandraKillsenemy"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene13_goHelpDog",
        to: "scene13_sydneyGetsCaught"
      };
    }
  });
  voxaApp.onState("scene13_killEnemyWithLever", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_killEnemyWithLever",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_chadKillsEnemy", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_chadKillsEnemy",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sandraKillsenemy", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_sandraKillsenemy",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sydneyGetsCaught", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_sydneyGetsCaught",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_enemyScapesDogAndCatchesSydney", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_enemyScapesDogAndCatchesSydney",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sydneyFightsEnemy", voxaEvent => {
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene13_sydneyFightsEnemy",
        to: "scene13_askUseLeverToHelp"
      };
    } else if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene13_sydneyFightsEnemy",
        to: "scene13_chadHelpsButSydneyDies"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene13_sydneyFightsEnemy",
        to: "scene13_sydneyLosesFightAndDies"
      };
    }
  });
  voxaApp.onState("scene13_askUseLeverToHelp", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene13_askUseLeverToHelp",
      to: "scene13_getUseLeverToHelp"
    };
  });
  voxaApp.onState("scene13_getUseLeverToHelp", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_killEnemyWithLever2"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene13_sydneyDies"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene13_askUseLeverToHelp",
    };
  });
  voxaApp.onState("scene13_killEnemyWithLever2", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = true;
    return {
      flow: "continue",
      reply: "scene13_killEnemyWithLever2",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sydneyDies", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_sydneyDies",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_chadHelpsButSydneyDies", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_chadHelpsButSydneyDies",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_sydneyLosesFightAndDies", voxaEvent => {
    voxaEvent.model.game.choices.sydneyAlive = false;
    return {
      flow: "continue",
      reply: "scene13_sydneyLosesFightAndDies",
      to: "scene13_emptyJoin"
    };
  });
  voxaApp.onState("scene13_emptyJoin", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "militaryLaboratoryWarehouse";
    return {
      flow: "continue",
      reply: "empty",
      to: "describeLocationState"
    };
  });




  ////// SCENE 14 ///////
  voxaApp.onState("scene14_faceFinalFightDescribeScene", voxaEvent => {
    if (voxaEvent.model.game.choices.killEnemy1) {
      return {
        flow: "continue",
        reply: "scene14_faceFinalFightDescribeScene",
        to: "scene14_describe2Enemies"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_faceFinalFightDescribeScene",
        to: "scene14_describe3Enemies"
      };
    }
  });
  voxaApp.onState("scene14_describe2Enemies", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_describe2Enemies",
      to: "scene14_thinkWhatToDo"
    };
  });
  voxaApp.onState("scene14_describe3Enemies", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_describe3Enemies",
      to: "scene14_thinkWhatToDo"
    };
  });
  voxaApp.onState("scene14_thinkWhatToDo", voxaEvent => {
    if (voxaEvent.model.game.choices.sydneyAlive) {
      return {
        flow: "continue",
        reply: "scene14_thinkWhatToDo",
        to: "scene14_sydneyTellsAboutEnemyAndArtifact"
      };
    } else if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene14_thinkWhatToDo",
        to: "scene14_chadTellsAboutEnemyAndArtifact"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_thinkWhatToDo",
        to: "scene14_gessAboutEnemyAndArtifact"
      };
    }
  });
  voxaApp.onState("scene14_sydneyTellsAboutEnemyAndArtifact", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sydneyTellsAboutEnemyAndArtifact",
      to: "scene14_askGoSneakyOrCharge"
    };
  });
  voxaApp.onState("scene14_chadTellsAboutEnemyAndArtifact", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_chadTellsAboutEnemyAndArtifact",
      to: "scene14_askGoSneakyOrCharge"
    };
  });
  voxaApp.onState("scene14_gessAboutEnemyAndArtifact", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_gessAboutEnemyAndArtifact",
      to: "scene14_askGoSneakyOrCharge"
    };
  });
  voxaApp.onState("scene14_askGoSneakyOrCharge", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene14_askGoSneakyOrCharge",
      to: "scene14_getSneakyOrCharge"
    };
  });
  voxaApp.onState("scene14_getSneakyOrCharge", voxaEvent => {
    if (voxaEvent.intent.params.choiceSneakyOrAttack === "silencioso"
      || voxaEvent.intent.params.choiceSneakyOrAttack === "silenciosamente") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_decideToGoSneaky"
      };
    } else if (voxaEvent.intent.params.choiceSneakyOrAttack === "atacar"
      || voxaEvent.intent.params.choiceSneakyOrAttack === "ataco"
      || voxaEvent.intent.params.choiceAttackOrPush === "ataco"
      || voxaEvent.intent.params.choiceAttackOrPush === "atacar"
      || voxaEvent.intent.params.choiceAttackOrSave === "ataco"
      || voxaEvent.intent.params.choiceAttackOrSave === "atacar") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_decideToCharge"
      };
    }
    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene14_askGoSneakyOrCharge",
    };
  });
  voxaApp.onState("scene14_decideToGoSneaky", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_decideToGoSneaky",
      to: "scene14_askGoAloneForOneWayOrTogether"
    };
  });
  voxaApp.onState("scene14_askGoAloneForOneWayOrTogether", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene14_askGoAloneForOneWayOrTogether",
      to: "scene14_getAloneOrTogether"
    };
  });
  voxaApp.onState("scene14_getAloneOrTogether", voxaEvent => {
    if (voxaEvent.intent.params.choiceAloneOrTogether === "separados"
      || voxaEvent.intent.params.choiceAloneOrTogether === "separado") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_goAloneRightWay"
      };
    } else if (voxaEvent.intent.params.choiceAloneOrTogether === "juntos"
      || voxaEvent.intent.params.choiceAloneOrTogether === "junto") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_goTogetherRightWay"
      };
    }
    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene14_askGoAloneForOneWayOrTogether",
    };
  });
  voxaApp.onState("scene14_goAloneRightWay", voxaEvent => {
    if (voxaEvent.model.game.choices.sydneyAlive
      || voxaEvent.model.game.choices.chadAlive
      || voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene14_goAloneRightWay",
        to: "scene14_describePartnerGoForEnemyAndGetNoticed"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_goAloneRightWay",
        to: "scene14_describePartyGoForEnemyAndGetNoticed"
      };
    }
  });
  voxaApp.onState("scene14_describePartnerGoForEnemyAndGetNoticed", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_describePartnerGoForEnemyAndGetNoticed",
      to: "scene14_askGoHelpOrGoDestroyArtifact"
    };
  });
  voxaApp.onState("scene14_describePartyGoForEnemyAndGetNoticed", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_describePartyGoForEnemyAndGetNoticed",
      to: "scene14_askGoHelpOrGoDestroyArtifact"
    };
  });
  voxaApp.onState("scene14_askGoHelpOrGoDestroyArtifact", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene14_askGoHelpOrGoDestroyArtifact",
      to: "scene14_getHelpOrDestroyArtifact"
    };
  });
  voxaApp.onState("scene14_getHelpOrDestroyArtifact", voxaEvent => {
    if (voxaEvent.intent.params.choiceHelpOrDestroy === "ayudar"
      || voxaEvent.intent.params.choiceHelpOrDestroy === "ayudo"
      || voxaEvent.intent.params.choiceHelpOrDestroy === "ayudarlos") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_crawlToEnemyBack"
      };
    } else if (voxaEvent.intent.params.choiceHelpOrDestroy === "destruir"
      || voxaEvent.intent.params.choiceHelpOrDestroy === "destruyo") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_goForArtifactButBossNoticesAndFollowsYou"
      };
    }
    // Fallback: if the intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene14_askGoHelpOrGoDestroyArtifact",
    };
  });
  voxaApp.onState("scene14_crawlToEnemyBack", voxaEvent => {
    if (voxaEvent.model.game.choices.chadAlive
      && voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene14_crawlToEnemyBack",
        to: "scene14_chadAndDogBaitBoss"
      };
    } else if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene14_crawlToEnemyBack",
        to: "scene14_chadBaitsBoss"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_crawlToEnemyBack",
        to: "scene14_sandraBaitsBoss"
      };
    }
  });
  voxaApp.onState("scene14_chadAndDogBaitBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_chadAndDogBaitBoss",
      to: "scene14_getToBossBack"
    };
  });
  voxaApp.onState("scene14_chadBaitsBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_chadBaitsBoss",
      to: "scene14_getToBossBack"
    };
  });
  voxaApp.onState("scene14_sandraBaitsBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sandraBaitsBoss",
      to: "scene14_getToBossBack"
    };
  });
  voxaApp.onState("scene14_getToBossBack", voxaEvent => {
    if ("lever" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene14_getToBossBack",
        to: "scene14_killWithLever"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_getToBossBack",
        to: "scene14_grabBossAndSandraKillsBoss"
      };
    }
  });
  voxaApp.onState("scene14_killWithLever", voxaEvent => {
    voxaEvent.model.game.choices.getRidOfEnemyLeader = true;
    return {
      flow: "continue",
      reply: "scene14_killWithLever",
      to: "scene14_destroyArtifactEasily"
    };
  });
  voxaApp.onState("scene14_grabBossAndSandraKillsBoss", voxaEvent => {
    voxaEvent.model.game.choices.getRidOfEnemyLeader = true;
    return {
      flow: "continue",
      reply: "scene14_grabBossAndSandraKillsBoss",
      to: "scene14_destroyArtifactEasily"
    };
  });
  voxaApp.onState("scene14_destroyArtifactEasily", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = true;
    return {
      flow: "continue",
      reply: "scene14_destroyArtifactEasily",
      to: "scene14_emptyJoin"
    };
  });
  voxaApp.onState("scene14_goForArtifactButBossNoticesAndFollowsYou", voxaEvent => {
    if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene14_goForArtifactButBossNoticesAndFollowsYou",
        to: "scene14_chadInterceptBoss"
      };
    } else if (voxaEvent.model.game.choices.sydneyAlive) {
      return {
        flow: "continue",
        reply: "scene14_goForArtifactButBossNoticesAndFollowsYou",
        to: "scene14_sidneyInterceptBoss"
      };
    } else if (voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene14_goForArtifactButBossNoticesAndFollowsYou",
        to: "scene14_dogInterceptBoss"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_goForArtifactButBossNoticesAndFollowsYou",
        to: "scene14_bossGetsYouAndStartArtifact"
      };
    }
  });
  voxaApp.onState("scene14_bossGetsYouAndStartArtifact", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = true;
    return {
      flow: "continue",
      reply: "scene14_bossGetsYouAndStartArtifact",
      to: "scene14_bossEscapesRunning"
    };
  });
  voxaApp.onState("scene14_chadInterceptBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_chadInterceptBoss",
      to: "scene14_youManageToDestroyArtifact"
    };
  });
  voxaApp.onState("scene14_sidneyInterceptBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sidneyInterceptBoss",
      to: "scene14_youManageToDestroyArtifact"
    };
  });
  voxaApp.onState("scene14_dogInterceptBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_dogInterceptBoss",
      to: "scene14_youManageToDestroyArtifact"
    };
  });
  voxaApp.onState("scene14_bossEscapesRunning", voxaEvent => {
    voxaEvent.model.game.choices.getRidOfEnemyLeader = false;
    return {
      flow: "continue",
      reply: "scene14_bossEscapesRunning",
      to: "scene14_emptyJoin"
    };
  });
  voxaApp.onState("scene14_youManageToDestroyArtifact", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = true;
    return {
      flow: "continue",
      reply: "scene14_youManageToDestroyArtifact",
      to: "scene14_emptyJoin"
    };
  });

  voxaApp.onState("scene14_goTogetherRightWay", voxaEvent => {
    if (voxaEvent.model.game.choices.killEnemy1) {
      return {
        flow: "continue",
        reply: "scene14_goTogetherRightWay",
        to: "scene14_sandraFacesLastEnemy"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_goTogetherRightWay",
        to: "scene14_defeatOneEnemy"
      };
    }
  });
  voxaApp.onState("scene14_sandraFacesLastEnemy", voxaEvent => {
    if ("gunFull" in voxaEvent.model.game.inventory.objects) {
      return {
        flow: "continue",
        reply: "scene14_sandraFacesLastEnemy",
        to: "scene14_askUseGunOnBoss"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_sandraFacesLastEnemy",
        to: "scene14_bossGetsRidOfSydneyAndUsesArtifact"
      };
    }
  });
  voxaApp.onState("scene14_askUseGunOnBoss", voxaEvent => {
    return {
      flow: "yield",
      reply: "scene14_askUseGunOnBoss",
      to: "scene14_getUseGunOnBoss"
    };
  });
  voxaApp.onState("scene14_getUseGunOnBoss", voxaEvent => {
    if (voxaEvent.intent.name === "YesIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_disableBoss"
      };
    } else if (voxaEvent.intent.name === "NoIntent") {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_bossGetsRidOfSydneyAndUsesArtifact"
      };
    }
    // Fallback: if the "yes" and "no" intents are not matched (returns to last question)
    return {
      flow: "continue",
      reply: "sceneGenericFallback",
      to: "scene14_askUseGunOnBoss",
    };
  });
  voxaApp.onState("scene14_disableBoss", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = true;
    return {
      flow: "continue",
      reply: "scene14_disableBoss",
      to: "scene14_bossEscapes"
    };
  });
  voxaApp.onState("scene14_bossGetsRidOfSydneyAndUsesArtifact", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = false;
    return {
      flow: "continue",
      reply: "scene14_bossGetsRidOfSydneyAndUsesArtifact",
      to: "scene14_bossEscapes"
    };
  });
  voxaApp.onState("scene14_bossEscapes", voxaEvent => {
    voxaEvent.model.game.choices.getRidOfEnemyLeader = false;
    return {
      flow: "continue",
      reply: "scene14_bossEscapes",
      to: "scene14_emptyJoin"
    };
  });

  voxaApp.onState("scene14_defeatOneEnemy", voxaEvent => {
    if (!(voxaEvent.model.game.choices.chadAlive
      || voxaEvent.model.game.choices.dogSaved
      || voxaEvent.model.game.choices.sydneyAlive)) {
      return {
        flow: "continue",
        reply: "scene14_defeatOneEnemy",
        to: "scene14_partnerFigthsEnemyLeft"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_defeatOneEnemy",
        to: "scene14_partyFigthsEnemyLeft"
      };
    }
  });
  voxaApp.onState("scene14_partnerFigthsEnemyLeft", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_partnerFigthsEnemyLeft",
      to: "scene14_faceBossAlone"
    };
  });
  voxaApp.onState("scene14_partyFigthsEnemyLeft", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_partyFigthsEnemyLeft",
      to: "scene14_faceBossAlone"
    };
  });
  voxaApp.onState("scene14_faceBossAlone", voxaEvent => {
    if (voxaEvent.model.game.choices.sydneyAlive) {
      return {
        flow: "continue",
        reply: "scene14_faceBossAlone",
        to: "scene14_sydneyAskForTimeAndDestroysArtifact"
      };
    } else if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene14_faceBossAlone",
        to: "scene14_sandraTriesToDestroyButCantWhileChadGetsLastEnemy"
      };
    } else if (voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene14_faceBossAlone",
        to: "scene14_sandraTriesToDestroyButCantWhileDogGetsLastEnemy"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_faceBossAlone",
        to: "scene14_sandraEndsLastEnemyTriesToDestroyButCant"
      };
    }
  });
  voxaApp.onState("scene14_sydneyAskForTimeAndDestroysArtifact", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = true;
    if (voxaEvent.model.game.choices.chadAlive) {
      return {
        flow: "continue",
        reply: "scene14_sydneyAskForTimeAndDestroysArtifact",
        to: "scene14_chadSavesYouFromBoss"
      };
    } else if (voxaEvent.model.game.choices.dogSaved) {
      return {
        flow: "continue",
        reply: "scene14_sydneyAskForTimeAndDestroysArtifact",
        to: "scene14_dogSavesYouFromBoss"
      };
    } else {
      return {
        flow: "continue",
        reply: "scene14_sydneyAskForTimeAndDestroysArtifact",
        to: "scene14_sandraSavesYouFromBoss"
      };
    }
  });
  voxaApp.onState("scene14_chadSavesYouFromBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_chadSavesYouFromBoss",
      to: "scene14_bossEscapesUsingWindow"
    };
  });
  voxaApp.onState("scene14_dogSavesYouFromBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_dogSavesYouFromBoss",
      to: "scene14_bossEscapesUsingWindow"
    };
  });
  voxaApp.onState("scene14_sandraSavesYouFromBoss", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sandraSavesYouFromBoss",
      to: "scene14_bossEscapesUsingWindow"
    };
  });
  voxaApp.onState("scene14_bossEscapesUsingWindow", voxaEvent => {
    voxaEvent.model.game.choices.getRidOfEnemyLeader = false;
    return {
      flow: "continue",
      reply: "scene14_bossEscapesUsingWindow",
      to: "scene14_emptyJoin"
    };
  });
  voxaApp.onState("scene14_sandraTriesToDestroyButCantWhileChadGetsLastEnemy", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sandraTriesToDestroyButCantWhileChadGetsLastEnemy",
      to: "scene14_bossNoticesAndUsesArtifact"
    };
  });
  voxaApp.onState("scene14_sandraTriesToDestroyButCantWhileDogGetsLastEnemy", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sandraTriesToDestroyButCantWhileDogGetsLastEnemy",
      to: "scene14_bossNoticesAndUsesArtifact"
    };
  });
  voxaApp.onState("scene14_sandraEndsLastEnemyTriesToDestroyButCant", voxaEvent => {
    return {
      flow: "continue",
      reply: "scene14_sandraEndsLastEnemyTriesToDestroyButCant",
      to: "scene14_bossNoticesAndUsesArtifact"
    };
  });
  voxaApp.onState("scene14_bossNoticesAndUsesArtifact", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = false;
    return {
      flow: "continue",
      reply: "scene14_bossNoticesAndUsesArtifact",
      to: "scene14_bossEscapesUsingWindow"
    };
  });

  voxaApp.onState("scene14_decideToCharge", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = false;
    return {
      flow: "continue",
      reply: "scene14_decideToCharge",
      to: "scene14_sandraTellsNoWayToDoThat"
    };
  });
  voxaApp.onState("scene14_sandraTellsNoWayToDoThat", voxaEvent => {
    voxaEvent.model.game.choices.destroyEnemyPlans = false;
    return {
      flow: "continue",
      reply: "scene14_sandraTellsNoWayToDoThat",
      to: "scene14_decideToGoSneaky"
    };
  });

  voxaApp.onState("scene14_emptyJoin", voxaEvent => {
    if (voxaEvent.model.game.choices.destroyEnemyPlans
      && voxaEvent.model.game.choices.getRidOfEnemyLeader
      && voxaEvent.model.game.choices.sydneyAlive) {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_sandraFinalSpeechSaveCampAndSydneyAndDefeatBoss"
      };
    } else if (voxaEvent.model.game.choices.destroyEnemyPlans
      && voxaEvent.model.game.choices.getRidOfEnemyLeader) {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_sandraFinalSpeechSaveCampAndDefeatBoss"
      };
    } else if (voxaEvent.model.game.choices.destroyEnemyPlans) {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_sandraFinalSpeechSaveCampAtLeast"
      };
    } else {
      return {
        flow: "continue",
        reply: "empty",
        to: "scene14_sandraFinalSpeechPrepareForNewProblems"
      };
    }
  });

  voxaApp.onState("scene14_sandraFinalSpeechSaveCampAndDefeatBoss", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "camp";
    return {
      flow: "continue",
      reply: "scene14_sandraFinalSpeechSaveCampAndDefeatBoss",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene14_sandraFinalSpeechSaveCampAndSydneyAndDefeatBoss", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "camp";
    return {
      flow: "continue",
      reply: "scene14_sandraFinalSpeechSaveCampAndSydneyAndDefeatBoss",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene14_sandraFinalSpeechSaveCampAtLeast", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "camp";
    return {
      flow: "continue",
      reply: "scene14_sandraFinalSpeechSaveCampAtLeast",
      to: "describeLocationState"
    };
  });
  voxaApp.onState("scene14_sandraFinalSpeechPrepareForNewProblems", voxaEvent => {
    voxaEvent.model.game.map.currentLocation = "camp";
    return {
      flow: "continue",
      reply: "scene14_sandraFinalSpeechPrepareForNewProblems",
      to: "describeLocationState"
    };
  });



}

module.exports = register;
