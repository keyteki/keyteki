import Card from '../../Card.js';

class GloriousTradition extends Card {
    // Action: Exalt each enemy flank creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.exalt((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.isOnFlank() && card.controller !== context.player
                )
            }))
        });
    }
}

GloriousTradition.id = 'glorious-tradition';

export default GloriousTradition;
