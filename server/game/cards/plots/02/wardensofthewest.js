const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WardensOfTheWest extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => {
                    return challenge.winner === this.controller && challenge.challengeType === 'intrigue' && this.controller.gold >= 2;
                }
            },
            handler: () => {
                this.game.promptForSelect(this.game.currentChallenge.loser, {
                    numCards: 2,
                    activePromptTitle: 'Select 2 cards to discard',
                    source: this,
                    cardCondition: card => card.controller !== this.controller && card.location === 'hand',
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });

                this.game.addMessage('{0} uses {1} and pay 2 gold to have {2} discard 2 cards from their hand', this.controller, this, this.game.currentChallenge.loser);
            }
        });
    }

    onSelect(player, cards) {
        this.game.addGold(this.controller, -2);

        _.each(cards, card => {
            card.controller.moveCard(card, 'discard pile');
        });

        this.game.addMessage('{0} chooses {1} to discard from their hand', player, cards);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

WardensOfTheWest.code = '02030';

module.exports = WardensOfTheWest;
