const StrongholdCard = require('../../strongholdcard.js');

class IsawaMoriSeido extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow this stronghold',
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfPhase',
                    effect: ability.effects.modifyGlory(2)
                })
            },
            effect: 'give +2 glory to {0} until the end of the phase'
        });
    }
}

IsawaMoriSeido.id = 'isawa-mori-seido';

module.exports = IsawaMoriSeido;


