import Card from '../../Card.js';

class EchoGuardian extends Card {
    // While you are haunted, Echo Guardian gets +2 power and gains poison.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isHaunted(),
            effect: [
                ability.effects.addKeyword({
                    poison: 1
                }),
                ability.effects.modifyPower(2)
            ]
        });
    }
}

EchoGuardian.id = 'echo-guardian';

export default EchoGuardian;
