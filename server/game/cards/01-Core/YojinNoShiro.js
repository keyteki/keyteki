const StrongholdCard = require('../../strongholdcard.js');

class YojinNoShiro extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give attacking characters +1/+0',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.isDuringConflict(),
            effect: 'give attacking characters +1{1}/+0{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.player.cardsInPlay.filter(card => card.isAttacking()),
                effect: ability.effects.modifyMilitarySkill(1)
            }))
        });
    }
}

YojinNoShiro.id = 'yojin-no-shiro';

module.exports = YojinNoShiro;
