const _ = require('underscore');
const Player = require('./Player.js');

class Game {
    constructor(game) {
        this.players = {};
        this.messages = [];

        _.each(game.players, player => {
            this.players[player.id] = new Player(player);
        });

        this.name = game.name;
        this.id = game.id;
    }

    addMessage(message) {
        this.messages.push({ date: new Date(), message: message });
    }

    getState(activePlayer) {
        var playerState = {};

        _.each(this.players, player => {
            playerState[player.id] = player.getState(activePlayer === player.id);
        });

        return {
            name: this.name,
            players: playerState,
            messages: this.messages
        };
    }

    startGameIfAble() {
        if(_.all(this.players, player => {
            return player.readyToStart;
        })) {
            _.each(this.players, player => {
                player.startGame();
            });
        }
    }

    mulligan(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.mulligan();

        this.addMessage(player.name + ' has taken a mulligan');
    }

    keep(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.keep();
        this.addMessage(player.name + ' has kept their hand');
    }

    playCard(playerId, card) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.playCard(card);
    }

    checkForAttachments() {
        var playersWithAttachments = _.filter(this.players, p => {
            return p.hasUnmappedAttachments();
        });
        var playersWaiting = _.filter(this.players, p => {
            return !p.hasUnmappedAttachments();
        });

        if(playersWithAttachments.length !== 0) {
            _.each(playersWithAttachments, p => {
                p.menuTitle = 'Select attachment locations';
                p.buttons = [
                    { command: 'mapattachments', text: 'Done' }
                ];
                p.waitingForAttachments = true;
            });

            _.each(playersWaiting, p => {
                p.menuTitle = 'Waiting for opponent to finish setup';
                p.buttons = [];
            });
        } else {
            _.each(this.players, p => {
                p.startPlotPhase();
            });
        }
    }

    setupDone(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.setupDone();

        this.addMessage(player.name + ' has finished setup');

        if(!_.all(this.players, p => {
            return p.setup;
        })) {
            player.menuTitle = 'Waiting for opponent to finish setup';
            player.buttons = [];
        } else {
            this.checkForAttachments();
        }
    }

    selectFirstPlayer(highestPlayer) {
        highestPlayer.firstPlayer = true;
        highestPlayer.menuTitle = 'Select a first player';
        highestPlayer.buttons = [
            { command: 'firstplayer', text: 'Me', arg: 'me' }
        ];

        if(_.size(this.players) > 1) {
            highestPlayer.buttons.push({ command: 'firstplayer', text: 'Opponent', arg: 'opponent' });
        }

        var otherPlayer = _.find(this.players, player => {
            return player.id !== highestPlayer.id;
        });

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to select first player';
        }
    }

    selectPlot(playerId, plot) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.selectPlot(plot);

        this.addMessage(player.name + ' has selected a plot');

        if(!_.all(this.players, p => {
            return !!p.selectedPlot;
        })) {
            player.menuTitle = 'Waiting for opponent to select plot';
            player.buttons = [];
        } else {
            var highestPlayer = undefined;
            var highestInitiative = -1;
            _.each(this.players, p => {
                if(p.selectedPlot.card.initiative > highestInitiative) {
                    highestInitiative = p.selectedPlot.card.initiative;
                    highestPlayer = p;
                }

                p.revealPlots();
                if(p.activePlot.implementation && p.activePlot.implementation.revealed) {
                    p.activePlot.implementation.revealed(this, p,
                        p === highestPlayer ? () => this.selectFirstPlayer(highestPlayer) : undefined);
                } else if(p === highestPlayer) {
                    this.selectFirstPlayer(highestPlayer);
                }
            });
        }
    }

    setFirstPlayer(sourcePlayer, who) {
        var firstPlayer = undefined;

        var player = _.find(this.players, player => {
            return player.id === sourcePlayer;
        });

        _.each(this.players, player => {
            if(player.id === sourcePlayer && who === 'me') {
                player.firstPlayer = true;
                firstPlayer = player;
            } else if(player.id !== sourcePlayer && who !== 'me') {
                player.firstPlayer = true;
                firstPlayer = player;
            } else {
                player.firstPlayer = false;
            }

            player.drawPhase();
            player.menuTitle = '';
            player.buttons = [];
        });

        this.addMessage(player.name + ' has selected ' + firstPlayer.name + ' to be the first player');

        firstPlayer.beginMarshal();

        var otherPlayer = _.find(this.players, player => {
            return player.id !== firstPlayer.id;
        });

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to marshal their cards';
        }
    }

    cardClicked(sourcePlayer, card) {
        var player = _.find(this.players, player => {
            return player.id === sourcePlayer;
        });

        if(!player) {
            return;
        }

        if(player.activePlot && player.activePlot.implementation && player.activePlot.implementation.cardClicked) {
            if(player.activePlot.implementation.cardClicked(this, player, card)) {
                return;
            }
        }

        if(player.phase === 'setup' && !player.waitingForAttachments) {
            return;
        }

        if(player.selectedAttachment) {
            player.removeFromHand(player.selectedAttachment);
            player.attach(player.selectedAttachment, card);

            if(player.phase === 'setup') {
                this.checkForAttachments();
            } else {
                player.buttons = [{ command: 'donemarshal', text: 'Done' }];
                player.menuTitle = 'Marshal your cards';
            }

            return;
        }

        if(player.phase === 'challenge' && player.currentChallenge) {
            var cardInPlay = _.find(player.cardsInPlay, c => {
                return c.card.code === card.code;
            });

            if(!cardInPlay) {
                return;
            }

            if(cardInPlay.kneeled) {
                return;
            }

            player.addToChallenge(card);
            return;
        }

        if(player.phase === 'claim' && player.currentChallenge === 'military') {
            if(card.type_code !== 'character') {
                return;
            }

            player.killCharacter(card);

            if(player.claimToDo === 0) {
                player.doneClaim();

                var otherPlayer = _.find(this.players, p => {
                    return p.id !== player.id;
                });

                if(otherPlayer) {
                    otherPlayer.beginChallenge();
                }
            }

            return;
        }

        if(player.phase !== 'setup' || card.type_code !== 'attachment') {
            return;
        }

        player.selectedAttachment = card;
        player.selectCard = true;
        player.menuTitle = 'Select target for attachment';
    }

    showDrawDeck(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.showDrawDeck();

        this.addMessage(player.name + ' is looking at their deck');
    }

    drop(playerId, card, source, target) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        if(player.drop(card, source, target)) {
            this.addMessage(player.name + ' has moved a card from their ' + source + ' to their ' + target);
        }
    }

    marshalDone(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.marshalDone();

        this.addMessage(player.name + ' has finished marshalling');

        var unMarshalledPlayer = _.find(this.players, p => {
            return !p.marshalled;
        });

        if(unMarshalledPlayer) {
            player.menuTitle = 'Waiting for opponent to finish marshalling';
            player.buttons = [];

            unMarshalledPlayer.beginMarshal();
        } else {
            var firstPlayer = _.find(this.players, p => {
                return p.firstPlayer;
            });

            firstPlayer.beginChallenge();

            var otherPlayer = _.find(this.players, p => {
                return p.id !== firstPlayer.id;
            });

            if(otherPlayer) {
                otherPlayer.menuTitle = 'Waiting for other player to initiate challenge';
                otherPlayer.buttons = [];
            }
        }
    }

    startChallenge(playerId, challengeType) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.startChallenge(challengeType);
    }

    doneChallenge(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.doneChallenge();

        this.addMessage(player.name + ' has initiated a ' + player.currentChallenge + ' challenge with strength ' + player.challengeStrength);

        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        if(otherPlayer) {
            player.menuTitle = 'Waiting for other player to defend';
            player.buttons = [];

            otherPlayer.beginDefend(player.currentChallenge);
        }
    }

    doneDefend(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player.doneChallenge();

        this.addMessage(player.name + ' has defended with strength ' + player.challengeStrength);

        var challenger = _.find(this.players, p => {
            return p.id !== player.id;
        });

        var winner = undefined;
        var loser = undefined;

        if(challenger) {
            if(challenger.challengeStrength >= player.challengeStrength) {
                loser = player;
                winner = challenger;
            } else {
                loser = challenger;
                winner = player;
            }

            this.addMessage(winner.name + ' won a ' + winner.currentChallenge + '  challenge ' +
                winner.challengeStrength + ' vs ' + loser.challengeStrength);

            if(loser.challengeStrength === 0) {
                winner.power++;

                this.addMessage(winner.name + ' has gained 1 power from an unopposed challenge');
            }

            if(winner === challenger) {
                this.applyClaim(winner, loser);
            } else {
                challenger.beginChallenge();

                player.menuTitle = 'Waiting for other player to initiate challenge';
                player.buttons = [];
            }
        }
    }

    applyClaim(winner, loser) {
        var claim = winner.activePlot.card.claim;

        if(winner.currentChallenge === 'military') {
            winner.menuTitle = 'Waiting for opponent to apply claim effects';
            winner.buttons = [];

            loser.claimToDo = claim;
            loser.selectCharacterToKill();

            return;
        } else if(winner.currentChallenge === 'intrigue') {
            loser.discardAtRandom(claim);
        } else if(winner.currentChallenge === 'power') {
            if(loser.power > 0) {
                loser.power -= claim;
                winner.power += claim;
            }
        }

        loser.doneClaim();
        winner.beginChallenge();
    }

    doneChallenges(playerId) {
        var challenger = _.find(this.players, player => {
            return player.id === playerId;
        });

        challenger.doneChallenges = true;

        var other = _.find(this.players, p => {
            return !p.doneChallenges;
        });

        if(other) {
            other.beginChallenge();

            challenger.menuTitle = 'Waiting for other player to initiate challenge';
            challenger.buttons = [];
        } else {
            this.dominance();
        }
    }

    dominance() {
        var highestDominance = 0;
        var highestPlayer = undefined;

        _.each(this.players, player => {
            player.phase = 'dominance';
            var dominance = player.getDominance();

            if(dominance > highestDominance) {
                highestPlayer = player;
            }
        });

        this.addMessage(highestPlayer.name + ' wins dominance');

        highestPlayer.power++;

        _.each(this.players, player => {
            player.standCards();
            player.taxation();
        });

        var firstPlayer = _.find(this.players, p => {
            return p.firstPlayer;
        });

        firstPlayer.menuTitle = '';
        firstPlayer.buttons = [
            { command: 'doneround', text: 'End Turn' }
        ];

        var otherPlayer = _.find(this.players, p => {
            return p.id !== firstPlayer.id;
        });

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to end their turn';
            otherPlayer.buttons = [];
        }
    }

    doneRound(playerId) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        if(player.hand.length > player.activePlot.card.reserve) {
            return;
        }
        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        if(otherPlayer) {
            if(otherPlayer.roundDone) {
                player.startPlotPhase();
                otherPlayer.startPlotPhase();
            }
        } else {
            player.roundDone = true;
        }
    }

    changeStat(playerId, stat, value) {
        var player = _.find(this.players, player => {
            return player.id === playerId;
        });

        player[stat] += value;

        if(player[stat] < 0) {
            player[stat] = 0;
        } else {
            this.addMessage(player.name + ' sets ' + stat + ' to ' + player[stat] + ' (' + (value > 0 ? '+' : '') + value + ')');
        }
    }

    initialise() {
        _.each(this.players, player => {
            player.initialise();
        });
    }
}

module.exports = Game;
