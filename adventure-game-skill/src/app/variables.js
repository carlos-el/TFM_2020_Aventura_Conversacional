exports.playerName = function(voxaEvent) {
  return voxaEvent.model.player.playerName;
};

exports.playerSex = function(voxaEvent) {
  return voxaEvent.model.player.playerSex;
};

exports.playerDoorColor = function(voxaEvent) {
  if (voxaEvent.model.player.playerSex === "male")
    return "azul";
  else if (voxaEvent.model.player.playerSex === "female")
    return "rosa";
};
