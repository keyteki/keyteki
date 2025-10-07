import Card from '../../Card.js';

class HonorsKeysis extends Card {
    // Play: Forge a key at +7A current cost, reduced by 1A for each card you have played this turn (including this one). If you do, purge Honors Keysis.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier: 7 - context.game.cardsPlayed.length
            })),
            then: {
                gameAction: ability.actions.purge()
            }
        });
    }
}

HonorsKeysis.id = 'honors-keysis';

export default HonorsKeysis;
