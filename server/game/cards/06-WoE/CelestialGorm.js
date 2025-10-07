import Card from '../../Card.js';

class CelestialGorm extends Card {
    //Omni: Destroy $this. Return each other artifact to its owner's hand.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.source
                })),
                ability.actions.returnToHand((context) => ({
                    target: context.game.cardsInPlay.filter(
                        (card) => card.type === 'artifact' && card !== context.source
                    )
                }))
            ]),
            effect: "destroy {0} and return each other artifact to its owner's hand"
        });
    }
}

CelestialGorm.id = 'celestial-gorm';

export default CelestialGorm;
