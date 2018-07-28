const DrawCard = require('../../drawcard.js');

class PerfectLandEthos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard each status token',
            effect: 'discard each status token',
            gameAction: [
                ability.actions.dishonor(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.isHonored)
                })),
                ability.actions.honor(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.isDishonored)
                }))
            ]
        });
    }
}

PerfectLandEthos.id = 'perfect-land-ethos';

module.exports = PerfectLandEthos;
