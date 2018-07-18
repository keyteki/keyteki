const ProvinceCard = require('../../provincecard.js');

class FloodedWaste extends ProvinceCard {
    setupCardAbilities(ability) {
            this.reaction({
                title: 'Bow each attacking character',
                when: {
                    onProvinceRevealed: (event, context) => event.card === context.source
                },
                gameAction: ability.actions.bow(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.getType() === 'character' && card.isAttacking() )
                }))
            });
    }
}

FloodedWaste.id = 'flooded-waste';

module.exports = FloodedWaste;
