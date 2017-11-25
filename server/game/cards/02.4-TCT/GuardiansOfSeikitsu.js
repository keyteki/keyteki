const ProvinceCard = require('../../provincecard.js');

class GuardiansOfSeikitsu extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow all characters 2 cost or less',
            when: {
                onProvinceRevealed: event => event.province === this
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}.', this.controller, this);
                let targetChracters = this.game.findAnyCardsInPlay(card => card.getType() === 'character' && card.getCost() <= 2 && card.allowGameAction('bow', context))
                this.controller.bowCards(targetChracters, this)
            }
        });
    }
}

GuardiansOfSeikitsu.id = 'frostbitten-crossing';

module.exports = GuardiansOfSeikitsu;
