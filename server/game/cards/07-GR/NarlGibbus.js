import Card from '../../Card.js';

class NarlGibbus extends Card {
    // While enraged Narl Gibbus gains skirmish and splash-attack 3.
    //
    // Play/After Reap: Enrage Narl Gibbus.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.enrage()
        });

        this.persistentEffect({
            condition: (context) => context.source.enraged,
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.addKeyword({ 'splash-attack': 3 })
            ]
        });
    }
}

NarlGibbus.id = 'narl-gibbus';

export default NarlGibbus;
