const Card = require('../../Card.js');

class Dharna extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber(context => ({
                amount: context.player.cardsInPlay.filter(card => card.type === 'creature' && card.hasToken('damage')).length
            }))
        });
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.heal({ amount: 2 })
            }
        });
    }
}

Dharna.id = 'dharna';

module.exports = Dharna;
