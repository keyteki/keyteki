const DrawCard = require('../../drawcard.js');

class Blackmail extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }

    canPlay(context) {
        if(context.player.opponent && context.player.honor < context.player.opponent.honor) {
            return super.canPlay(context);
        }
        return false;
    }
}

Blackmail.id = 'blackmail';

module.exports = Blackmail;
