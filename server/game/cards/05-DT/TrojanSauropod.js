const Card = require('../../Card.js');

class TrojanSauropod extends Card {
    // Trojan Sauropod enters play under your opponent’s control.
    // Omni: Gain 3A. Your opponent reveals their hand and puts each creature from it into play ready, then refills their hand as if it were their "draw cards" step. Destroy Trojan Sauropod.
    setupCardAbilities(ability) {
        //Trojan Sauropod enters play under your opponent's control.
        //Omni: Gain 3. Your opponent reveals their hand and puts each creature from it into play ready,
        //then refills their hand as if it were their "draw cards" step. Destroy Trojan Sauropod.
        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            effect: ability.effects.entersPlayUnderOpponentsControl()
        });

        this.omni({
            effect:
                "gain 3 amber, revel their opponent's hand as {1} and play each of their creature",
            effectArgs: (context) => (context.player.opponent ? context.player.opponent.hand : []),
            gameAction: ability.actions.gainAmber({ amount: 3 }),
            then: {
                condition: (context) => context.player.opponent,
                gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                    forEach: context.player.opponent.hand.filter(
                        (card) => card.type === 'creature'
                    ),
                    action: ability.actions.putIntoPlay()
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.draw((context) => ({
                        refill: true,
                        target: context.player.opponent
                    }))
                }
            }
        });
    }
}

TrojanSauropod.id = 'trojan-sauropod';

module.exports = TrojanSauropod;
