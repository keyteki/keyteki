const Card = require('../../Card.js');

class OperationsOfficerYshi extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: [
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.capture()
                }),
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.capture()
                })
            ]
        });
    }
}

OperationsOfficerYshi.id = 'operations-officer-yshi';

module.exports = OperationsOfficerYshi;
