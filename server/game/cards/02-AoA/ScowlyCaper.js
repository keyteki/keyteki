const Card = require('../../Card.js');

class ScowlyCaper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse(card => card === this)
        });

        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.player.opponent)
            }))
        });

        this.interrupt({
            when: {
                onRoundEnded: (event, context) =>
                    context.player === this.game.activePlayer
            },
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ScowlyCaper.id = 'scowly-caper';

module.exports = ScowlyCaper;
