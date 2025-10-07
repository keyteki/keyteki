import Card from '../../Card.js';

class AbyssalSight extends Card {
    // Play: Destroy a friendly creature. If you do, look at your opponent's hand and choose a card from it. That player discards that card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to destroy',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                condition: (context) => !!context.player.opponent,
                target: {
                    controller: 'opponent',
                    revealTargets: true,
                    location: 'hand',
                    gameAction: ability.actions.discard()
                }
            }
        });
    }
}

AbyssalSight.id = 'abyssal-sight';

export default AbyssalSight;
