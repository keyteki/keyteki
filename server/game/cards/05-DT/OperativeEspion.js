import Card from '../../Card.js';

class OperativeEspion extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // (T) After a player raises the tide during their turn, they may use a creature they control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event) => event.player === this.game.activePlayer
            },
            useEventPlayer: true,
            target: {
                optional: true,
                cardType: 'creature',
                cardCondition: (card, context) => card.controller === context.event.player,
                gameAction: ability.actions.use()
            }
        });
    }
}

OperativeEspion.id = 'operative-espion';

export default OperativeEspion;
