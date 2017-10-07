const DrawCard = require('../../drawcard.js');

class BorderlandsFortifications extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch this card with another',
            location: ['province 1', 'province 2', 'province 3', 'province 4'],
            target: {
                cardCondition: card => card.isDynasty && ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to swap it with {2}', this.controller, this, context.target.facedown ? 'a facedown card' : context.target);
                let location = this.location;
                this.moveTo(context.target.location);
                context.target.moveTo(location);
            }
        });
    }
}

BorderlandsFortifications.id = 'borderlands-fortifications';

module.exports = BorderlandsFortifications;
