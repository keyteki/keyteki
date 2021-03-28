const BlasterCard = require('./BlasterCard.js');

class WallsBlaster extends BlasterCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source &&
                    event.parent.name === 'Chief Engineer Walls' &&
                    event.context.player === event.card.controller
            },
            target: {
                cardType: 'creature',
                mode: 'exactly',
                numCards: (context) =>
                    context.source && context.source.parent
                        ? context.source.parent.upgrades.length
                        : 0,
                gameAction: ability.actions.stun()
            }
        });

        this.setupBlasterCardAbilities(ability, 'Chief Engineer Walls');
    }
}

WallsBlaster.id = 'walls--blaster';

module.exports = WallsBlaster;
