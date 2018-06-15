const DrawCard = require('../../drawcard.js');

class ClarityOfPurpose extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Opponent\'s cards cannot bow the target character and it does not bow as a result of political conflicts',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.controller === this.controller && card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} on {2} to prevent opponents\' actions from bowing it and stop it bowing at the end of a political conflict', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.cannotBeBowed(context => context && context.source.type !== 'ring' && context.source.controller === this.controller.opponent)
                }));
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
                    effect: [
                        ability.effects.doesNotBowAsAttacker(),
                        ability.effects.doesNotBowAsDefender()
                    ]
                }));
            }
        });
    }
}

ClarityOfPurpose.id = 'clarity-of-purpose';

module.exports = ClarityOfPurpose;
