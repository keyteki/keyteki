import Card from '../../Card.js';

class ElenyaTheCharming extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // After you forge a key, give control of the most powerful
    // friendly creature to your opponent.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.source.controller
            },
            effect: 'give control of {1} to {2}',
            effectArgs: (context) => [context.target, context.player.opponent],
            condition: (context) => !!context.player.opponent,
            target: {
                cardType: 'creature',
                controller: 'self',
                mode: 'mostStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            }
        });
    }
}

ElenyaTheCharming.id = 'elenya-the-charming';

export default ElenyaTheCharming;
