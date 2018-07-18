const DrawCard = require('../../drawcard.js');

class IkebanaArtisan extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Lose fate instead of honor',
            when: {
                onModifyHonor: (event, context) => event.dueToUnopposed && event.player === context.player
            },
            limit: ability.limit.unlimitedPerConflict(),
            effect: 'lose 1 fate rather than 1 honor for not defending the conflict',
            effectArgs: context => context.event.card,
            handler: context => {
                context.event.window.addEvent(ability.actions.gainFate({player: context.player, amount: -1}).getEvent(context.player, context));
                context.cancel();
            }
        });
    }
}

IkebanaArtisan.id = 'ikebana-artisan';

module.exports = IkebanaArtisan;
