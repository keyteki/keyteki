const DrawCard = require('../../drawcard.js');

class Tranquility extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Opponent\'s characters at home can\'t use abilities',
            condition: context => this.game.isDuringConflict() && context.player.opponent,
            effect: 'stop characters at {1}\'s home from triggering abilities until the end of the conflict',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.player.opponent.cardsInPlay.filter(card => !card.isParticipating()),
                effect: ability.effects.cardCannot('triggerAbilities')
            }))
        });
    }
}

Tranquility.id = 'tranquility';

module.exports = Tranquility;
