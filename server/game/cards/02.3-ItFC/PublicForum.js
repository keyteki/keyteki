const ProvinceCard = require('../../provincecard.js');

class PublicForum extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onBreakProvince: event => event.province === this && !event.province.hasToken('honor'),
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} adds an honor token to {1} instead of breaking it', this.controller, this);
                context.cancel();
                context.event.province.addToken('honor');
             }
        });
    }
}

PublicForum.id = 'public-forum';

module.exports = PublicForum;
