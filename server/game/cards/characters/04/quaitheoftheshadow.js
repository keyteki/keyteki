const DrawCard = require('../../../drawcard.js');
const _ = require('underscore');

class QuaitheOfTheShadow extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => (
                    event.card === this &&
                    this.game.currentChallenge &&
                    this.game.currentPhase === 'challenge'
                )
            },
            handler: () => {
                var attackers = _.filter(this.game.currentChallenge.attackers, card => card.getStrength() <= 2);
                var defenders = _.filter(this.game.currentChallenge.defenders, card => card.getStrength() <= 2);
                var participants = attackers.concat(defenders);
                _.each(participants, card => {
                    this.game.currentChallenge.removeFromChallenge(card);
                });
                this.game.addMessage('{0} uses {1} to remove all characters with STR 2 or lower from the challenge', this.controller, this);
            }
        });
    }


}

QuaitheOfTheShadow.code = '04113';

module.exports = QuaitheOfTheShadow;
