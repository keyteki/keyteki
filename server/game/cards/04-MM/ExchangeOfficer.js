const Card = require('../../Card.js');

class ExchangeOfficer extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            effect: 'allow them to play or use one staralliance card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayOrUseHouse('staralliance')
            })
        });
    }
}

ExchangeOfficer.id = 'exchange-officer';

module.exports = ExchangeOfficer;
