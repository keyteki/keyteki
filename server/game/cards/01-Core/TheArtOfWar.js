const ProvinceCard = require('../../provincecard.js');

class TheArtOfWar extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Draw 3 cards',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.draw({ amount: 3 })
        });
    }
}

TheArtOfWar.id = 'the-art-of-war';

module.exports = TheArtOfWar;
