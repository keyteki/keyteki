const uuid = require('uuid');
const _ = require('underscore');
const crypto = require('crypto');

const GameChat = require('./game/gamechat.js');
const logger = require('./log');

class PendingGame {
    constructor(owner, details) {
        this.adaptive = details.adaptive;
        this.allowSpectators = details.allowSpectators;
        this.challonge = details.challonge;
        this.createdAt = new Date();
        this.expansions = details.expansions;
        this.gameChat = new GameChat();
        this.gameFormat = details.gameFormat;
        this.gamePrivate = !!details.gamePrivate;
        this.gameTimeLimit = details.gameTimeLimit;
        this.gameType = details.gameType;
        this.hideDecklists = details.hideDecklists;
        this.id = uuid.v1();
        this.muteSpectators = details.muteSpectators;
        this.name = details.name;
        this.node = {};
        this.owner = owner;
        this.players = {};
        this.previousWinner = details.previousWinner;
        this.showHand = details.showHand;
        this.spectators = {};
        this.started = false;
        this.swap = !!details.swap;
        this.useGameTimeLimit = details.useGameTimeLimit;
        this.rematch = false;
        this.tournament = details.tournament;
    }

    // Getters
    getPlayersAndSpectators() {
        return Object.assign({}, this.players, this.spectators);
    }

    getPlayers() {
        return this.players;
    }

    getSpectators() {
        return Object.values(this.spectators);
    }

    getPlayerOrSpectator(playerName) {
        return this.getPlayersAndSpectators()[playerName];
    }

    getPlayerByName(playerName) {
        return this.players[playerName];
    }

    getSaveState() {
        let players = _.map(this.getPlayers(), (player) => {
            return {
                houses: player.houses,
                name: player.name,
                wins: player.wins
            };
        });

        return {
            adaptive: this.adaptive,
            challonge: this.challonge,
            expansions: this.expansions,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameId: this.id,
            gameType: this.gameType,
            players: players,
            previousWinner: this.previousWinner,
            startedAt: this.createdAt,
            swap: this.swap
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
        if (!user) {
            logger.error('Tried to add a player to a game that did not have a user object');
            return;
        }

        this.players[user.username] = {
            id: id,
            name: user.username,
            owner: this.owner.username === user.username,
            user: user,
            wins: 0
        };
    }

    addSpectator(id, user) {
        this.spectators[user.username] = {
            emailHash: user.emailHash,
            id: id,
            name: user.username,
            user: user
        };
    }

    newGame(id, user, password, join) {
        if (password) {
            this.password = crypto.createHash('md5').update(password).digest('hex');
        }

        if (join) {
            this.addPlayer(id, user);
        }
    }

    isUserBlocked(user) {
        return _.contains(this.owner.blockList, user.username.toLowerCase());
    }

    join(id, user, password) {
        if (_.size(this.players) === 2 || this.started) {
            return 'Game full';
        }

        if (this.isUserBlocked(user)) {
            return 'Cannot join game';
        }

        if (this.password) {
            if (crypto.createHash('md5').update(password).digest('hex') !== this.password) {
                return 'Incorrect game password';
            }
        }

        this.addMessage('{0} has joined the game', user.username);
        this.addPlayer(id, user);

        if (!this.isOwner(this.owner.username)) {
            let otherPlayer = Object.values(this.players).find(
                (player) => player.name !== this.owner.username
            );

            if (otherPlayer) {
                this.owner = otherPlayer.user;
                otherPlayer.owner = true;
            }
        }

        return undefined;
    }

    watch(id, user, password) {
        if (user && user.permissions && user.permissions.canManageGames) {
            this.addSpectator(id, user);
            this.addMessage('{0} has joined the game as a spectator', user.username);

            return;
        }

        if (!this.allowSpectators) {
            return 'Join not permitted';
        }

        if (this.isUserBlocked(user)) {
            return 'Cannot join game';
        }

        if (this.password) {
            if (crypto.createHash('md5').update(password).digest('hex') !== this.password) {
                return 'Incorrect game password';
            }
        }

        this.addSpectator(id, user);
        this.addMessage('{0} has joined the game as a spectator', user.username);
    }

    leave(playerName) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        if (!this.started) {
            this.addMessage('{0} has left the game', playerName);
        }

        if (this.players[playerName]) {
            if (this.started) {
                this.players[playerName].left = true;
            } else {
                this.removeAndResetOwner(playerName);

                delete this.players[playerName];
            }
        }

        if (this.spectators[playerName]) {
            delete this.spectators[playerName];
        }
    }

    disconnect(playerName) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        if (!this.started) {
            this.addMessage('{0} has disconnected', playerName);
        }

