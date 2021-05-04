const Card = require('../../Card.js');

class DiploMacy extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.untilNextTurn({
                targetController: 'any',
                effect: ability.effects.gainAbility('beforeFight', {
                    gameAction: ability.actions.exalt()
                })
            })
        });
    }
}

DiploMacy.id = 'diplo-macy';

module.exports = DiploMacy;
