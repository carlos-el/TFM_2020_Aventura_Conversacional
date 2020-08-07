module.exports = class Object {
    constructor(data) {
        this.names = data.names; // Array of strings, stores how the object can be called by the player
        this.isMale = data.isMale // Boolena, gender of the object for the suffic or articles
        this.mentionQuote = data.mentionQuote; // String, tells the description of the object 
        this.inspectQuote = data.inspectQuote; // String, tells what is done when the element is inspected
    }
}