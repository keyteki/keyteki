const DrawCard = require('../../drawcard.js');

class BorderlandsFortifications extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch this card with another',
            target: {
                location: 'province',
                controller: 'self',
                cardCondition: card => card.isDynasty
            },
            effect: 'swap it with {0}',
            handler: context => {
                let location = context.source.location;
                context.player.removeCardFromPile(context.source);
                context.player.removeCardFromPile(context.target);
                context.source.moveTo(context.target.location);
                context.target.moveTo(location);
                context.player.getSourceList(location).push(context.target);
                context.player.getSourceList(context.source.location).push(context.source);
            }
        });
    }
}

BorderlandsFortifications.id = 'borderlands-fortifications';

module.exports = BorderlandsFortifications;
