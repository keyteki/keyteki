import Card from '../../Card.js';

class SpecialistGuthrak extends Card {
    //  Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // After Fight/After Reap: Capture 1 Aember for each house represented among Specialist Guthrak and its neighbors.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.capture((context) => ({
                amount: context.game.getHousesInPlay(
                    context.source.neighbors.concat(context.source)
                ).length
            }))
        });
    }
}

SpecialistGuthrak.id = 'specialist-guthrak';

export default SpecialistGuthrak;
