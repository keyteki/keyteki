import Card from '../../Card.js';

class KajuZhan extends Card {
    // While Kaju Zhan is attacking, ignore armor and taunt
    // After Fight: Put an enemy creature on top of its owner's deck
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [ability.effects.ignores('armor'), ability.effects.ignores('taunt')]
        });

        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToDeck({ top: true })
            }
        });
    }
}

KajuZhan.id = 'kaju-zhan';

export default KajuZhan;
