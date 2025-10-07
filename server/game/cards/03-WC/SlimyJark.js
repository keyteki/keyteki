import Card from '../../Card.js';

class SlimyJark extends Card {
    // Skirmish. Elusive.
    // Fight: Enrage the creature Slimy Jark fights.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.enrage((context) => ({
                target: context.event.attackerTarget
            }))
        });
    }
}

SlimyJark.id = 'slimy-jark';

export default SlimyJark;
