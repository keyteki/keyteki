const Card = require('../../Card.js');

class MissileOfficerMyers extends Card {
    // Play/After Reap: Resolve the play effect of a neighboring
    // creature as if you had just played it.
    //
    // Scrap: You may play 1 card that is not of the active house
    // during your turn.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.resolveAbility({
                    ability: (ability) => ability.isPlay()
                })
            }
        });

        this.scrap({
            effect: 'play 1 card that is not of the active house during their turn',
            gameAction: ability.actions.untilPlayerTurnEnd((context) => ({
                effect: ability.effects.canPlayNonHouse(context.player.activeHouse)
            }))
        });
    }
}

MissileOfficerMyers.id = 'missile-officer-myers';

module.exports = MissileOfficerMyers;
