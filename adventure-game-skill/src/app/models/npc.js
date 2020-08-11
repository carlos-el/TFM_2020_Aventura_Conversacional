module.exports = class Npc {
    constructor(data) {
        this.name = data.name; // String, name of the npc
        this.voice = data.voice // String, voice of the actor
        this.states = data.states; // Object, states of the npc
    }
}