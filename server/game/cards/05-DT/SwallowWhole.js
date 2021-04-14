const Card = require('../../Card.js');

class SwallowWhole extends Card {
    // Can only be played if the tide is high.
    // Play: Choose two creatures. Purge the creature with lower power, then put a number of +1 power tokens equal to that creature's
    // power on the other chosen creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => !context.player.isTideHigh())
        });

        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 1,
            targets: {
                weaker: {
                    activePromptTitle: 'Choose a creature to purge',
                    cardType: 'creature',
                    cardCondition: (card, context) => {
                        let orderedCreatures = context.game.creaturesInPlay.sort(
                            (a, b) => b.power - a.power
                        );
                        return (
                            orderedCreatures[0].power === orderedCreatures[1].power ||
                            card !== orderedCreatures[0]
                        );
                    },
                    gameAction: ability.actions.purge()
                },
                stronger: {
                    cardType: 'creature',
                    cardCondition: (card, context) =>
                        card !== context.targets.weaker &&
                        card.power >= context.targets.weaker.power,
                    gameAction: ability.actions.addPowerCounter((context) => ({
                        amount: context.targets.weaker.power
                    }))
                }
            }
        });
    }
}

SwallowWhole.id = 'swallow-whole';

module.exports = SwallowWhole;
