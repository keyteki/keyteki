import Card from '../../Card.js';

class TrojanSauropod extends Card {
    // Trojan Sauropod enters play under your opponent’s control.
    // Omni: Gain 3A. Your opponent reveals their hand and puts each creature from it into play ready, then refills their hand as if it were their "draw cards" step. Destroy Trojan Sauropod.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayUnderOpponentsControl()
        });

        this.omni({
            effect:
                "gain 3 amber, revel their opponent's hand as {1} and play each of their creature",
            effectArgs: (context) =>
                context.player.opponent ? [context.player.opponent.hand] : [],
            gameAction: ability.actions.gainAmber({ amount: 3 }),
            then: {
                condition: (context) => context.player.opponent,
                gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                    revealList: context.player.opponent.hand,
                    forEach: context.player.opponent.hand.filter(
                        (card) => card.type === 'creature'
                    ),
                    ready: true
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: [
                        ability.actions.draw((context) => ({
                            refill: true,
                            target: context.player.opponent
                        })),
                        ability.actions.destroy()
                    ]
                }
            }
        });
    }
}

TrojanSauropod.id = 'trojan-sauropod';

export default TrojanSauropod;
