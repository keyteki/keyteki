import Card from '../../Card.js';

class OperativeEspionEvilTwin extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // (T) After a player raises the tide during their turn, they may deal 3D to a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event) => event.player === this.game.activePlayer
            },
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

OperativeEspionEvilTwin.id = 'operative-espion-evil-twin';

export default OperativeEspionEvilTwin;
