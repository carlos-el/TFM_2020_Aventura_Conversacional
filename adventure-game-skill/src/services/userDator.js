const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = class UserDator {
    constructor(db) {
        this.db = db;
    }

    static async getDator(){
        // "config.mongodb.url" +"/"+ "config.mongodb.dbname"
        const database = await MongoClient.connect("mongodb://localhost:27017" + "/" + "adventure-game-skill");
        return new UserDator(database.db())
    }

    async getUserGame(userId) {
        // returns null if the object with the specified id does not exists
        const user = await this.db.collection("users").findOne({ userId: userId });
        if (user) {
            console.log("getUserGame: found")
            return user.game;
        } else {
            console.log("getUserGame: null")
            return null;
        }
    }

    async saveUserGame(userId, game) {
        // If the user is already in the database, update it.
        if (await this.db.collection('users').findOne({ userId: userId })) {
            await this.db.collection('users').updateOne({ userId: userId }, { $set: { game: game } })
        } else { // If it is not then insert it.
            await this.db.collection('users').insertOne({ userId: userId, game: game })
        }
    }

}

