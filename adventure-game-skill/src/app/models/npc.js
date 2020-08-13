module.exports = class Npc {
    constructor(data) {
        this.names = data.names; // Array of strings, names of the npc
        this.voice = data.voice // String, voice of the actor
        this.states = data.states; // Object, states of the npc
        this.merchant = data.merchant; //Object, defines the merchat qualities of the npc
    }
}