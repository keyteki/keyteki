const Card = require('../../Card.js');

class TotalRecall extends Card {
    // Play: For each friendly ready creature, gain 1A. Return each friendly creature to your hand.
    setupCardAbilities(ability) {
        this.play({
            effect: '{1}',
            effectArgs: (context) => {
                const ready = context.player.creaturesInPlay.filter((card) => !card.exhausted);
                const all = context.player.creaturesInPlay;
                const readyNames = ready.map((c) => c.name).join(', ');
                const allNames = all.map((c) => c.name).join(', ');
                if (all.length === 0) {
                    return 'do nothing as they have no creatures in play';
                }

                return `gain ${ready.length} amber for ${ready.length} ready creature${
                    ready.length === 1 ? '' : 's'
                } (${readyNames || 'none'}) and return ${allNames} to their hand`;
            },
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.filter((card) => !card.exhausted).length
                })),
                ability.actions.returnToHand((context) => ({
                    target: context.player.creaturesInPlay
                }))
            ]
        });
    }
}

TotalRecall.id = 'total-recall';

module.exports = TotalRecall;
