import Card from '../../Card.js';

class WildGrumpus extends Card {
    // Hazardous 3.
    // While on a flank, Wild Grumpus gains skirmish.
    // While not on a flank, Wild Grumpus gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isOnFlank(),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });

        this.persistentEffect({
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.addKeyword({ taunt: 1 })
        });
    }
}

WildGrumpus.id = 'wild-grumpus';

export default WildGrumpus;
