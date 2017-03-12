const uuid = require('uuid');
const _ = require('underscore');

const GameChat = require('./game/gamechat.js');

class PendingGame {
    constructor(owner, details) {
        this.owner = owner.username;
        this.players = {};
        this.spectators = {};
        this.id = uuid.v1();
        this.name = details.name;
        this.allowSpectators = details.spectators;
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
                name: player.name,
                faction: player.faction.name,
                agenda: player.agenda ? player.agenda.name : undefined
            };
        });

        return {
            id: this.savedGameId,
            startedAt: this.startedAt,
            players: players
        };
    }

    // Helpers
    setupFaction(player, faction) {
        player.faction = {};
        player.faction.cardData = faction;
        player.faction.cardData.code = faction.value;
        player.faction.cardData.type_code = 'faction';
        player.faction.cardData.strength = 0;
    }

    // Actions
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    join(id, user) {
        if(_.size(this.players) === 2) {
            return false;
        }

        this.players[user.username] = {
            id: id,
            name: user.username,
            user: user,
            owner: this.owner === user.username
        };

        return true;
    }

    watch(id, user) {
        if(!this.allowSpectators) {
            return false;
        }

        this.spectators[user.username] = {
            id: id,
            name: user.username,
            user: user
        };

        if(this.started) {
            return true;
        }

        this.addMessage('{0} has joined the game as a spectator', user.username);

        return true;
    }

    leave(playerName) {
        var player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} has left the game', playerName);

        if(this.players[playerName]) {
            delete this.players[playerName];
        } else {
            delete this.spectators[playerName];
        }
    }

    disconnect(playerName) {
        var player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} has disconnected', playerName);

        if(this.players[playerName]) {
            delete this.players[playerName];
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
        return _.isEmpty(this.players) && _.isEmpty(this.spectators);
    }

    isOwner(playerName) {
        var player = this.players[playerName];

        if(!player || !player.owner) {
            return false;
        }

        return true;
    }

    // Summary
    getSummary(activePlayer) {
        var playerSummaries = {};

        _.each(this.players, player => {
            var deck = undefined;

            if(activePlayer === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                agenda: player.agenda ? player.agenda.code : undefined,
                deck: deck,
                emailHash: player.user.emailHash,
                faction: player.faction ? player.faction.code : undefined,
                id: player.id,
                left: player.left,
                name: player.user.username,
                owner: player.owner
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            id: this.id,
            messages: this.gameChat.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            started: this.started,
            spectators: _.map(this.spectators, spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            })
        };
    }
}

module.exports = PendingGame;
