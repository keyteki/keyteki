const ProvinceCard = require('../../provincecard.js');

class PublicForum extends ProvinceCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onBreakProvince: event => event.province === this && !event.province.hasHonorToken,
            },
            canCancel: true,
            handler: context => {
                context.cancel();
                context.event.province.hasHonorToken = true;
                this.game.addMessage('{0} adds an honor token to {1} instead of breaking it', this.controller, this);
            }
        });
    }
}

PublicForum.id = 'public-forum';

module.exports = PublicForum;
