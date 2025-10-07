import Card from '../../Card.js';

class RevivedZaOrha extends Card {
    // Play: If your opponent has more forged keys than you, forge a key at
    // current cost. If you do, purge Revived Ză-Orhă.
    //
    // Destroyed: If you are haunted, archive Revived Ză-Orhă.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.getForgedKeys() > context.player.getForgedKeys(),
            gameAction: ability.actions.forgeKey(),
            then: {
                gameAction: ability.actions.purge((context) => ({
                    target: context.source
                }))
            }
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

RevivedZaOrha.id = 'revived-ză-orhă';

export default RevivedZaOrha;
