module.exports = class Location {
    constructor(data) {
        this.names = data.names; // Array of strings, stores how the location can be called by the player (only needed if main == true)
        this.locationQuote = data.locationQuote; // String with the quote of where the location is
        this.storyQuote = data.storyQuote; // String with the quote about the story of the place
        this.main = data.main; // True or False depending if its a location where the player can travel to using fast travel
        this.elements = data.elements; // Funtion that returns the defult names of the elements in the location when the player discovers it for the first time
        this.npcs = data.npcs; // Funtion that returns the defult names of the actors in the location when the player discovers it for the first time
        this.objects = data.objects; // Funtion that returns the defult names of the objects in the location when the player discovers it for the first time
        this.to = { // TODO ?? another function that executes when trying to enter?
            N: "", // place id or name
            S: "",
            E: "",
            W: "",
        }
    }
}