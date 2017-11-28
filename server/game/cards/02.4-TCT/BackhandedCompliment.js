const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class BackhandedCompliment extends DrawCard {
    setupCardAbilities() {
        let choices = {
            "Me": () => true
        }
        if(this.controller.opponent) {
            choices["My Opponent"] = () => true;
        }
        this.action({
            title: 'Select a player to lose an honor and draw a card',
            target: {
                player: 'self',
                mode: 'select',
                choices: choices
            },
            handler: context => {
                let player = context.select === "Me" ? this.controller : this.controller.opponent;
                this.game.addHonor(player, -1);
                player.drawCardsToHand(1);
                if(context.select === "Me") {                    
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
