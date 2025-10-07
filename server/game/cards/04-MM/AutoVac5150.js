import Card from '../../Card.js';

class AutoVac5150 extends Card {
    // Action: You may discard a card from your archives. If you do, keys cost +3A during your opponents next turn. Otherwise, archive a card.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Discard a card from your archives or archive a card',
                controller: 'self',
                location: 'any',
                cardCondition: (card) => card.location === 'archives' || card.location === 'hand',
                gameAction: ability.actions.conditional({
                    condition: (context) =>
                        context.target && context.target.location === 'archives',
                    trueGameAction: ability.actions.sequential([
                        ability.actions.discard(),
                        ability.actions.nextRoundEffect({
                            targetController: 'any',
                            effect: ability.effects.modifyKeyCost(3)
                        })
                    ]),
                    falseGameAction: ability.actions.archive()
                })
            },
            message: '{0} uses {1} to {2}',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.target
                    ? "raise key cost by 3 during their opponent's next turn"
                    : 'archive a card',
                'y'
            ]
        });
    }
}

AutoVac5150.id = 'auto-vac-5150';

export default AutoVac5150;
