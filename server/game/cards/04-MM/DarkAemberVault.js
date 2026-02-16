const Card = require('../../Card.js');

class DarkAmberVault extends Card {
    // After you play a Mutant creature, draw a card.
    // Each friendly Mutant creature gets +2 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.hasTrait('mutant') &&
                    event.player === context.player
            },
            gameAction: ability.actions.draw((context) => ({ target: context.player }))
        });

        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.hasTrait('mutant'),
            effect: ability.effects.modifyPower(2)
        });
    }
}

DarkAmberVault.id = 'dark-æmber-vault';

module.exports = DarkAmberVault;
