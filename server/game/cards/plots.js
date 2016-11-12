var _ = require('underscore');

var plots = {};

function hasTrait(card, trait) {
    return card.traits.indexOf(trait + '.') !== -1;
}

// 01001 - A Clash Of Kings
class AClashOfKings {
    constructor(player) {
        this.player = player;
        this.afterChallenge = this.afterChallenge.bind(this);
    }

    afterChallenge(game, challengeType, winner, loser) {
        if(winner === this.player && challengeType === 'power' && loser.power > 0) {
            game.addMessage(winner.name + ' uses ' + winner.activePlot.card.label + ' to move 1 power from ' + loser.name + '\'s faction card');
            game.transferPower(winner, loser, 1);
        }
    }
}
plots['01001'] = {
    register(game, player) {
        var plot = new AClashOfKings(player);
        game.playerPlots[player.id] = plot;

        game.on('afterChallenge', plot.afterChallenge);
    },
    unregister(game, player) {
        game.removeListener('afterChallenge', game.playerPlots[player.id].afterChallenge);
    }
};

// 01002 - A Feast For Crows
class AFeastForCrows {
    constructor(player) {
        this.player = player;

        this.afterDominance = this.afterDominance.bind(this);
    }

    afterDominance(game, winner) {
        if(winner !== this.player) {
            return;
        }

        game.addMessage(winner.name + ' uses ' + winner.activePlot.card.label + ' to gain 2 power');
        game.addPower(winner, 2);
    }
}
plots['01002'] = {
    register(game, player) {
        var plot = new AFeastForCrows(player);

        game.playerPlots[player.id] = plot;

        game.on('afterDominance', plot.afterDominance);
    },
    unregister(game, player) {
        game.removeListener('afterDominance', game.playerPlots[player.id].afterDominance);
    }
};

// 01003 - A Game Of Thrones
class AGameOfThrones {
    constructor(player) {
        this.player = player;
        this.beforeChallenge = this.beforeChallenge.bind(this);
    }

    beforeChallenge(game, player, challengeType) {
        if((challengeType === 'power' || challengeType === 'military') && player.challenges['intrigue'].won <= 0) {
            game.cancelChallenge = true;
        }
    }
}
plots['01003'] = {
    register(game, player) {
        var plot = new AGameOfThrones(player);

        game.playerPlots[player.id] = plot;

        game.on('beforeChallenge', plot.beforeChallenge);
    },
    unregister(game, player) {
        game.removeListener('beforeChallenge', game.playerPlots[player.id].beforeChallenge);
    }
};

// 01004 - A Noble Cause
class ANobleCause {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
    }

    revealed(game, player) {
        if(player !== this.player) {
            return;
        }

        this.abilityUsed = false;
    }

    beforeCardPlayed(game, player, card) {
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
    }

    afterCardPlayed(game, player, card) {
        if(this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }
}
plots['01004'] = {
    register(game, player) {
        var plot = new ANobleCause(player);

        game.playerPlots[player.id] = plot;

        game.on('plotRevealed', plot.revealed);
        game.on('beforeCardPlayed', plot.beforeCardPlayed);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];

        game.removeListener('plotRevealed', plot.revealed);
        game.removeListener('beforeCardPlayed', plot.beforeCardPlayed);
    }
};

// 01005 - A Storm Of Swords
class AStormOfSwords {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
    }

    revealed(game, player) {
        if(player !== this.player) {
            return;
        }

        player.challenges['military'].max++;

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to gain an additional military challenge this round');
    }
}
plots['01005'] = {
    register(game, player) {
        var plot = new AStormOfSwords(player);

        game.playerPlots[player.id] = plot;

        game.on('plotRevealed', plot.revealed);
    },
    unregister(game, player) {
        game.removeListener('plotRevealed', game.playerPlots[player.id].revealed);
    }
};

// 01006 - Building Orders
class BuildingOrders {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.cardSelected = this.cardSelected.bind(this);
    }

    revealed(game, player) {
        if(this.player !== player) {
            return;
        }

        var attachmentsAndLocations = player.searchDrawDeck(10, card => {
            return card.type_code === 'attachment' || card.type_code === 'location';
        });

        var buttons = _.map(attachmentsAndLocations, card => {
            return { text: card.label, command: 'custom', arg: card.uuid };
        });

        buttons.push({ text: 'Done', command: 'custom', arg: 'done' });

        player.buttons = buttons;
        player.menuTitle = 'Select a card to add to your hand';

        game.pauseForPlot = true;
    }

    cardSelected(game, player, arg) {
        if(this.player !== player) {
            return;
        }

        if(arg === 'done') {
            game.playerRevealDone(player);
        }

        var card = player.findDrawDeckCardByUuid(arg);

        if(!card) {
            return;
        }

        player.moveFromDrawDeckToHand(card);
        player.shuffleDrawDeck();

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to reveal ' + card.label + ' and add it to their hand');

        game.playerRevealDone(player);
    }
}
plots['01006'] = {
    register(game, player) {
        var plot = new BuildingOrders(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
        game.on('customCommand', plot.cardSelected);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];
        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('customCommand', plot.cardSelected);
    }
};

