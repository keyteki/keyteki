const Card = require('../../Card.js');

class EldritchSynan extends Card {
    // Eldritch Synan cannot be dealt damage by damaged creatures.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('damage', (context, effectContext, event) => {
                if (context.source === effectContext.source) {
                    return context.target && context.target.damage;
                }

                if (event && event.card === effectContext.source) {
                    let source = event.damageSource;
                    if (!source) {
                        return false;
                    }
                    if (event.fightEvent) {
                        // Use clones when possible to make sure we
                        // get the pre-fight damage status.
                        if (event.fightEvent.attacker === source) {
                            source = event.fightEvent.attackerClone;
                        } else if (event.fightEvent.attackerTarget === source) {
                            source = event.fightEvent.attackerTargetClone;
                        }
                    }

                    return source.type === 'creature' && source.damage;
                }

                return context.source.type === 'creature' && context.source.damage;
            })
        });
    }
}

EldritchSynan.id = 'eldritch-synan';

module.exports = EldritchSynan;
