const Card = require('../../Card.js');

class UnityOrDiscord extends Card {
    //Play: Choose one:
    // - Use a friendly non-Star Alliance creature.
    // - Return up to 2 friendly creatures and each upgrade attached to them to their owners' hands.
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
                useNonSA: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.player.creaturesInPlay.some(
                            (card) => !card.hasHouse('staralliance')
                        ) && context.selects.action.choice === 'Use a non-Star Alliance creature',
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => !card.hasHouse('staralliance'),
                    gameAction: ability.actions.use()
                },
                returnToHand: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.player.creaturesInPlay.length > 0 &&
                        context.selects.action.choice === 'Return creatures and upgrades',
                    mode: 'upTo',
                    numCards: 2,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.returnToHand((context) => ({
                        target: context.targets.returnToHand
                            ? context.targets.returnToHand.reduce(
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

module.exports = UnityOrDiscord;
