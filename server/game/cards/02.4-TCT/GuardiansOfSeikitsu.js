const ProvinceCard = require('../../provincecard.js');

class GuardiansOfTheSeikitsu extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow all characters 2 cost or less',
            when: {
                onProvinceRevealed: (event, context) => event.province === context.source && this.game.findAnyCardsInPlay(card => (
                    card.getType() === 'character' && 
                    card.getCost() <= 2 && 
                    card.allowGameAction('bow', context)
                ))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} - bowing all characters with printed cost 2 or lower', this.controller, this);
                let targetCharacters = this.game.findAnyCardsInPlay(card => card.getType() === 'character' && card.getCost() <= 2 && card.allowGameAction('bow', context));
                this.game.applyGameAction(context, { bow: targetCharacters });
            }
        });
    }
}

GuardiansOfTheSeikitsu.id = 'guardians-of-the-seikitsu';

module.exports = GuardiansOfTheSeikitsu;
