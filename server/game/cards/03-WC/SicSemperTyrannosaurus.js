const Card = require('../../Card.js');

class SicSemperTyrannosaurus extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                mode: 'mostStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: [
                    ability.actions.returnAmber((context) => ({
                        all: true,
                        recipient: context.player
                    })),
                    ability.actions.destroy()
                ]
            },
            effect: 'take all amber from {0} and destroy it'
        });
    }
}

SicSemperTyrannosaurus.id = 'sic-semper-tyrannosaurus';

module.exports = SicSemperTyrannosaurus;
