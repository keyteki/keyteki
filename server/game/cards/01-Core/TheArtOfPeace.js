const ProvinceCard = require('../../provincecard.js');

class TheArtOfPeace extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Honor all defenders and dishonor all attackers',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            effect: 'dishonor all attackers and honor all defenders in this conflict',
            gameAction: [
                ability.actions.dishonor(context => ({ target: context.event.conflict.attackers })),
                ability.actions.honor(context => ({ target: context.event.conflict.defenders }))
            ]
        });
    }
}

TheArtOfPeace.id = 'the-art-of-peace';

module.exports = TheArtOfPeace;
