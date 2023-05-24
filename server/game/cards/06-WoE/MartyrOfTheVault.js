const Card = require('../../Card.js');

class MartyrOfTheVault extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.player.opponent.amber - 5
            }))
        });
    }
}

MartyrOfTheVault.id = 'martyr-of-the-vault';

module.exports = MartyrOfTheVault;
