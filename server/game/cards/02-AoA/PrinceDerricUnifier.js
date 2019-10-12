const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class PrinceDerricUnifier extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => Constants.Houses.filter(house => context.player.creaturesInPlay.some(card => card.hasHouse(house))).length > 2,
            gameAction: ability.actions.gainAmber({ amount: 3 }),
            effect: 'gain 3 amber if you control creatures from 3 different houses.'
        });
    }
}

PrinceDerricUnifier.id = 'prince-derric-unifier';

module.exports = PrinceDerricUnifier;
