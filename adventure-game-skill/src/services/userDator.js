const MongoClient = require('mongodb').MongoClient;
const notificationSender = require('./trapNotificationSender');
const config = require('../config');

module.exports = class UserDator {
    constructor(db) {
        this.db = db;
    }

    static async getDator() {
        const database = await MongoClient.connect(config.db.url + config.db.port.toString() + config.db.path);

        return new UserDator(database.db())
    }

    async getUserIdentifier(userId){
        const user = await this.db.collection("users").findOne({ userId: userId });
        if(user){
            return user._id.toString()
        } else {
            return "inexistente. Comience una partida para crear uno. Puede consultarlo siempre que quiera en este tutorial."
        }
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
        const user = await this.db.collection('users').findOne({ userId: userId })
        if (user) {
            let quantity = 0;
            // if we can get the quantity then set it
            if ("tom" in game.merchants) {
                if (game.merchants["tom"]["bought"]["pack"]) {
                    quantity = game.merchants["tom"]["bought"]["pack"]
                }
            }

            // If an user has a trap he must be already in the DB so we get the user traps and send the notifications
            let traps = user.traps
            var trapName = ""
            for (trapName in traps) {
                // if the notification was not sent for this trap
                if (!traps[trapName].notificationSent) {
                    traps[trapName].notificationSent = true
                    const trapHours = parseInt(traps[trapName].trapObjectUsed.substr(traps[trapName].trapObjectUsed.length - 3, 2));
                    notificationSender.sendTrapNotification(user.userId, new Date(traps[trapName].timeSet + (trapHours * 3600000)))
                }
            }

            // Update database with new game, camp level and traps notifications sent.
            await this.db.collection('users').updateOne({ userId: userId }, { $set: { game: game, campQuantity: quantity, traps: traps } })
        } else { // If it is not then insert it.
            let quantity = 0;
            // if we can get the quantity then set it
            if ("tom" in game.merchants) {
                if (game.merchants["tom"]["bought"]["pack"]) {
                    quantity = game.merchants["tom"]["bought"]["pack"]
                }
            }
            await this.db.collection('users').insertOne({ userId: userId, game: game, traps: {}, campQuantity: quantity })

        }
    }

    async saveUserAlternativeGame(userId, game, lastState) {
        // If the user is already in the database, update it.
        if (await this.db.collection('users').findOne({ userId: userId })) {
            console.log("Saving alternative game")
            await this.db.collection('users').updateOne({ userId: userId }, { $set: { alternativeGame: { game: game, lastState: lastState } } })
        } else { // If it is not then insert it.
            await this.db.collection('users').insertOne({ userId: userId, game: null, alternativeGame: { game: game, lastState: lastState } })
        }
    }

    async removeUserAlternativeGame(userId) {
        // If the user is already in the database, update it.
        if (await this.db.collection('users').findOne({ userId: userId })) {
            console.log("Removing alternative game")
            await this.db.collection('users').updateOne({ userId: userId }, { $set: { alternativeGame: null } })
        }
        // If it is not then do nothing.  
    }

    async getUserAlternativeGame(userId) {
        // returns null if the object with the specified id does not exists
        const user = await this.db.collection("users").findOne({ userId: userId });
        if (user) {
            console.log("getUserAlternativeGame: found")
            return user.alternativeGame;
        } else {
            console.log("getUserAlternativeGame: null")
            return null;
        }
    }

    async saveUserTrapSet(userId, elementWithTrap, trapObjectUsed, elementToReplace, timeSet) {
        const user = await this.db.collection("users").findOne({ userId: userId });
        // If the user is in the database, update it.
        if (user) {
            console.log("Saving trap use")
            let userTraps = user.traps;
            // if the user has already traps add the trap and update the database
            if (userTraps) {
                userTraps[elementWithTrap] = { trapObjectUsed: trapObjectUsed, elementToReplace: elementToReplace, timeSet: timeSet, notificationSent: false };
                await this.db.collection('users').updateOne({ userId: userId }, { $set: { traps: userTraps } })
            } else {
                //In other case just set the new trap
                let traps = {};
                traps[elementWithTrap] = { trapObjectUsed: trapObjectUsed, elementToReplace: elementToReplace, timeSet: timeSet, notificationSent: false };
                await this.db.collection('users').updateOne({ userId: userId }, { $set: { traps: traps } })
            }
        } else { // If it is not then insert it.
            console.log("Saving trap use without user being in the database")
            // Just save the trap, the next time adding a trap the user will be already in the database
            let traps = {};
            traps[elementWithTrap] = { trapObjectUsed: trapObjectUsed, elementToReplace: elementToReplace, timeSet: timeSet, notificationSent: false };
            await this.db.collection('users').insertOne({ userId: userId, game: null, traps: traps, campQuantity: 0 })
        }
    }

    async getUserTrapSet(userId, elementWithTrap) {
        const user = await this.db.collection("users").findOne({ userId: userId });
        // If the user is  in the database
        if (user) {
            if (user.traps) {
                console.log("Getting trap: found")
                return user.traps[elementWithTrap];
            }

            console.log("Getting trap: null")
            return null;
        } else {
            console.log("Getting trap: null")
            return null;
        }
    }

    async removeUserTrapSet(userId, elementWithTrap) {
        const user = await this.db.collection("users").findOne({ userId: userId });
        // If the user is already in the database, remove the trap.
        if (user) {
            let userTraps = user.traps;
            // if the user has already traps add the trap and update the database
            if (userTraps) {
                delete userTraps[elementWithTrap];
                await this.db.collection('users').updateOne({ userId: userId }, { $set: { traps: userTraps } })
            }
        }
        // in other case do nothing
    }

    async clearUserTrapSet(userId) {
        const user = await this.db.collection("users").findOne({ userId: userId });
        // If the user is already in the database, remove all traps.
        if (user) {
            await this.db.collection('users').updateOne({ userId: userId }, { $set: { traps: null } })
        }
        // in other case do nothing
    }
}

