import Card from '../../Card.js';
class EpicPoem extends Card {
    // Play: Exalt a friendly creature. Gain 1 amber for each  on that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: false,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.exalt(),
                    ability.actions.gainAmber((context) => ({
                        amount: context.target.amber,
                        target: context.player
                    }))
                ])
            },
            effect: 'exalt {0} and gain {1} amber',
            effectArgs: (context) => [context.target.amber + 1]
        });
    }
}

EpicPoem.id = 'epic-poem';
export default EpicPoem;
