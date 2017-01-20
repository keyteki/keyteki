const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class OldWyk extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallenge: (event, challenge) => (
                    challenge.attackingPlayer === this.controller &&
                    challenge.challengeType === 'power' &&
                    !this.kneeled
                )
            },
            handler: () => {
                this.controller.kneelCard(this);
                var card = _.last(this.controller.deadPile.filter(c => c.hasTrait('Drowned God')));

                if(!card) {
                    this.game.addMessage('{0} finds no character in their dead pile to put into play with {1}', this.controller, this);
                    return;
                }

                this.controller.playCard(card, true, true);
                this.game.currentChallenge.addAttacker(card);

                this.game.addMessage('{0} uses {1} to put into play {2} as an attacker from their dead pile', this.controller, this, card);

                this.untilEndOfChallenge(ability => ({
                    match: card,
                    effect: ability.effects.returnToHandOrDeckBottom()
                }));
            }
        });
    }
}

OldWyk.code = '05028';

module.exports = OldWyk;
