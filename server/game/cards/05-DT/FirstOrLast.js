import Card from '../../Card.js';

class FirstOrLast extends Card {
    // Play: Choose one:
    // • Purge each creature with the highest power.
    // • Purge each creature with the lowest power.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        Highest: ability.actions.purge((context) => {
                            let highestPower = context.game.creaturesInPlay.sort(
                                (a, b) => b.power - a.power
                            )[0].power;
                            return {
                                target: context.game.creaturesInPlay.filter(
                                    (card) => card.power === highestPower
                                )
                            };
                        }),
                        Lowest: ability.actions.purge((context) => {
                            let lowestPower = context.game.creaturesInPlay.sort(
                                (a, b) => a.power - b.power
                            )[0].power;

                            return {
                                target: context.game.creaturesInPlay.filter(
                                    (card) => card.power === lowestPower
                                )
                            };
                        })
                    }
                }
            }
        });
    }
}

FirstOrLast.id = 'first-or-last';

export default FirstOrLast;
