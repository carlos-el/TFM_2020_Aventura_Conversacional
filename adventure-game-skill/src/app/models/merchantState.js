module.exports = class MerchantState {
    constructor(data) {
        this.goods = data. goods; // Object, Goods that the merchant sells in this state
        this.speech = data.speech; // Fuction, resturns the string with the speech that the npc has to say depending on the merchant state.
    }
}