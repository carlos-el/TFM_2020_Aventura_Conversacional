function register(voxaApp) {
  voxaApp.onIntent("LaunchIntent", () => {
    return {
      flow: "continue",
      reply: "LaunchMainMenu",
      to: "tellMainMenu",
    };
  });

  voxaApp.onState("tellMainMenu", () => {
    return {
      flow: "yield",
      reply: "tellMainMenuOptionView",
      to: "getMainMenuOption",
    };
  });

  voxaApp.onState("getMainMenuOption", voxaEvent => {
    if (voxaEvent.intent.name === "ContinueGameIntent") {
      return {
        flow: "terminate",
        reply: "continueGameView",
      };
    }else if (voxaEvent.intent.name === "StartNewGameIntent") {
      return {
        flow: "terminate",
        reply: "startGameView",
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
}

module.exports = register;
