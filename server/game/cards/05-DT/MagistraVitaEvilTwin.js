import Card from '../../Card.js';

class MagistraVitaEvilTwin extends Card {
    // Play/Fight: You may exalt a friendly non-Saurian creature. If you do, fight with it.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('saurian'),
                gameAction: ability.actions.exalt()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.fight({ target: preThenContext.target })
            })
        });
    }
}

MagistraVitaEvilTwin.id = 'magistra-vita-evil-twin';

export default MagistraVitaEvilTwin;
