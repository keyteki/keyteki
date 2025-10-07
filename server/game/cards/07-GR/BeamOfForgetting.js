import _ from 'underscore';
import Card from '../../Card.js';

class BeamOfForgetting extends Card {
    // Play: Reveal a random card from your opponent’s hand. Put that
    // card on the bottom of their deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            effect: "reveal a random card from {1}'s hand and put it on the bottom of their deck",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.reveal((context) => ({
                location: 'hand',
                chatMessage: true,
                target: _.shuffle(context.player.opponent.hand)[0]
            })),
            then: (
                preThenContext,
                revealedCard = preThenContext.ability.gameAction[0].target[0]
            ) => ({
                gameAction: ability.actions.returnToDeck({
                    target: revealedCard,
                    bottom: true
                })
            })
        });
    }
}

BeamOfForgetting.id = 'beam-of-forgetting';

export default BeamOfForgetting;
