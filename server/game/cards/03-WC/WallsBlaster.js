const BlasterCard = require('./BlasterCard.js');

class WallsBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: event => event.card === this && event.parent.name === 'Chief Engineer Walls'
            },
            gameAction: ability.actions.stun(context => ({
                promptForSelect: {
                    cardType: 'creature',
                    mode: 'exactly',
                    numCards: context.source && context.source.parent ? context.source.parent.upgrades.length : 0
                }
            }))
        });

        this.setupBlasterCardAbilities(ability, 'Chief Engineer Walls');
    }
}

WallsBlaster.id = 'walls--blaster';

module.exports = WallsBlaster;
