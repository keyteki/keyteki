import Card from '../../Card.js';

class Stalwart extends Card {
    // Deploy. Skirmish. Taunt.
    // After Fight: You may move Stalwart anywhere in your battleline.
    setupCardAbilities(ability) {
        this.fight({
            optional: true,
            gameAction: ability.actions.moveOnBattleline((context) => ({
                target: context.source,
                player: context.player
            })),
            effect: 'move {0} anywhere in their battleline'
        });
    }
}

Stalwart.id = 'stalwart';

export default Stalwart;
