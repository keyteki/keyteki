import Card from '../../Card.js';

class HandCannon extends Card {
    // This creature gains skirmish and, "Fight: Move 1A from the creature this creature fights to your pool."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.gainAbility('fight', {
                    condition: (context) => context.event.card.amber > 0,
                    gameAction: ability.actions.gainAmber(),
                    then: (context) => ({
                        gameAction: ability.actions.removeAmber({
                            target: context.event.card
                        })
                    }),
                    effect: 'move 1 amber from {1} to their pool',
                    effectArgs: (context) => context.event.card
                })
            ]
        });
    }
}

HandCannon.id = 'hand-cannon';

export default HandCannon;
