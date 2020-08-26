module.exports = class NpcState {
    constructor(data) {
        this.talkActionTaken = data.talkActionTaken; // Function, executes the effects of talking to the npc in this state. Can change the state of the npc, make it disappear, etc.
        // returns empty or the sceneName of the next scene to reproduce
        this.mentionQuote = data.mentionQuote // String, quote to describe when the player reachs a location with the npc and has not talked to him yet
        this.speech = data.speech; // String, resturns the string with the speech that the npc has to say depending on the model.
    }
}