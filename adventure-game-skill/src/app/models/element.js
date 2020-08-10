module.exports = class Element {
    constructor(data) {
        this.names = data.names; // Array of strings, stores how the element can be called by the player
        this.mentionQuote = data.mentionQuote; // String, tells the description of the element 
        this.mentionAlreadyInspectedQuote = data.mentionAlreadyInspectedQuote // String, tells the description of the element if was already inspected
        this.inspectQuote = data.inspectQuote; // String, tells what is done when the element is inspected
        this.alreadyInspectedQuote = data.alreadyInspectedQuote; // String, tells what is done when the element is already inspected
        this.useObjectQuote = data.useObjectQuote // String, tells what happens when an object is used in the lement successfully
        this.inspectActionTaken = data.inspectActionTaken; // Function for executing the effects of acting over the element, returns empty or the scene to go after inspecting the element
        this.useObjectActionTaken = data.useObjectActionTaken; // Function for executing when an object is used over the element. Returns false if the action can not be performed true if it could or a scene name to be the next scene
    }
}