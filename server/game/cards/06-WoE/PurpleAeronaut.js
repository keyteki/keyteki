import Card from '../../Card.js';

class PurpleAeronaut extends Card {
    // After 4 friendly Pilot creatures are used in the same turn, a
    // friendly Nautilixian gains "After Fight: Destroy each enemy creature.”
    // for the remainder of that turn.
    setupCardAbilities(ability) {
        this.persistentEffect({
            // Note: this isn't technically correct, because it gives
            // the "After fight" to _all_ friendly Nautilixians, whereas
            // technically you need to choose one for each Purple Aeronaut
            // you have in play.  That seems too complicated, so I propose
            // leaving it like this until we get complaints (and then I
            // propose ignoring those complaints).
            match: (card, context) =>
                card.name === 'Nautilixian' &&
                card.controller === context.source.controller &&
                this.game.cardsUsed.filter(
                    (c) =>
                        c.hasTrait('pilot') &&
                        c.type === 'creature' &&
                        c.controller === context.player
                ).length >= 4,
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.controller !== context.player
                    )
                }))
            })
        });
    }
}

PurpleAeronaut.id = 'purple-aeronaut';

export default PurpleAeronaut;
