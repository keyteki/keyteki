import Card from '../../Card.js';

class HonorOrGlory extends Card {
    // Play: Choose one:
    // • Deal 3D to each flank creature.
    // • Deal 3D to each creature not on a flank.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        Flank: ability.actions.dealDamage((context) => ({
                            amount: 3,
                            target: context.game.creaturesInPlay.filter((card) => card.isOnFlank())
                        })),
                        NonFlank: ability.actions.dealDamage((context) => ({
                            amount: 3,
                            target: context.game.creaturesInPlay.filter((card) => !card.isOnFlank())
                        }))
                    }
                }
            }
        });
    }
}

HonorOrGlory.id = 'honor-or-glory';

export default HonorOrGlory;
