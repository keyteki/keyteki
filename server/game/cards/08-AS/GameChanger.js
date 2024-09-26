const Card = require('../../Card.js');

class GameChanger extends Card {
    // Each friendly Ekwidon creature cannot reap and gains, “Action:
    // Steal 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.type === 'creature' && card.hasHouse('ekwidon'),
            effect: [
                ability.effects.cardCannot('reap'),
                ability.effects.gainAbility('action', {
                    gameAction: ability.actions.steal()
                })
            ]
        });
    }
}

GameChanger.id = 'game-changer';

module.exports = GameChanger;