// 01007 - Calling The Banners
class CallingTheBanners {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
    }

    revealed(game, player) {
        if(this.player !== player) {
            return;
        }

        var otherPlayer = game.getOtherPlayer(player);

        if(!otherPlayer) {
            return;
        }

        var characterCount = _.reduce(otherPlayer.cardsInPlay, (memo, card) => {
            var count = memo;

            if(card.card.type_code === 'character') {
                count++;
            }

            return count;
        }, 0);

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to gain ' + characterCount + ' gold');
        player.gold += characterCount;
    }

}
plots['01007'] = {
    register(game, player) {
        var plot = new CallingTheBanners(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
    },
    unregister(game, player) {
        game.removeListener('whenRevealed', game.playerPlots[player.id].revealed);
    }
};

// 01008 - Calm Over Westeros
class CalmOverWesteros {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.challengeTypeSelected = this.challengeTypeSelected.bind(this);
        this.beforeClaim = this.beforeClaim.bind(this);
        this.afterClaim = this.afterClaim.bind(this);
    }

    revealed(game, player) {
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
    }

    challengeTypeSelected(game, player, arg) {
        if(player !== this.player) {
            return;
        }

        this.challengeType = arg;

        game.playerRevealDone(player);
    }

    beforeClaim(game, challengeType, winner, loser) {
        if(winner === this.player) {
            return;
        }

        if(challengeType !== this.challengeType) {
            return;
        }

        this.claim = winner.activePlot.card.claim;
        winner.activePlot.card.claim--;

        game.addMessage(loser.name + ' uses ' + loser.activePlot.card.label + ' to reduce the claim value of ' +
            winner.name + '\'s ' + challengeType + 'challenge to ' + winner.activePlot.card.claim);
    }

    afterClaim(game, challengeType, winner) {
        if(winner === this.player) {
            return;
        }

        if(challengeType !== this.challengeType) {
            return;
        }

        winner.activePlot.card.claim = this.claim;
    }
}
plots['01008'] = {
    register(game, player) {
        var plot = new CalmOverWesteros(player);

        game.playerPlots[player.id] = plot;

        game.on('whenRevealed', plot.revealed);
        game.on('customCommand', plot.challengeTypeSelected);
        game.on('beforeClaim', plot.beforeClaim);
        game.on('afterClaim', plot.afterClaim);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];

        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('customCommand', plot.challengeTypeSelected);
        game.removeListener('beforeClaim', plot.beforeClaim);
        game.removeListener('afterClaim', plot.afterClaim);
    }
};

