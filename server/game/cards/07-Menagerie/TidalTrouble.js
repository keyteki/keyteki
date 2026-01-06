const Card = require('../../Card.js');

class TidalTrouble extends Card {
    // Play: Stun an enemy creature and each creature that shares a house with it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.stun()
            },
            then: {
                gameAction: ability.actions.stun((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) =>
                            card !== context.preThenEvent.card &&
                            card
                                .getHouses()
                                .some((house) => context.preThenEvent.card.hasHouse(house))
                    )
                }))
            }
        });
    }
}

TidalTrouble.id = 'tidal-trouble';

module.exports = TidalTrouble;
