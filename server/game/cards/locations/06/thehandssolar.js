const DrawCard = require('../../../drawcard.js');

class TheHandsSolar extends DrawCard {
    setupCardAbilities(ability) {  
        this.action({
            title: 'Kneel to give INT icon',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addIcon('intrigue')
                }));

                this.game.addMessage('{0} kneels {1} to give {2} an {3} icon until the end of the phase', 
                                      this.controller, this, context.target, 'intrigue');
            }
        });
    }
}

TheHandsSolar.code = '06030';

module.exports = TheHandsSolar;
