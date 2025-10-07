import Card from '../../Card.js';

class Colossipede extends Card {
    // Each friendly creature with A on it gains, “After Fight: Move
    // each A on this creature to your pool.”
    // Play: Exalt each creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.removeAmber({ all: true }),
                effect: 'move all amber from {0} to their pool',
                then: {
                    gameAction: ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvent.amount
                    }))
                }
            })
        });

        this.play({
            gameAction: ability.actions.exalt((context) => ({
                target: context.game.creaturesInPlay
            }))
        });
    }
}

Colossipede.id = 'colossipede';

export default Colossipede;
