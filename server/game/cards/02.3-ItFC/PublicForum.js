const ProvinceCard = require('../../provincecard.js');

class PublicForum extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Prevent break and add Honor token',
            when: {
                onBreakProvince: event => event.card === this && !event.card.hasToken('honor')
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} adds an honor token to {1} instead of breaking it', this.controller, this);
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
