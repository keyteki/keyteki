const Card = require('../../Card.js');

class WerewolfCurse extends Card {
    // This creature gains splash-attack 3 and "After Fight: Archive
    // Werewolf Curse."
    //
    // Play: Enrage this creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.enrage((context) => ({
                target: context.source.parent
            }))
        });

        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ 'splash-attack': 3 }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.archive({ target: this })
                })
            ]
        });
    }
}

WerewolfCurse.id = 'werewolf-curse';

module.exports = WerewolfCurse;
