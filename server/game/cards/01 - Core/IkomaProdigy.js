const DrawCard = require('../../drawcard.js');

class IkomaProdigy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                onCardEntersPlay: event => event.card === this && this.fate > 0,
                onCardFateChanged: event => event.card === this && event.fate > 0
            },
            handler: () => {
                this.game.addHonor(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 honor', this.controller, this);
            }
        });
    }
}

IkomaProdigy.id = 'ikoma-prodigy';

module.exports = IkomaProdigy;
