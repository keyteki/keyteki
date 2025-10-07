import Card from '../../Card.js';

class Skollenbuzzz extends Card {
    // Play/After Reap: You may put a creature from your hand faceup
    // under Skŏllĕnbŭzzz.
    //
    // Destroyed: Put each creature under Skŏllĕnbŭzzz into play under your
    // control. Put Skŏllĕnbŭzzz on the top of your deck.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            condition: (context) => context.player.hand.length > 0,
            target: {
                controller: 'self',
                location: 'hand',
                cardType: 'creature',
                optional: true,
                gameAction: ability.actions.placeUnder((context) => ({
                    parent: context.source
                }))
            }
        });

        this.destroyed({
            gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                controller: context.source.controller,
                forEach: context.source.childCards
            })),
            effect: 'put each creature under {0} into play, and put {0} on top of their deck',
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.returnToDeck()
            }
        });
    }
}

Skollenbuzzz.id = 'skŏllĕnbŭzzz';

export default Skollenbuzzz;
