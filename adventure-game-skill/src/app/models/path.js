module.exports = class Path {
    constructor(data) {
        // Each path several properties, only the "canGo" ,"goesTo" and the "problem" properties goes to the model
        // An element can be used to trigger the lock or unlock of a road.
        // For locking the road the element action should set "canGo" to false and set the appropiate "problem" number in the model
        this.goesTo = data.goesTo; // String, identifier that tells where the path goes to
        this.canGo = data.canGo; // Boolean, Tells if the player can go to this direction.
        this.problem = data.problem; // Number, If "canGo" is false, tells the number of the problem that is not letting the player go
        this.problemMentionQuotes = data.problemMentionQuotes; // Array of strings, each string tells the problem for crossing a path depending on the "problem" number
    }
}