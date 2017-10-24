const uuid = require('uuid');
const _ = require('underscore');
const bcrypt = require('bcryptjs');

const logger = require('./log.js');
const GameChat = require('./game/gamechat.js');

class PendingGame {
    constructor(owner, details) {
        this.owner = owner;
        this.players = {};
        this.spectators = {};
        this.id = uuid.v1();
        this.name = details.name;
        this.allowSpectators = details.spectators;
        this.gameType = details.gameType;
        this.isMelee = details.isMelee;
        this.createdAt = new Date();
        this.gameChat = new GameChat();
    }

    // Getters
    getPlayersAndSpectators() {
        return Object.assign({}, this.players, this.spectators);
    }

    getPlayers() {
        return this.players;
    }

    getPlayerOrSpectator(playerName) {
        return this.getPlayersAndSpectators()[playerName];
    }

    getPlayerByName(playerName) {
        return this.players[playerName];
    }

    getSaveState() {
        var players = _.map(this.getPlayers(), player => {
            return {
                faction: player.faction.name,
                name: player.name
            };
        });

        return {
            gameId: this.id,
            gameType: this.gameType,
            players: players,
            startedAt: this.createdAt
        };
    }

    // Helpers
    setupFaction(player, faction) {
        player.faction = {};
        player.faction = faction;
    }

    // Actions
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    addPlayer(id, user) {
        this.players[user.username] = {
            id: id,
            name: user.username,
            user: user,
            emailHash: user.emailHash,
            owner: this.owner.username === user.username
        };
    }

    addSpectator(id, user) {
        this.spectators[user.username] = {
            id: id,
            name: user.username,
            user: user,
            emailHash: user.emailHash
        };
    }

    newGame(id, user, password, callback) {
        if(password) {
            bcrypt.hash(password, 10, (err, hash) => {
                if(err) {
                    logger.info(err);

                    callback(err);

                    return;
                }

                this.password = hash;
                this.addPlayer(id, user);

                callback();
            });
        } else {
            this.addPlayer(id, user);

            callback();
        }
    }

    isUserBlocked(user) {
        return _.contains(this.owner.blockList, user.username.toLowerCase());
    }

    join(id, user, password, callback) {
        if(_.size(this.players) === 2 || this.started) {
            return;
        }

        if(this.isUserBlocked(user)) {
            return;
        }

        if(this.password) {
            bcrypt.compare(password, this.password, (err, valid) => {
                if(err) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                if(!valid) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                this.addPlayer(id, user);

                callback();
            });
        } else {
            this.addPlayer(id, user);

            callback();
        }
    }

    watch(id, user, password, callback) {
        if(!this.allowSpectators) {
            callback(new Error('Join not permitted'));

            return;
        }

        if(this.isUserBlocked(user)) {
            return;
        }

        if(this.password) {
            bcrypt.compare(password, this.password, (err, valid) => {
                if(err) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                if(!valid) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                this.addSpectator(id, user);

                this.addMessage('{0} has joined the game as a spectator', user.username);
                callback();
            });
        } else {
            this.addSpectator(id, user);

            this.addMessage('{0} has joined the game as a spectator', user.username);

            callback();
        }
    }

    leave(playerName) {
        var player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        if(!this.started) {
            this.addMessage('{0} has left the game', playerName);
        }

        if(this.players[playerName]) {
            if(this.started) {
                this.players[playerName].left = true;
            } else {
                delete this.players[playerName];
            }
        }

        if(this.spectators[playerName]) {
            delete this.spectators[playerName];
        }
    }

    disconnect(playerName) {
        var player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        if(!this.started) {
            this.addMessage('{0} has disconnected', playerName);
        }

        if(this.players[playerName]) {
            if(!this.started) {
                delete this.players[playerName];
            }
        } else {
            delete this.spectators[playerName];
        }
    }

    chat(playerName, message) {
        var player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} {1}', player, message);
    }

    selectDeck(playerName, deck) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(player.deck) {
            player.deck.selected = false;
        }

        player.deck = deck;
        player.deck.selected = true;

        this.setupFaction(player, deck.faction);
    }

    // interrogators
    isEmpty() {
        return !_.any(this.getPlayersAndSpectators(), player => this.hasActivePlayer(player.name));
    }

    isOwner(playerName) {
        var player = this.players[playerName];

        if(!player || !player.owner) {
            return false;
        }

        return true;
    }

    hasActivePlayer(playerName) {
        return this.players[playerName] && !this.players[playerName].left && !this.players[playerName].disconnected || this.spectators[playerName];
    }

    // Summary
    getSummary(activePlayer) {
        var playerSummaries = {};
        var playersInGame = _.filter(this.players, player => !player.left);

        _.each(playersInGame, player => {
            var deck = undefined;

            if(activePlayer === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected, status: player.deck.status };
            } else if(player.deck) {
                deck = { selected: player.deck.selected, status: player.deck.status };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                agenda: this.started && player.agenda ? player.agenda.cardData.code : undefined,
                deck: activePlayer ? deck : {},
                emailHash: player.emailHash,
                faction: this.started && player.faction ? player.faction.value : undefined,
                id: player.id,
                left: player.left,
                name: player.name,
                owner: player.owner,
                settings: player.user ? player.user.settings : {}
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameType: this.gameType,
            id: this.id,
            messages: activePlayer ? this.gameChat.messages : undefined,
            name: this.name,
            needsPassword: !!this.password,
            node: this.node ? this.node.identity : undefined,
            owner: this.owner.username,
            players: playerSummaries,
            started: this.started,
            spectators: _.map(this.spectators, spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name,
                    emailHash: spectator.emailHash,
                    settings: spectator.settings
                };
            })
        };
    }
}

module.exports = PendingGame;
