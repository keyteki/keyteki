import Card from '../../Card.js';

class SnarriWarriorPoet extends Card {
    // Elusive. After a friendly creature is used to fight, draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event) => !!event.fight && event.card.controller === this.controller
            },
            gameAction: ability.actions.draw()
        });
    }
}

SnarriWarriorPoet.id = 'snarri-warrior-poet';

export default SnarriWarriorPoet;
