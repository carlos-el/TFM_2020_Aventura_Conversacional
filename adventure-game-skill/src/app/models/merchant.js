module.exports = class Merchant {
    constructor(data) {
        this.locations = data.locations; // Array of strings,constains the locations where the merchant sells 
        this.states = data.states; // Object, contains the goods that the merchant sells based on the merchant state
    }
}