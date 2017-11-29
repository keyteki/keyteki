const ProvinceCard = require('../../provincecard.js');

class PublicForum extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Prevent break and add Honor token',
            when: {
                onBreakProvince: event => event.province === this && !event.province.hasToken('honor')
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
