const Card = require('../../Card.js');

class LashOfBrokenDreams extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LashOfBrokenDreams.id = 'lash-of-broken-dreams'; // This is a guess at what the id might be - please check it!!!

module.exports = LashOfBrokenDreams;
