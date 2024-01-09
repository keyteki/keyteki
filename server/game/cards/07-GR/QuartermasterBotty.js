const Card = require('../../Card.js');

class QuartermasterBotty extends Card {
    // Play/After Fight/After Reap: If you are haunted, capture 2A.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            condition: (context) => context.player.isHaunted(),
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

QuartermasterBotty.id = 'quartermaster-botty';

module.exports = QuartermasterBotty;
