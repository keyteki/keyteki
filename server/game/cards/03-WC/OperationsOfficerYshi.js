const Card = require('../../Card.js');

class OperationsOfficerYshi extends Card {
    // Taunt.
    // Each of Operations Officer Yshis neighbors gains, Fight/Reap: Capture1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
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
