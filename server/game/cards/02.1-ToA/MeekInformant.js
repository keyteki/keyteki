const DrawCard = require('../../drawcard.js');

class MeekInformant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal opponent\'s hand',
            when: {
                onCardEntersPlay: event => event.card === this && this.controller.opponent && this.controller.opponent.hand.size() > 0
            },
            handler: () => this.game.addMessage('{0} uses {1} to reveal {2}\'s hand: {3}', this.controller, this, this.controller.opponent, this.controller.opponent.hand.toArray())
        });
    }
}

MeekInformant.id = 'meek-informant';

module.exports = MeekInformant;
