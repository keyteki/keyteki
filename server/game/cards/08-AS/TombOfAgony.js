import Card from '../../Card.js';

class TombOfAgony extends Card {
    // This creature gains, “After Reap: Purge an enemy creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.purge()
                }
            })
        });
    }
}

TombOfAgony.id = 'tomb-of-agony';

export default TombOfAgony;
