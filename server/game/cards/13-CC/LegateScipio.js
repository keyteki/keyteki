import Card from '../../Card.js';

class LegateScipio extends Card {
    // Enhance .
    // Play: You may exalt each Saurian creature.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            gameAction: ability.actions.exalt((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse('saurian'))
            })),
            effect: 'exalt each Saurian creature'
        });
    }
}

LegateScipio.id = 'legate-scipio';

export default LegateScipio;
