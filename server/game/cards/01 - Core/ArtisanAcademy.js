const DrawCard = require('../../drawcard.js');

class ArtisanAcademy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Draw a card',
            phase: 'conflict',
            handler: () => this.game.addMessage('{0} uses {1} to reveal the top card of their conflict deck: {2}. If you want to play this card, drag the top card of your deck to your hand and play it normally', this.controller, this, this.controller.conflictDeck.first())
        });
    }
}

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
