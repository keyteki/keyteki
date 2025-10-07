import Card from '../../Card.js';

class RaidingParty extends Card {
    // After Fight: If two keys of the same color are forged, steal
    // 2A. Otherwise, steal 1A.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.steal((context) => ({
                amount:
                    (context.player.keys.red && context.player.opponent.keys.red) ||
                    (context.player.keys.blue && context.player.opponent.keys.blue) ||
                    (context.player.keys.yellow && context.player.opponent.keys.yellow)
                        ? 2
                        : 1
            }))
        });
    }
}

RaidingParty.id = 'raiding-party';

export default RaidingParty;
