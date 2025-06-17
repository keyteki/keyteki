const Card = require('../../Card.js');

class GovernorGridelk extends Card {
    // After Fight: Put the topmost creature from your opponent's discard pile into play under your control.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.putIntoPlay((context) => ({
                target: context.player.opponent.discard.find((card) => card.type === 'creature'),
                myControl: true
            }))
        });
    }
}

GovernorGridelk.id = 'governor-gridelk';

module.exports = GovernorGridelk;
