import Card from '../../Card.js';

class Tealnar extends Card {
    // Each friendly creature gains, "After Fight: Heal 3 from each of this creature's neighbors."
    // Fate: Fully heal each creature. Your opponent gains 1 for each creature healed this way.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card !== this && card.type === 'creature',
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.heal((context) => ({
                    amount: 3,
                    target: context.source.neighbors
                }))
            })
        });

        this.fate({
            gameAction: ability.actions.heal((context) => ({
                fully: true,
                target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
            })),
            then: {
                message: '{0} uses {1} to give {0} {3} amber',
                messageArgs: (context) => {
                    let successfulEvents = context.preThenEvents.filter(
                        (event) => !event.cancelled && event.amount > 0
                    );
                    return [successfulEvents.length];
                },
                effectAlert: true,
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.game.activePlayer.opponent,
                    amount: context.preThenEvents.filter(
                        (event) => !event.cancelled && event.amount > 0
                    ).length
                }))
            }
        });
    }
}

Tealnar.id = 'tealnar';

export default Tealnar;
