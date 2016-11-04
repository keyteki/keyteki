var _ = require('underscore');

var plots = {};

function hasTrait(card, trait) {
    return card.traits.indexOf(trait + '.') !== -1;
}

// 01001 - A Clash Of Kings
plots['01001'] = {
    register(game, player) {
        this.player = player;

        game.on('afterChallenge', this.afterChallenge.bind(this));
    },
    afterChallenge: function(game, challengeType, winner, loser) {
        if(winner === this.player && challengeType === 'power' && loser.power > 0) {
            loser.power--;
            winner.power++;

            game.addMessage(winner.name + ' uses ' + winner.activePlot.card.label + ' to move 1 power from ' + loser.name + '\'s faction card');
        }
    }
};

// 01004 - A Noble Cause
plots['01004'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
        game.on('beforeCardPlayed', this.beforeCardPlayed.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        this.abilityUsed = false;
    },
    beforeCardPlayed: function(game, player, card) {
        if(player !== this.player) {
            return;
        }

        if(!this.abilityUsed && (hasTrait(card, 'Lord') || hasTrait(card, 'Lady')) && card.cost > 0) {
            this.card = card;
            card.cost -= 2;
            this.cost = card.cost;
            
            if(card.cost < 0) {
                card.cost = 0;
            }

            this.abilityUsed = true;

            game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to reduce the cost of ' + card.label + ' by 2');
        }
    },
    afterCardPlayed: function(game, player, card) {
        if(this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }
};

// 01008 - Calm Over Westeros
plots['01008'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
        game.on('customCommand', this.challengeTypeSelected.bind(this));
        game.on('beforeClaim', this.beforeClaim.bind(this));
        game.on('afterClaim', this.afterClaim.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        player.menuTitle = 'Select a challenge type';
        player.buttons = [
            { text: 'Military', command: 'custom', arg: 'military' },
            { text: 'Intrigue', command: 'custom', arg: 'intrigue' },
            { text: 'Power', command: 'custom', arg: 'power' }
        ];

        game.pauseForPlot = true;
    },
    challengeTypeSelected: function(game, player, arg) {
        if(player !== this.player) {
            return;
        }

        this.challengeType = arg;

        game.revealDone(player);
    },
    beforeClaim: function(game, challengeType, winner, loser) {
        if(winner === this.player) {
            return;
        }

        if(challengeType !== this.challengeType) {
            return;
        }

        this.claim = winner.activePlot.card.claim;
        winner.activePlot.card.claim--;

        game.addMessage(loser.name + ' uses ' + loser.activePlot.card.label + ' to reduce the claim value of ' + 
            winner.name + "'s " + challengeType + 'challenge to ' + winner.activePlot.card.claim);
    },
    afterClaim: function(game, challengeType, winner) {
        if(winner === this.player) {
            return;
        }

        if(challengeType !== this.challengeType) {
            return;
        }

        winner.activePlot.card.claim = this.claim;
    }
};

// 01009 - Confiscation
plots['01009'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
        game.on('cardClicked', this.cardClicked);
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        if(!_.any(game.players, p => {
            return _.any(p.cardsInPlay, card => {
                return card.attachments.length > 0;
            });
        })) {
            return;
        }

        player.menuTitle = 'Select attachment to discard';
        player.buttons = [];

        player.selectCard = true;
        game.pauseForPlot = true;
    },

    cardClicked: function(game, player, clicked) {
        if(player !== this.player) {
            return;
        }

        if(clicked.type_code !== 'attachment') {
            return;
        }

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to discard ' + clicked.label);

        player.selectCard = false;
        game.clickHandled = true;

        game.revealDone(player);
    }
};

// 01010 - Counting coppers
plots['01010'] = {
    register: function(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        player.drawCardsToHand(3);

        game.addMessage(player.name + ' draws 3 cards from ' + player.activePlot.card.label);
    }
};

// 01021 - Sneak Attack
plots['01021'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        player.challenges.maxTotal = 1;

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + 
            ' to make the maximum number of challenges able to be initiated by ' + player.name + ' this round be 1');
    }
};

// 02039 - Trading with the Pentoshi
plots['02039'] = {
    register(game, player) {
        this.player = player;

        game.on('plotRevealed', this.revealed.bind(this));
    },
    revealed: function(game, player) {
        if(player !== this.player) {
            return;
        }

        var otherPlayer = _.find(game.players, p => {
            return p.id !== player.id;
        });

        if(otherPlayer) {
            otherPlayer.gold += 3;

            game.addMessage(otherPlayer.name + ' gains 3 gold from ' + player.activePlot.card.label);
        }
    }
};

module.exports = plots;
