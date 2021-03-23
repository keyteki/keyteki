const Card = require('../../Card.js');

class MimicGel extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.creaturesInPlay.length === 0,
            location: 'any',
            targetLocation: 'any',
            effect: ability.effects.cardCannot('play')
        });

        this.reaction({
            when: {
                onAbilityInitiated: (event, context) =>
                    event.context.source === context.source &&
                    event.context.ability.title === 'Play this creature'
            },
            location: 'any',
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.source,
                    targetLocation: 'hand',
                    duration: 'lastingEffect',
                    effect: [
                        ability.effects.copyCard(context.target.getBottomCard()),
                        ability.effects.changeHouse('logos')
                    ]
                }))
            },
            effect: 'to copy {0}'
        });
    }
}

MimicGel.id = 'mimic-gel';

module.exports = MimicGel;
