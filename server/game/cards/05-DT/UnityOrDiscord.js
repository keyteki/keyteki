import Card from '../../Card.js';

class UnityOrDiscord extends Card {
    // Play: Choose one:
    // • Use a friendly non-Star Alliance creature.
    // • Return up to 2 friendly creatures and each upgrade attached to them to their owners’ hands.
    //
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Use a non-Star Alliance creature': () => true,
                        'Return creatures and upgrades': () => true
                    }
                },
                'Use a non-Star Alliance creature': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => !card.hasHouse('staralliance'),
                    gameAction: ability.actions.use()
                },
                'Return creatures and upgrades': {
                    dependsOn: 'action',
                    mode: 'upTo',
                    numCards: 2,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand((context) => ({
                        target:
                            context.targets && context.targets['Return creatures and upgrades']
                                ? context.targets['Return creatures and upgrades'].reduce(
                                      (all, card) => all.concat(card.upgrades).concat(card),
                                      []
                                  )
                                : []
                    }))
                }
            }
        });
    }
}

UnityOrDiscord.id = 'unity-or-discord';

export default UnityOrDiscord;
