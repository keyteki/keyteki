const ProvinceCard = require('../../provincecard.js');

class GuardiansOfTheSeikitsu extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow all characters 2 cost or less',
            when: {
                onProvinceRevealed: (event, context) => event.province === context.source
            },
            gameAction: ability.actions.bow(() => ({
                target: this.game.findAnyCardsInPlay(card => card.getType() === 'character' && card.getCost() <= 2)
            }))
        });
    }
}

GuardiansOfTheSeikitsu.id = 'guardians-of-the-seikitsu';

module.exports = GuardiansOfTheSeikitsu;
