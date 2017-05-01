const DrawCard = require('../../../drawcard.js');

class AryaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.dupes.size() >= 1,
            match: this,
            effect: ability.effects.addIcon('military')
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.card.canBeDuplicated()
            },
            handler: () => {
                var dupe = this.controller.drawDeck.first();
                this.controller.removeCardFromPile(dupe);

                this.addDuplicate(dupe);

                dupe.facedown = true;

                this.game.addMessage('{0} places the top card of their deck on {1} as a duplicate', this.controller, this);
            }
        });
    }
}

AryaStark.code = '01141';

module.exports = AryaStark;
