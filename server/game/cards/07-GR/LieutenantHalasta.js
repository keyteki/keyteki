const Card = require('../../Card.js');

class LieutenantHalasta extends Card {
    // After Reap: Stun a creature.
    //
    // Scrap: Stun the most powerful enemy creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            }
        });

        this.scrap({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.stun()
            }
        });
    }
}

LieutenantHalasta.id = 'lieutenant-halasta';

module.exports = LieutenantHalasta;
