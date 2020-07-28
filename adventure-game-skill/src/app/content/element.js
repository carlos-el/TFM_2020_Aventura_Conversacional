module.exports = class Element {
    constructor(data) {
        this.names = data.names; // Array of strings, stores how the element can be called by the player
        this.mentionQuote = data.mentionQuote; // String, tells the description of the element 
        this.inspectQuote = data.inspectQuote; // String, tells what is done when the element is inspected
        this.alreadyInspectedQuote = data.alreadyInspectedQuote; // String, tells what is done when the element is already inspected
        this.inspectActionTaken = data.inspectActionTaken; // Function for executing the effects of acting over the element
    }
}