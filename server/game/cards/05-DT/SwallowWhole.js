import Card from '../../Card.js';

class SwallowWhole extends Card {
    // (T) Play only if the tide is high.
    // Play: Choose 2 creatures. Purge the chosen creature with the lowest power and give +1 power counters equal to its power to the other chosen creature.
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

export default SwallowWhole;
