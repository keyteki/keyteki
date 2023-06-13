const Card = require('../../Card.js');

class ThoriumPlasmate extends Card {
    // Play: Move an enemy creature anywhere in its controllers battleline. Deal 2D to that creature for each of its neighbors that shares a house with it.
    setupCardAbilities(ability) {
        this.play({
            effect:
                "move {1} on {2}'s battleline and deal 2 damage to it for each neighbor that shares a house with it",
            effectArgs: (context) => [context.target, context.target.controller],
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.moveOnBattleline()
            },
            then: {
                gameAction: ability.actions.dealDamage((context) => {
                    let card = context.preThenEvent.card;
                    let houses = card.getHouses();

                    let neighborsSharingHouses = card.neighbors.filter((c) =>
                        c.getHouses().some((h) => houses.includes(h))
                    );

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
