const DrawCard = require('../../../drawcard.js');

class WeirwoodBow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Weirwood Bow to give -2 STR',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a defending character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.getType() === 'character' &&
                    this.game.currentChallenge.isDefending(card))
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(-2)
                }));

                this.game.addMessage('{0} kneels {1} to give {2} -2 STR until the end of the challenge', 
                                      context.player, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(!(card.isFaction('thenightswatch') || card.hasTrait('Wildling'))) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

WeirwoodBow.code = '07043';

module.exports = WeirwoodBow;
