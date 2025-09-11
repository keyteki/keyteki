const Card = require('../../Card.js');

class TooLow extends Card {
    // Play: Choose an enemy creature. Destroy each creature with power less than the chosen creature's power.
    // Fate: Destroy each friendly creature with the lowest power.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.power < context.target.power
                    )
                }))
            },
            effect: "destroy each creature with power less than {0}'s power"
        });

        this.fate({
            effect: 'destroy each friendly creature with the lowest power',
            gameAction: ability.actions.destroy((context) => {
                if (context.game.activePlayer.creaturesInPlay.length === 0) {
                    return { target: [] };
                }

                let lowestPower = context.game.activePlayer.creaturesInPlay.sort(
                    (a, b) => a.power - b.power
                )[0].power;

                return {
                    target: context.game.activePlayer.creaturesInPlay.filter(
                        (card) => card.power === lowestPower
                    )
                };
            })
        });
    }
}

TooLow.id = 'too-low';

module.exports = TooLow;
