const Card = require('../../Card.js');

class IdesOfMarch extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: 1,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage(context => ({
                    amount: 23,
                    target: context.player.creaturesInPlay.filter(card => card.isInCenter())
                }))
            }
        });
    }
}

IdesOfMarch.id = 'ides-of-march';

module.exports = IdesOfMarch;
