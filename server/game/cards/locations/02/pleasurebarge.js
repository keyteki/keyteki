const DrawCard = require('../../../drawcard.js');

// TODO: "have not yet drawn cards this phase" check
class PleasureBarge extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: -1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(() => true)
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                this.controller.drawCardsToHand(3);
                this.game.addMessage('{0} uses {1} to draw 3 cards', this.controller, this);
            }
        });
    }
}

PleasureBarge.code = '02006';

module.exports = PleasureBarge;
