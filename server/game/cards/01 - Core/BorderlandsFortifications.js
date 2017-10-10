const DrawCard = require('../../drawcard.js');

class BorderlandsFortifications extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch this card with another',
            target: {
                cardCondition: card => card.isDynasty && ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to swap it with {2}', this.controller, this, context.target.facedown ? 'a facedown card' : context.target);
                let location = this.location;
                this.controller.removeCardFromPile(this);
                this.controller.removeCardFromPile(context.target);
                this.moveTo(context.target.location);
                context.target.moveTo(location);
                this.controller.getSourceList(location).push(context.target);
                this.controller.getSourceList(this.location).push(this);
            }
        });
    }
}

BorderlandsFortifications.id = 'borderlands-fortifications';

module.exports = BorderlandsFortifications;
