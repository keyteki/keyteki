const DrawCard = require('../../drawcard.js');

class IndomitableWill extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent a character from bowing at the end of the conflict',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                                                   event.conflict.getNumberOfParticipantsFor(context.player) === 1
            },
            cannotBeMirrored: true,
            effect: 'prevent {1} from bowing as a result of the conflict\'s resolution',
            effectArgs: context => context.player.cardsInPlay.find(card => card.isParticipating()),
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.event.conflict.getCharacters(context.player),
                effect: ability.effects.doesNotBow()
            }))
        });
    }
}

IndomitableWill.id = 'indomitable-will';

module.exports = IndomitableWill;