// 01009 - Confiscation
class Confiscation {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
    }

    revealed(game, player) {
        if(player !== this.player) {
            return;
        }

        if(!_.any(game.getPlayers(), p => {
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
    }

    cardClicked(game, player, clicked) {
        if(player !== this.player) {
            return;
        }

        if(clicked.type_code !== 'attachment') {
            return;
        }

        var attachmentPlayer = player;

        var card = _.find(player.cardsInPlay, c => {
            var attachment = _.find(c.attachments, a => {
                return a.uuid === clicked.uuid;
            });

            return !!attachment;
        });

        if(!card) {
            var otherPlayer = game.getOtherPlayer(player);

            card = _.find(otherPlayer.cardsInPlay, c => {
                var attachment = _.find(c.attachments, a => {
                    return a.uuid === clicked.uuid;
                });

                return !!attachment;
            });

            if(!card) {
                game.playerRevealDone(player);

                return;
            }

            attachmentPlayer = otherPlayer;
        }

        card.attachments = _.reject(card.attachments, a => {
            return a.uuid === clicked.uuid;
        });

        attachmentPlayer.discardPile.push(clicked);

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to discard ' + clicked.label);

        player.selectCard = false;
        game.clickHandled = true;

        game.playerRevealDone(player);
    }
}
plots['01009'] = {
    register(game, player) {
        var plot = new Confiscation(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
        game.on('cardClicked', plot.cardClicked);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];

        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('cardClicked', plot.cardClicked);
    }
};

// 01010 - Counting coppers
class CountingCoppers {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
    }

    revealed(game, player) {
        if(player !== this.player) {
            return;
        }

        player.drawCardsToHand(3);

        game.addMessage(player.name + ' draws 3 cards from ' + player.activePlot.card.label);
    }
}
plots['01010'] = {
    register: function(game, player) {
        var plot = new CountingCoppers(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
    },
    unregister(game, player) {
        game.removeListener('whenRevealed', game.playerPlots[player.id].revealed);
    }
};

// 01011 - Filthy Accusations
class FilthyAccusation {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
    }

    revealed(game, player) {
        if(this.player !== player) {
            return;
        }

        player.menuTitle = 'Select character to kneel';
        player.buttons = [];
        player.selectCard = true;

        game.pauseForPlot = true;

        this.waitingForClick = true;
    }

    cardClicked(game, player, clicked) {
        if(this.player !== player || !this.waitingForClick) {
            return;
        }

        this.waitingForClick = false;
        player.selectCard = false;

        var card = _.find(player.cardsInPlay, c => {
            return c.card.uuid === clicked.uuid;
        });

        if(!card) {
            var otherPlayer = game.getOtherPlayer(player);

            if(!otherPlayer) {
                game.playerRevealDone(player);

                return;
            }

            card = _.find(otherPlayer.cardsInPlay, c => {
                return c.card.uuid === clicked.uuid;
            });

            if(!card) {
                game.playerRevealDone(player);

                return;
            }
        }

        if(card.card.type_code !== 'character' || card.kneeled) {
            game.playerRevealDone(player);
            return;
        }

        card.kneeled = true;

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to kneel ' + card.card.label);

        game.playerRevealDone(player);
    }
}
plots['01011'] = {
    register(game, player) {
        var plot = new FilthyAccusation(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
        game.on('cardClicked', plot.cardClicked);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];
        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('cardClicked', plot.cardClicked);
    }
};

// 01013 - Heads On Spikes
class HeadsOnSpikes {
    constructor(player) {
        this.player = player;
        this.reveal = this.reveal.bind(this);
    }

    reveal(game, player) {
        if(this.player !== player) {
            return;
        }

        var otherPlayer = game.getOtherPlayer(player);

        if(!otherPlayer) {
            return;
        }

        var cardIndex = _.random(0, otherPlayer.hand.length - 1);
        var card = otherPlayer.hand[cardIndex];
        var message = player.name + ' uses ' + player.activePlot.card.label + ' to discard ' + card.label +
            ' from ' + otherPlayer.name + '\'s hand';

        otherPlayer.removeFromHand(card);

        if(card.type_code === 'character') {
            message += ' and gain 2 power for their faction';
            otherPlayer.deadPile.push(card);
            game.addPower(player, 2);
        } else {
            otherPlayer.discardPile.push(card);
        }

        game.addMessage(message);
    }
}
plots['01013'] = {
    register(game, player) {
        var plot = new HeadsOnSpikes(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.reveal);
    },
    unregister(game, player) {
        game.removeListener('whenRevealed', game.playerPlots[player.id].reveal);
    }
};

// 01014 - Jousting Contest
class JoustingContest {
    constructor(player) {
        this.player = player;
        this.beforeChallengerSelected = this.beforeChallengerSelected.bind(this);
    }

    beforeChallengerSelected(game, player, card) {
        if(player.cardsInChallenge.length !== 0 && !_.any(player.cardsInChallenge, c => {
            return c.card.uuid === card.card.uuid;
        })) {
            game.canAddToChallenge = false;
        }
    }
}
plots['01014'] = {
    register(game, player) {
        var plot = new JoustingContest(player);

        game.playerPlots[player.id] = plot;
        game.on('beforeChallengerSelected', plot.beforeChallengerSelected);
    },
    unregister(game, player) {
        game.removeListener('beforeChallengerSelected', game.playerPlots[player.id].beforeChallengerSelected);
    }
};

// 01015 - Marched To The Wall
class MarchedToTheWall {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
        this.doneClicked = this.doneClicked.bind(this);
    }

    revealed(game, player) {
        if(this.player !== player) {
            return;
        }

        _.each(game.getPlayers(), p => {
            p.menuTitle = 'Select a character to discard';
            p.buttons = [
                { command: 'custom', text: 'Done', arg: '01015done' }
            ];
        });

        game.pauseForPlot = true;
        this.waitingForClick = true;
        this.cardDiscarded = false;
        _.each(game.getPlayers(), p => {
            p.doneDiscard = false;
        });
    }

    cardClicked(game, player, clicked) {
        if(player.doneDiscard || !this.waitingForClick) {
            return;
        }

        if(clicked.type_code !== 'character') {
            return;
        }

        if(!_.any(player.cardsInPlay, card => {
            return card.card.uuid === clicked.uuid;
        })) {
            return;
        }

        game.addMessage(player.name + ' discards ' + clicked.label);

        player.discardCard(game.getOtherPlayer(player), clicked, player.discardPile);
        player.doneDiscard = true;

        var stillToDiscard = _.find(game.getPlayers(), p => {
            return !p.doneDiscard;
        });

        if(!stillToDiscard) {
            this.waitingForClick = false;
            game.playerRevealDone(player);
        } else {
            player.menuTitle = 'Waiting for oppoent to apply plot effect';
            player.buttons = [];
        }
    }

    doneClicked(game, player, arg) {
        if(arg !== '01015done') {
            return;
        }

        player.doneDiscard = true;

        var stillToDiscard = _.find(game.getPlayers(), p => {
            return !p.doneDiscard;
        });

        if(!stillToDiscard) {
            this.waitingForClick = false;
            if(!player.plotRevealed) {
                var otherPlayer = game.getOtherPlayer(player);

                if(otherPlayer) {
                    game.playerRevealDone(otherPlayer);
                }
            } else {
                game.playerRevealDone(player);
            }
        } else {
            player.menuTitle = 'Waiting for oppoent to apply plot effect';
            player.buttons = [];
        }
    }
}
plots['01015'] = {
    register(game, player) {
        var plot = new MarchedToTheWall(player);

        game.playerPlots[player.id] = plot;

        game.on('whenRevealed', plot.revealed);
        game.on('cardClicked', plot.cardClicked);
        game.on('customCommand', plot.doneClicked);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];

        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('cardClicked', plot.cardClicked);
        game.removeListener('customCommand', plot.doneClicked);
    }
};

