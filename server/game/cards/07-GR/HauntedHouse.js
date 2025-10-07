import Card from '../../Card.js';

class HauntedHouse extends Card {
    // At the start of your turn, if you are not haunted, discard the
    // top card of your deck.
    //
    // Omni: If you are haunted, gain 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    context.player === this.game.activePlayer &&
                    context.player.deck.length > 0 &&
                    !context.player.isHaunted()
            },
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck[0]
            }))
        });

        this.omni({
            condition: (context) => context.player.isHaunted(),
            gameAction: ability.actions.gainAmber()
        });
    }
}

HauntedHouse.id = 'haunted-house';

export default HauntedHouse;
