const Card = require('../../Card.js');

class Soulkeeper extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                target: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    controller: 'opponent',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.destroy()
                }
            })
        });
    }
}

Soulkeeper.id = 'soulkeeper';

module.exports = Soulkeeper;
