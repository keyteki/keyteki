const DrawCard = require('../../drawcard.js');

class HirumaAmbusher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Disable a character',
            when: {
                'onCharacterEntersPlay': (event, context) => event.card === context.source && context.source.isDefending()
            },
            target: {
                cardType: 'character',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.cardCannot('triggerAbilities')
                })
            },
            effect: 'prevent {0} from using any abilities'
        });
    }
}

HirumaAmbusher.id = 'hiruma-ambusher';

module.exports = HirumaAmbusher;
