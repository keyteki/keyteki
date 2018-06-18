const DrawCard = require('../../drawcard.js');

class GraspOfEarth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Opponent\'s cards cannot join this conflict',
            condition: context => this.game.isDuringConflict() && context.player.opponent,
            cost: ability.costs.bowSelf(),
            effect: 'prevent the opponent from bringing characters to the conflict',
            gameAction: [
                ability.actions.cardLastingEffect(context => ({
                    target: context.player.opponent.cardsInPlay.toArray(),
                    effect: ability.effects.cardCannot('moveToConflict')
                })),
                ability.actions.playerLastingEffect({
                    effect: ability.effects.playerCannot('play', context => context.source.type === 'character' && context.source.location === 'hand')
                })
            ]
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('shugenja') === false || card.controller !== context.player) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

GraspOfEarth.id = 'grasp-of-earth';

module.exports = GraspOfEarth;
