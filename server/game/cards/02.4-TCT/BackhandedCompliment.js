const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class BackhandedCompliment extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Select a player to lose an honor and draw a card',
            target: {
                player: 'self',
                mode: 'select',
                choices: _.extend({}, ..._.map(this.game.getPlayers(), player => ({[player.name]: () => true})))
            },
            handler: context => {
                let player = this.game.getPlayerByName(context.select);
                this.game.addHonor(player, -1);
                player.drawCardsToHand(1);
                if(player.name === this.controller.name) {                    
                    this.game.addMessage('{0} uses {1} to lose an honor and draw a card', this.controller, this);
                } else {                    
                    this.game.addMessage('{0} uses {1} to make {2} lose an honor and draw a card', this.controller, this, player);
                }
            }
        });
    }
}

BackhandedCompliment.id = 'backhanded-compliment';

module.exports = BackhandedCompliment;
