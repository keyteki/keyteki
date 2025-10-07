import Card from '../../Card.js';

class Jahneerie extends Card {
    // Each friendly creature with A on it gains, “After Reap: Move 1A
    // from this creature to your pool.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.amber > 0,
            effect: ability.effects.gainAbility('reap', {
                effect: 'move 1 amber from {0} to their pool',
                gameAction: ability.actions.removeAmber(),
                then: {
                    gameAction: ability.actions.gainAmber()
                }
            })
        });
    }
}

Jahneerie.id = 'jahneerie';

export default Jahneerie;
