const DrawCard = require('../../drawcard.js');

class TacticiansApprentice extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card',
            when: {
                onHonorDialsRevealed: (event, context) => this.lowerHonorDial(context)
            },
            effect: 'draw a card',
            gameAction: ability.actions.draw(),
            limit: ability.limit.perPhase(1)
        });
    }

    lowerHonorDial(context) {
        return context.player.opponent && context.player.showBid < context.player.opponent.showBid;
    }
}

TacticiansApprentice.id = 'tactician-s-apprentice';

module.exports = TacticiansApprentice;
