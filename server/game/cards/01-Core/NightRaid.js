const ProvinceCard = require('../../provincecard.js');

class NightRaid extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard cards equal to the number of attackers',
            when: {
                onProvinceRevealed: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.chosenDiscard(() => ({
                amount: this.game.currentConflict ? this.game.currentConflict.getNumberOfParticipantsFor('attacker') : 0
            }))
        });
    }
}

NightRaid.id = 'night-raid';

module.exports = NightRaid;
