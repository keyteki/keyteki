import Card from '../../Card.js';

class ReplayPod extends Card {
    // Each friendly Mars creature gains "Destroyed: Place this
    // creature facedown under Replay Pod."
    //
    // Action: Put each card under Replay Pod into your hand. Purge Replay Pod.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.hasHouse('mars'),
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.placeUnder((context) => {
                    const pods = context.player.cardsInPlay.filter(
                        (c) => c.id === 'replay-pod' && c.controller === context.source.controller
                    );
                    const firstPod = pods[0];
                    if (pods.length <= 1) {
                        return { parent: firstPod, facedown: true };
                    }
                    // The windows coalesce abilities from cards of the same name into a single ability
                    // So we must explicitly ask the user to choose which pod to use if there are more than one.
                    return {
                        parent: firstPod, // provisional for legality checks
                        facedown: true,
                        promptWithHandlerMenu: {
                            activePromptTitle: 'Choose a Replay Pod',
                            cards: pods,
                            customHandler: (chosenPod, action) => {
                                action.parent = chosenPod; // set the actual parent
                                action.setTarget(context.source); // ensure target remains the destroyed creature
                            }
                        }
                    };
                })
            })
        });

        this.action({
            effect: 'return the cards under it to hand and purge {0}',
            gameAction: [
                ability.actions.returnToHand((context) => ({
                    location: 'under',
                    target: context.source.childCards
                })),
                ability.actions.purge()
            ]
        });
    }
}

ReplayPod.id = 'replay-pod';

export default ReplayPod;
