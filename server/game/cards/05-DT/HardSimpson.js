import Card from '../../Card.js';

class HardSimpson extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // (T) After Hard Simpson is dealt damage, steal 1A. If the tide is low, your opponent steals 1A instead. (Hard Simpson must survive this damage.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageApplied: (event, context) =>
                    event.card === context.source && !event.destroyEvent
            },
            gameAction: ability.actions.steal((context) => ({
                target: context.player.isTideLow() ? context.player : context.player.opponent
            }))
        });
    }
}

HardSimpson.id = 'hard-simpson';

export default HardSimpson;
