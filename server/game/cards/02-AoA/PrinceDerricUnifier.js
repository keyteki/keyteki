const Card = require('../../Card.js');

class PrinceDerricUnifier extends Card {
    // Play: Gain 3A if you control creatures from 3different houses.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.getHousesInPlay(context.player.creaturesInPlay).length > 2,
            gameAction: ability.actions.gainAmber({ amount: 3 }),
            effect: 'gain 3 amber if you control creatures from 3 different houses.'
        });
    }
}

PrinceDerricUnifier.id = 'prince-derric-unifier';

module.exports = PrinceDerricUnifier;
