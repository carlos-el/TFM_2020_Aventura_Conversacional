module.exports = class CampLevel {
    constructor(data) {
        this.levelActionTaken = data.levelActionTaken; // Function, action to execute when the camp reachs this level. Returns the name of the next scene to execute or empty ir no scene is scheduled.
        this.speech = data.speech; // String, speech that the administrator should say when level goes up.
    }
}