// 01016 - Marching Orders
class MarchingOrders {
    constructor(player) {
        this.player = player;
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
    }

    beforeCardPlayed(game, player, card) {
        if(this.player !== player) {
            return;
        }

        if(card.type_code === 'event' || card.type_code === 'attachment' || card.type_code === 'location') {
            game.stopCardPlay = true;
        }
    }
}
plots['01016'] = {
    register(game, player) {
        var plot = new MarchingOrders(player);

        game.playerPlots[player.id] = plot;
        game.on('beforeCardPlayed', plot.beforeCardPlayed);
    },
    unregister(game, player) {
        game.removeListener('beforeCardPlayed', game.playerPlots[player.id].beforeCardPlayed);
    }
};

// 01017 - Naval Superiority
class NavalSuperority {
    constructor(player) {
        this.player = player;
        this.beginMarshal = this.beginMarshal.bind(this);
    }

    cleanup() {
        if(this.plot) {
            this.plot = this.plotGold;
            this.plot = undefined;
            this.plotGold = undefined;
        }
    }

    beginMarshal(game, player) {
        if(this.player !== player) {
            return;
        }

        var otherPlayer = game.getOtherPlayer(player);

        if(!otherPlayer) {
            return;
        }

        if(hasTrait(otherPlayer.activePlot.card, 'Kingdom') || hasTrait(otherPlayer.activePlot.card, 'Edict')) {
            this.plot = otherPlayer.activePlot;
            this.plotGold = otherPlayer.activePlot.gold;
            otherPlayer.activePlot.card.income = 0;

            game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to reduce the gold value of '
                + otherPlayer.activePlot.card.label + ' to 0');
        }
    }
}
plots['01017'] = {
    register(game, player) {
        var plot = new NavalSuperority(player);

        game.playerPlots[player.id] = plot;
        game.on('beginMarshal', plot.beginMarshal);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];

        game.removeListener('beginMarshal', plot.beginMarshal);
    }
};

// 01021 - Sneak Attack
class SneakAttack {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
    }

    revealed(game, player) {
        if(player !== this.player) {
            return;
        }

        player.challenges.maxTotal = 1;

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label +
            ' to make the maximum number of challenges able to be initiated by ' + player.name + ' this round be 1');
    }
}
plots['01021'] = {
    register(game, player) {
        var plot = new SneakAttack(player);

        game.playerPlots[player.id] = plot;
        game.on('plotRevealed', plot.revealed);
    },
    unregister(game, player) {
        game.removeListener('plotRevealed', game.playerPlots[player.id].revealed);
    }
};

