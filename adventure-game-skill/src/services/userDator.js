const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports = class UserDator {
    static async get(voxaEvent) {
        const key = { userId: voxaEvent.user.userId };
        const client = new DynamoDB.DocumentClient();

        const item = await client
            .get({ Key: key, TableName: config.dynamoDB.tables.users })
            .promise();

        return new UserDator(item.Item);
    }

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
        const user = await this.db.collection('users').findOne({ userId: userId });
        if (user) {
            return user.game;
        } else {
            return null;
        }
    }

    async saveUserGame(userId, game) {
        // If the user is already in the database, update it.
        if (await this.db.collection('users').findOne({ userId: userId })) {
            await this.db.collection('users').updateOne({ userdId: userId }, { $set: { game: game } })
        } else { // If it is not then insert it.
            await this.db.collection('users').insertOne({ userdId: userId, game: game })
        }
    }

}

