const ProvinceCard = require('../../provincecard.js');

class PublicForum extends ProvinceCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent break and add Honor token',
            when: {
                onBreakProvince: (event, context) => event.card === context.source && !event.card.hasToken('honor')
            },
            effect: 'add an honor token to {0} instead of breaking it',
            handler: context => {
                context.cancel();
                context.event.card.addToken('honor');
            }
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

PublicForum.id = 'public-forum';

module.exports = PublicForum;
