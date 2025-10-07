import Card from '../../Card.js';

class SoboggsThingamabob extends Card {
    // After your opponent forges a key, exhaust each creature they control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

SoboggsThingamabob.id = 'sobogg-s-thingamabob';

export default SoboggsThingamabob;
