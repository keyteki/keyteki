const StrongholdCard = require('../../strongholdcard.js');

class IsawaMoriSeido extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow this stronghold',
            cost: ability.costs.bowSelf(),
            clickToActivate: true,
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to give +2 glory to {2} until the end of the phase', this.controller, this, context.target);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyGlory(2)
                }));
            }
        });
    }
}

IsawaMoriSeido.id = 'isawa-mori-seido';

module.exports = IsawaMoriSeido;


