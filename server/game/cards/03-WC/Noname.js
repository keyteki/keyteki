const Card = require('../../Card.js');

class Noname extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                () => this.game.allCards.filter((card) => card.location === 'purged').length
            )
        });
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'exactly',
                numCards: 1,
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

Noname.id = 'noname';

module.exports = Noname;
