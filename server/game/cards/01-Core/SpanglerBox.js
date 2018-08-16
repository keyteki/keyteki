const Card = require('../../Card.js');

class SpanglerBox extends Card {
    setupCardAbilities(ability) {
        this.purgedCreatures = [];
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.purge()
            },
            effect: 'purge a creature and give control to the other player',
            then: {
                condition: context => !!context.player.opponent,
                gameAction: ability.action.cardLastingEffect(context => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            }
        });
    }
}

SpanglerBox.id = 'spangler-box'; // This is a guess at what the id might be - please check it!!!

module.exports = SpanglerBox;
