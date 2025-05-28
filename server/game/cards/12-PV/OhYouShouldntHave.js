const Card = require('../../Card.js');

class OhYouShouldntHave extends Card {
    setupCardAbilities(ability) {
        this.fate({
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.game.activePlayer.opponent,
                amount: 3
            }))
        });
    }
}

OhYouShouldntHave.id = 'oh-you-shouldn-t-have';

module.exports = OhYouShouldntHave;
