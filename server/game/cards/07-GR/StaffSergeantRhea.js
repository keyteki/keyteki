import Card from '../../Card.js';

class StaffSergeantRhea extends Card {
    // Staff Sergeant Rhea's neighbors may be used as if they belonged
    // to house Star Alliance.
    //
    // Scrap: Ready and use a friendly creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse(
                (card, context, effectContext) =>
                    context.game.activePlayer.activeHouse === 'staralliance' &&
                    effectContext.source.neighbors.includes(card)
            )
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {0}'
        });
    }
}

StaffSergeantRhea.id = 'staff-sergeant-rhea';

export default StaffSergeantRhea;
