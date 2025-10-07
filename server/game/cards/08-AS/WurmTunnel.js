import Card from '../../Card.js';

class WurmTunnel extends Card {
    // Play: Move 1A from a creature to the common supply. If you do,
    // draw 2 cards.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({ amount: 1 })
            },
            then: {
                gameAction: ability.actions.draw({
                    amount: 2
                })
            }
        });
    }
}

WurmTunnel.id = 'wurm-tunnel';

export default WurmTunnel;
