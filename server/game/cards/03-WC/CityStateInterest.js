const Card = require('../../Card.js');

class CityStateInterest extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture(context => {
                if(context.player.opponent.amber >= context.player.creaturesInPlay.length) {
                    return { target: context.player.creaturesInPlay };
                }

                return {
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to capture 1 amber',
                        cardType: 'creature',
                        controller: 'self',
                        mode: 'exactly',
                        numCards: context.player.opponent.amber
                    }
                };
            }),
            effect: 'make each friendly creature capture 1 amber'
        });
    }
}

CityStateInterest.id = 'city-state-interest';

module.exports = CityStateInterest;
