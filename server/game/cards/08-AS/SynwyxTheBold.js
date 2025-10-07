import Card from '../../Card.js';

class SynwyxTheBold extends Card {
    // After Fight: An enemy creature captures 2A from its own side.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.capture((context) => ({
                    amount: 2,
                    player: context.player.opponent
                }))
            }
        });
    }
}

SynwyxTheBold.id = 'synwyx-the-bold';

export default SynwyxTheBold;
