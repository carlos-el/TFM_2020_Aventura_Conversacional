module.exports = class Merchant {
    constructor(data) {
        this.locations = data.locations; // Function, returns the location where the merchant sells based on his state
        this.states = data.states; // Function, returns the goods that the merchant sells based on the merchant state
    }
}