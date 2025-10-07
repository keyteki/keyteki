import Card from '../../Card.js';

class GiltspineNetcaster extends Card {
    // Enhance (PTPT). (These icons have already been added to cards in your deck.)
    // Reap: Exhaust a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

GiltspineNetcaster.id = 'giltspine-netcaster';

export default GiltspineNetcaster;
