const PlotCard = require('../../../plotcard.js');

class TheAnnalsOfCastleBlack extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.canPlayFromOwn('discard pile')
        });

        this.forcedReaction({
            when: {
                onCardPlaced: event => event.card.getType() === 'event' && event.location === 'discard pile'
            },
            handler: context => {
                let eventCard = context.event.card;
                let player = eventCard.controller;

                this.game.addMessage('{0} is forced by {1} to remove {2} from the game', player, this, eventCard);
                player.moveCard(eventCard, 'out of game');
            }
        });
    }
}

TheAnnalsOfCastleBlack.code = '06040';

module.exports = TheAnnalsOfCastleBlack;
