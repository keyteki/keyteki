const Card = require('../../Card.js');

class VoiceOfRakuzel extends Card {
    //While the tide is high, friendly creatures gain +1 power and +1 armor.
    //While the tide is low, enemy creatures gain +1 power and +1 armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideHigh(),
            match: (card) => card.type === 'creature',
            effect: [ability.effects.modifyPower(1), ability.effects.modifyArmor(1)]
        });
        this.persistentEffect({
            condition: (context) => context.player.isTideLow(),
            match: (card) => card.type === 'creature',
            targetController: 'opponent',
            effect: [ability.effects.modifyPower(1), ability.effects.modifyArmor(1)]
        });
    }
}

VoiceOfRakuzel.id = 'voice-of-rakuzel';

module.exports = VoiceOfRakuzel;
