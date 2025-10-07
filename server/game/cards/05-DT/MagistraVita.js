import Card from '../../Card.js';

class MagistraVita extends Card {
    // Play/Reap: You may exalt a friendly non-Saurian creature. If you do, reap with it.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('saurian'),
                gameAction: ability.actions.exalt()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.reap({ target: preThenContext.target })
            })
        });
    }
}

MagistraVita.id = 'magistra-vita';

export default MagistraVita;
