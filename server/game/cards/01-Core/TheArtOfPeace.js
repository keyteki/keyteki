const ProvinceCard = require('../../provincecard.js');

class TheArtOfPeace extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Honor all defenders and dishonor all attackers',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && (
                    event.conflict.attackers.some(card => card.allowGameAction('honor', context)) || 
                    event.conflict.defenders.some(card => card.allowGameAction('dishonor', context))
                )
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to dishonor all attackers and honor all defenders in this conflict', this.controller, this);
                this.game.applyGameAction(context, { honor: context.event.conflict.defenders, dishonor: context.event.conflict.attackers });
            }
        });
    }
}

TheArtOfPeace.id = 'the-art-of-peace';

module.exports = TheArtOfPeace;
