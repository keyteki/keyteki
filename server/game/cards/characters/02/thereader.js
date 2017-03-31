const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheReader extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isUnopposed() &&
                    _.any(challenge.getWinnerCards(), card => card.isFaction('greyjoy') && card.isUnique())
                )
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                },
                'Discard 3 cards': () => {
                    var otherPlayer = this.game.getOtherPlayer(this.controller);

                    if(!otherPlayer) {
                        return true;
                    }

                    otherPlayer.discardFromDraw(3);

                    this.game.addMessage('{0} uses {1} to discard the top 3 cards from {2}\'s deck', this.controller, this, otherPlayer);
                }
            }
        });
    }
}

TheReader.code = '02031';

module.exports = TheReader;
