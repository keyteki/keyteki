const Card = require('../../Card.js');

class ThoriumPlasmate extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.moveOnBattleline()
            },
            then: {
                gameAction: ability.actions.dealDamage(context => {
                    let card = context.preThenEvent.card;
                    let houses = card.getHouses();

                    let neighborsSharingHouses = card.neighbors.filter(c => c.getHouses().some(h => houses.includes(h)));

                    return {
                        target: card,
                        amount: 2 * neighborsSharingHouses.length
                    };
                })
            }
        });
    }
}

ThoriumPlasmate.id = 'thorium-plasmate';

module.exports = ThoriumPlasmate;
