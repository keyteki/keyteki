const Card = require('../../Card.js');

class TrenksCreed extends Card {
    // Play: Choose one:
    // The most powerful creature captures all of your opponent's amber.
    // Move all amber from the most powerful creature to the common supply.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        "Capture opponent's amber": () => true,
                        'Move amber to common supply': () => true
                    }
                },
                "Capture opponent's amber": {
                    dependsOn: 'action',
                    cardType: 'creature',
                    mode: 'mostStat',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.capture((context) => ({
                        amount: context.player.opponent.amber
                    }))
                },
                'Move amber to common supply': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    mode: 'mostStat',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.removeAmber({ all: true })
                }
            }
        });
    }
}

TrenksCreed.id = 'trenk-s-creed';

module.exports = TrenksCreed;