// 01022 - Summons
class Summons {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.cardSelected = this.cardSelected.bind(this);
    }

    revealed(game, player) {
        if(this.player !== player) {
            return;
        }

        var characters = player.searchDrawDeck(10, card => {
            return card.type_code === 'character';
        });

        var buttons = _.map(characters, card => {
            return { text: card.label, command: 'custom', arg: card.uuid };
        });

        buttons.push({ text: 'Done', command: 'custom', arg: 'done' });

        player.buttons = buttons;
        player.menuTitle = 'Select a card to add to your hand';

        game.pauseForPlot = true;
    }

    cardSelected(game, player, arg) {
        if(this.player !== player) {
            return;
        }

        if(arg === 'done') {
            game.playerRevealDone(player);
        }

        var card = player.findDrawDeckCardByUuid(arg);

        if(!card) {
            return;
        }

        player.moveFromDrawDeckToHand(card);
        player.shuffleDrawDeck();

        game.addMessage(player.name + ' uses ' + player.activePlot.card.label + ' to reveal ' + card.label + ' and add it to their hand');

        game.playerRevealDone(player);
    }
}
plots['01022'] = {
    register(game, player) {
        var plot = new Summons(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
        game.on('customCommand', plot.cardSelected);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];
        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('customCommand', plot.cardSelected);
    }
};


// 02039 - Trading with the Pentoshi
class TradingWithThePentoshi {
    constructor(player) {
        this.player = player;

        this.revealed = this.revealed.bind(this);
    }

    revealed(game, player) {
        if(player !== this.player) {
            return;
        }

        var otherPlayer = game.getOtherPlayer(player);

        if(otherPlayer) {
            otherPlayer.gold += 3;

            game.addMessage(otherPlayer.name + ' gains 3 gold from ' + player.activePlot.card.label);
        }
    }
}

plots['02039'] = {
    register(game, player) {
        var plot = new TradingWithThePentoshi(player);

        game.playerPlots[player.id] = plot;

        game.on('whenRevealed', plot.revealed);
    },
    unregister(game, player) {
        game.removeListener('whenRevealed', game.playerPlots[player.id].revealed);
    }
};

// 03049 - The Long Winter
class TheLongWinter {
    constructor(player) {
        this.player = player;
        this.revealed = this.revealed.bind(this);
        this.cardSelected = this.cardSelected.bind(this);
        this.waitingForPlayers = {};
    }

    revealed(game, player) {
        if(this.player !== player) {
            return;
        }

        var anySummerPlots = false;

        _.each(game.getPlayers(), p => {
            if(!hasTrait(p.activePlot.card, 'Summer') && p.getTotalPower() > 0) {
                if(!_.any(p.cardsInPlay, card => {
                    return card.power > 0;
                })) {
                    game.addMessage(p.name + ' discards 1 power from their faction card from ' + player.activePlot.card.label);
                    p.power--;
                } else {
                    p.menuTitle = 'Select a card to discard power from';
                    p.buttons = [
                        { command: 'custom', text: 'Done', arg: '03049' }
                    ];

                    this.waitingForPlayers[p.id] = p;

                    anySummerPlots = true;
                }
            }
        });

        if(anySummerPlots) {
            game.pauseForPlot = true;
        }
    }

    cardSelected(game, player, card) {
        if(!this.waitingForPlayers[player.id]) {
            return;
        }

        var cardInPlay = _.find(player.cardsInPlay, c => {
            return c.card.uuid === card.uuid;
        });

        if(!cardInPlay || cardInPlay.power === 0) {
            return;
        }

        game.addMessage(player.name + ' discards 1 power form ' + cardInPlay.card.label + ' from ' + this.player.activePlot.card.label);
        cardInPlay.power--;

        delete this.waitingForPlayers[player.id];

        if(!_.any(this.waitingForPlayers)) {
            game.playerRevealDone(this.player);
        }
    }
}
plots['03049'] = {
    register(game, player) {
        var plot = new TheLongWinter(player);

        game.playerPlots[player.id] = plot;
        game.on('whenRevealed', plot.revealed);
        game.on('cardClicked', plot.cardSelected);
    },
    unregister(game, player) {
        var plot = game.playerPlots[player.id];

        game.removeListener('whenRevealed', plot.revealed);
        game.removeListener('cardClicked', plot.cardSelected);
    }
};

module.exports = plots;
