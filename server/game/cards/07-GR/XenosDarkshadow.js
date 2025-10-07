import Card from '../../Card.js';

class XenosDarkshadow extends Card {
    // Assault X. Hazardous X. Splash-attack X.
    //
    // X is the number of cards in your discard pile.
    //
    // Destroyed: If you are haunted, archive Xenos Darkshadow.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.addKeyword((_, context) => ({
                    assault: context.source.controller.discard.length,
                    hazardous: context.source.controller.discard.length,
                    'splash-attack': context.source.controller.discard.length
                })),
                ability.effects.modifyPower(
                    (_, context) => context.source.controller.discard.length
                ),
                ability.effects.modifyArmor(
                    (_, context) => context.source.controller.discard.length
                )
            ]
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

XenosDarkshadow.id = 'xenos-darkshadow';

export default XenosDarkshadow;
