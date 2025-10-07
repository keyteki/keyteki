import Card from '../../Card.js';

class GormOfOmm extends Card {
    // Omni: Sacrifice Gorm of Omm. Destroy an artifact.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'artifact',
                    gameAction: ability.actions.destroy()
                },
                message: '{0} uses {1} to destroy {2}'
            }
        });
    }
}

GormOfOmm.id = 'gorm-of-omm';

export default GormOfOmm;
