const DrawCard = require('../../drawcard.js');

class MiwakuKabe extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Shuffle this into deck',
            when: {
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            },
            effect: 'shuffle itself back into the dynasty deck',
            handler: context => {
                const location = context.source.location;
                context.player.moveCard(context.source, 'dynasty deck');
                this.game.queueSimpleStep(() => context.player.shuffleDynastyDeck());
                this.game.queueSimpleStep(() => context.player.replaceDynastyCard(location));
            }
        });
    }
}

MiwakuKabe.id = 'miwaku-kabe';

module.exports = MiwakuKabe;
