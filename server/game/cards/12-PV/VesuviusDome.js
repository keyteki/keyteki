import Card from '../../Card.js';

class VesuviusDome extends Card {
    // Action: Move each A from each creature to the common supply. Destroy each creature. Destroy Vesuvius Dome.
    setupCardAbilities(ability) {
        this.action({
            effect:
                'move all amber from creatures to the common supply, destroy all creatures, and destroy itself',
            gameAction: ability.actions.sequential([
                ability.actions.removeAmber((context) => ({
                    all: true,
                    target: context.game.creaturesInPlay
                })),
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.destroy()
            ])
        });
    }
}

VesuviusDome.id = 'vesuvius-dome';

export default VesuviusDome;