        if (this.players[playerName]) {
            if (!this.started) {
                this.removeAndResetOwner(playerName);

                delete this.players[playerName];
            }
        } else {
            delete this.spectators[playerName];
        }
    }

    chat(playerName, message) {
        let player = this.getPlayerOrSpectator(playerName);
        if (!player) {
            return;
        }

        player.argType = 'player';

        this.addMessage('{0} {1}', player, message);
    }

    selectDeck(playerName, deck) {
        var player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        if (player.deck) {
            player.deck.selected = false;
        }

        player.deck = deck;
        player.deck.selected = true;

        this.setupFaction(player, deck.faction);
    }

    // interrogators
    isEmpty() {
        return !_.any(this.getPlayersAndSpectators(), (player) =>
            this.hasActivePlayer(player.name)
        );
    }

    isOwner(playerName) {
        let player = this.players[playerName];

        if (!player || !player.owner) {
            return false;
        }

        return true;
    }

    removeAndResetOwner(playerName) {
        if (this.isOwner(playerName)) {
            let otherPlayer = _.find(this.players, (player) => player.name !== playerName);

            if (otherPlayer) {
                this.owner = otherPlayer.user;
                otherPlayer.owner = true;
            }
        }
    }

    hasActivePlayer(playerName) {
        return (
            (this.players[playerName] &&
                !this.players[playerName].left &&
                !this.players[playerName].disconnected) ||
            this.spectators[playerName]
        );
    }

    isVisibleFor(user) {
        if (!user) {
            return true;
        }

        if (user.permissions && user.permissions.canManageGames) {
            return true;
        }

        if (this.gamePrivate && !this.started) {
            return user.permissions && user.permissions.canManageTournaments && this.tournament;
        }

        let players = Object.values(this.players);
        return (
            !this.owner.hasUserBlocked(user) &&
            !user.hasUserBlocked(this.owner) &&
            players.every((player) => !player.user.hasUserBlocked(user))
        );
    }

    // Summary
    getSummary(activePlayer) {
        let playerSummaries = {};
        let playersInGame = _.filter(this.players, (player) => !player.left);

        _.each(playersInGame, (player) => {
            let deck;

            if (activePlayer === player.name && player.deck && this.gameFormat !== 'sealed') {
                deck = {
                    name: player.deck.name,
                    selected: player.deck.selected,
                    status: player.deck.status
                };
            } else if (player.deck) {
                deck = { selected: player.deck.selected, status: player.deck.status };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                deck: activePlayer ? deck : {},
                houses: this.started && player.deck ? player.deck.houses : [],
                id: player.id,
                left: player.left,
                name: player.name,
                owner: player.owner,
                role: player.user.role,
                wins: player.wins
            };
        });

        return {
            adaptive: this.adaptive,
            allowSpectators: this.allowSpectators,
            challonge: this.challonge,
            createdAt: this.createdAt,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            id: this.id,
            messages: activePlayer ? this.gameChat.messages : undefined,
            muteSpectators: this.muteSpectators,
            name: this.name,
            needsPassword: !!this.password,
            node: this.node ? this.node.identity : undefined,
            owner: this.owner.username,
            players: playerSummaries,
            previousWinner: this.previousWinner,
            showHand: this.showHand,
            started: this.started,
            swap: this.swap,
            spectators: Object.values(this.spectators).map((spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            }),
            useGameTimeLimit: this.useGameTimeLimit
        };
    }

    getStartGameDetails() {
        const players = {};

        for (let playerDetails of Object.values(this.players)) {
            const { name, user, ...rest } = playerDetails;
            players[name] = {
                name,
                user: user.getDetails(),
                ...rest
            };
        }

        const spectators = {};
        for (let spectatorDetails of Object.values(this.spectators)) {
            const { name, user, ...rest } = spectatorDetails;
            spectators[name] = {
                name,
                user: user.getDetails(),
                ...rest
            };
        }

        return {
            adaptive: this.adaptive,
            allowSpectators: this.allowSpectators,
            challonge: this.challonge,
            createdAt: this.createdAt,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameTimeLimit: this.gameTimeLimit,
            gameType: this.gameType,
            hideDecklists: this.hideDecklists,
            id: this.id,
            muteSpectators: this.muteSpectators,
            name: this.name,
            needsPassword: !!this.password,
            owner: this.owner.getDetails(),
            players,
            previousWinner: this.previousWinner,
            showHand: this.showHand,
            spectators,
            started: this.started,
            swap: this.swap,
            useGameTimeLimit: this.useGameTimeLimit
        };
    }
}

module.exports = PendingGame;
