import Card from '../../Card.js';

class WasteNot extends Card {
    // Play: Destroy a friendly creature. Draw cards equal to half that creature's power (rounding up).
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: [
                    ability.actions.destroy(),
                    ability.actions.draw((context) => ({
                        target: context.player,
                        amount: context.target ? Math.ceil(context.target.power * 0.5) : 0
                    }))
                ]
            },
            effect: 'destroy {0} and draw {1} cards',
            effectArgs: (context) => (context.target ? Math.ceil(context.target.power * 0.5) : 0)
        });
    }
}

WasteNot.id = 'waste-not';

export default WasteNot;
