import Card from '../../Card.js';

class NamelsConfession extends Card {
    // Play: Destroy a friendly creature. If you do, gain A equal to half its power (rounding down the gain).
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            effect: 'destroy {0} and gain amber equal to half its power',
            then: {
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents.every((event) => !event.cancelled),
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: Math.floor(context.preThenEvents[0].clone.modifiedPower / 2)
                }))
            }
        });
    }
}

NamelsConfession.id = 'namel-s-confession';

export default NamelsConfession;
