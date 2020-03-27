const Card = require('../../Card.js');

class ExchangeOfficer extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            effect: 'allow them to play or use one Brobnar card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('star alliance')
            })
        });
    }
}

ExchangeOfficer.id = 'exchange-officer';

module.exports = ExchangeOfficer;
