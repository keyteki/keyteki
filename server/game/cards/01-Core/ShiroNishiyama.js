const StrongholdCard = require('../../strongholdcard.js');

class ShiroNishiyama extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give defending characters +1/+1',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.isDuringConflict(),
            effect: 'add +1{1}/+1{2} to all defenders they control',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(card => card.isDefending()),
                effect: ability.effects.modifyBothSkills(1)
            }))
        });
    }
}

ShiroNishiyama.id = 'shiro-nishiyama';

module.exports = ShiroNishiyama;
