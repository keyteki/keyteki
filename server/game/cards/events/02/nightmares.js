const DrawCard = require('../../../drawcard.js');

class Nightmares extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Blank a character or location',
            target: {
                activePromptTitle: 'Select a character or location',
                cardCondition: card => card.location === 'play area' && (card.getType() === 'character' || card.getType() === 'location')
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.blank
                }));

                this.game.addMessage('{0} uses {1} to treat the text box of {2} as blank until the end of the phase', context.player, this, context.target);
            }
        });
    }
}

Nightmares.code = '02099';

module.exports = Nightmares;
