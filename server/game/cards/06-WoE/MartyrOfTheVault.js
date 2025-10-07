import Card from '../../Card.js';

class MartyrOfTheVault extends Card {
    // Destroyed: If your opponent has 7 or more, they lose all but 5.
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

export default MartyrOfTheVault;
