import Card from '../../Card.js';

class RevoHooligans extends Card {
    // After Reap: Put a paint counter on an artifact. While that
    // artifact has a paint counter, it belongs to house Mars (instead
    // of its other houses).
    setupCardAbilities(ability) {
        this.reap({
            effect: 'put a paint counter on {0}, making it belong to house Mars',
            target: {
                cardType: 'artifact',
                gameAction: [
                    ability.actions.addPaintCounter(),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: context.target,
                        until: {
                            onAddToken: (event) =>
                                event.card == context.target && !context.target.tokens.paint,
                            onSwap: (event) =>
                                (event.card == context.target || event.origin == context.target) &&
                                !context.target.tokens.paint
                        },
                        effect: ability.effects.changeHouse('mars')
                    }))
                ]
            }
        });
    }
}

RevoHooligans.id = 'revo-hooligans';

export default RevoHooligans;
