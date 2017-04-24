const DrawCard = require('../../../drawcard.js');

class Gilly extends DrawCard {
    setupCardAbilities(ability) {  
        this.action({
            title: 'Discard 1 gold from ' + this.name,
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a Steward character',
                cardCondition: card => (
                    card.location === 'play area' && 
                    card.controller === this.controller &&
                    card.hasTrait('Steward') && 
                    card.getType() === 'character')
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('stealth')
                }));

                this.game.addMessage('{0} discards 1 gold from {1} to have {2} gain stealth until the end of the phase', 
                                      this.controller, this, context.target);
            }
        });
    }
}

Gilly.code = '06025';

module.exports = Gilly;
