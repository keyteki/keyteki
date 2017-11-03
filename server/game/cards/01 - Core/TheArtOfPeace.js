const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class TheArtOfPeace extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onBreakProvince: event => event.province === this && (event.conflict.attackers.length > 0 || event.conflict.defenders.length > 0)
            },
            handler: context => {
                let events = [];
                _.each(context.event.conflict.attackers, card => events.push({
                    name: 'onCardDishonored',
                    params: { player: this.controller, card: card, source: this },
                    handler: () => card.dishonor()
                }));
                _.each(context.event.conflict.defenders, card => events.push({
                    name: 'onCardHonored',
                    params: { player: this.controller, card: card, source: this },
                    handler: () => card.honor()
                }));
                this.game.addMessage('{0} uses {1} to dishonor all attackers and honor all defenders in this conflict', this.controller, this);
                this.game.raiseMultipleEvents(events);
            }
        });
    }
}

TheArtOfPeace.id = 'the-art-of-peace';

module.exports = TheArtOfPeace;
