const Card = require('../../Card.js');

class Charybdis extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('beforeFight', {
                gameAction: ability.actions.loseAmber((context) => ({
                    target: context.game.activePlayer
                }))
            })
        });
    }
}

Charybdis.id = 'charybdis';

module.exports = Charybdis;
