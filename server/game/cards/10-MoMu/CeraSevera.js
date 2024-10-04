const Card = require('../../Card.js');

class CeraSevera extends Card {
    // After Fight/After Reap: Capture 1A.
    // Destroyed: Choose an enemy creature. Deal 1D to that creature for each
    // A on Cera Severa
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            gameAction: ability.actions.capture()
        });

        this.destroyed({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.amber
                }))
            }
        });
    }
}

CeraSevera.id = 'cera-severa';

module.exports = CeraSevera;
