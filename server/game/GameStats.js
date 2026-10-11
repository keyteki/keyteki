const { EVENTS } = require('./Events/types');

/**
 * Collects per-player statistics for a game by listening to resolved game events.
 * Stats stop being recorded once a winner has been declared, so games that carry
 * on after a win don't inflate the numbers.
 */
class GameStats {
    /**
     * @param {import('./game')} game
     */
    constructor(game) {
        this.game = game;
        this.players = {};

        const handlers = {
            [EVENTS.onCapture]: (event) => this.onCapture(event),
            [EVENTS.onCardDestroyed]: (event) => this.onCardDestroyed(event),
            [EVENTS.onCardPlayed]: (event) => this.onCardPlayed(event),
            [EVENTS.onChooseActiveHouse]: (event) => this.onChooseActiveHouse(event),
            [EVENTS.onDamageApplied]: (event) => this.onDamageApplied(event),
            [EVENTS.onDrawCards]: (event) => this.onDrawCards(event),
            [EVENTS.onFight]: (event) => this.onFight(event),
            [EVENTS.onForgeKey]: (event) => this.onForgeKey(event),
            [EVENTS.onModifyAmber]: (event) => this.onModifyAmber(event),
            [EVENTS.onReap]: (event) => this.onReap(event),
            [EVENTS.onStealAmber]: (event) => this.onStealAmber(event)
        };

        for (const [eventName, handler] of Object.entries(handlers)) {
            game.on(eventName, (event) => {
                if (event.cancelled || this.game.winner) {
                    return;
                }

                handler(event);
            });
        }
    }

    /**
     * @param {import('./player')} player
     */
    forPlayer(player) {
        if (!player || !player.name) {
            return null;
        }

        if (!this.players[player.name]) {
            this.players[player.name] = {
                amberCaptured: 0,
                amberFromReaping: 0,
                amberGained: 0,
                amberLost: 0,
                amberSpentOnKeys: 0,
                amberStolen: 0,
                cards: {},
                cardsDrawn: 0,
                cardsPlayed: 0,
                cardsPlayedByType: {},
                creaturesLost: 0,
                damageDealt: 0,
                enemyCreaturesDestroyed: 0,
                fights: 0,
                housesChosen: {},
                keysForged: 0,
                reaps: 0
            };
        }

        return this.players[player.name];
    }

    /**
     * @param {import('./player')} player
     * @param {import('./Card')} card
     */
    forCard(player, card) {
        const stats = this.forPlayer(player);
        if (!stats || !card || !card.id) {
            return null;
        }

        if (!stats.cards[card.id]) {
            stats.cards[card.id] = { fights: 0, played: 0, reaps: 0 };
        }

        return stats.cards[card.id];
    }

    onCapture(event) {
        const stats = this.forPlayer(event.card.controller);
        if (stats) {
            stats.amberCaptured += event.amount;
        }
    }

    onCardDestroyed(event) {
        if (event.card.type !== 'creature') {
            return;
        }

        const controller = event.card.controller;
        const lost = this.forPlayer(controller);
        if (lost) {
            lost.creaturesLost++;
        }

        const opponent = this.forPlayer(controller && controller.opponent);
        if (opponent) {
            opponent.enemyCreaturesDestroyed++;
        }
    }

    onCardPlayed(event) {
        const stats = this.forPlayer(event.player);
        if (!stats) {
            return;
        }

        stats.cardsPlayed++;
        stats.cardsPlayedByType[event.card.type] =
            (stats.cardsPlayedByType[event.card.type] || 0) + 1;
        this.forCard(event.player, event.card).played++;
    }

    onChooseActiveHouse(event) {
        const stats = this.forPlayer(event.player);
        if (stats) {
            stats.housesChosen[event.house] = (stats.housesChosen[event.house] || 0) + 1;
        }
    }

    onDamageApplied(event) {
        // Credit the damage to whoever controls the source, falling back to the player
        // resolving the ability (e.g. bonus icons). Damage to your own creatures doesn't count.
        const source = event.damageSource;
        const dealer = (source && source.controller) || (event.context && event.context.player);
        if (!dealer || dealer === event.card.controller) {
            return;
        }

        const stats = this.forPlayer(dealer);
        if (stats) {
            stats.damageDealt += event.amount;
        }
    }

    onDrawCards(event) {
        const stats = this.forPlayer(event.player);
        if (stats && event.amount > 0) {
            stats.cardsDrawn += event.amount;
        }
    }

    onFight(event) {
        const stats = this.forPlayer(event.attacker.controller);
        if (!stats) {
            return;
        }

        stats.fights++;
        this.forCard(event.attacker.controller, event.attacker).fights++;
    }

    onForgeKey(event) {
        const stats = this.forPlayer(event.player);
        if (!stats) {
            return;
        }

        stats.keysForged++;
        stats.amberSpentOnKeys += event.amberSpent || 0;
    }

    onModifyAmber(event) {
        const stats = this.forPlayer(event.player);
        if (!stats) {
            return;
        }

        if (event.loseAmber) {
            stats.amberLost += event.amount;
        } else if (event.amount > 0) {
            stats.amberGained += event.amount;
            if (event.reap) {
                stats.amberFromReaping += event.amount;
            }
        } else {
            stats.amberLost -= event.amount;
        }
    }

    onReap(event) {
        const stats = this.forPlayer(event.card.controller);
        if (!stats) {
            return;
        }

        stats.reaps++;
        this.forCard(event.card.controller, event.card).reaps++;
    }

    onStealAmber(event) {
        const stats = this.forPlayer(event.player.opponent);
        if (stats) {
            stats.amberStolen += event.amount;
        }
    }

    /**
     * @param {import('./player')} player
     */
    getPlayerStats(player) {
        const stats = this.forPlayer(player);

        return Object.assign({}, stats, {
            manualModeUsed: !!this.game.manualModeUsed,
            turns: player.turn
        });
    }
}

module.exports = GameStats;
