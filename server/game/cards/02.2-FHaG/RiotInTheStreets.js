const ProvinceCard = require('../../provincecard.js');

class RiotInTheStreets extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow character if you have 3 participating bushi',
            condition: context => context.source.isConflictProvince() && 
                                  context.player.getNumberOfCardsInPlay(card => card.hasTrait('bushi') && card.isParticipating()) >= 3,
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

RiotInTheStreets.id = 'riot-in-the-streets';

module.exports = RiotInTheStreets;
