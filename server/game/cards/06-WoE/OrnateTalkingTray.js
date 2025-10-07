import Card from '../../Card.js';

class OrnateTalkingTray extends Card {
    // Omni: Destroy Ornate Talking Tray. Make a token creature.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'destroy {1} and make a token creature',
            effectArgs: (context) => context.source,
            gameAction: ability.actions.sequential([
                ability.actions.destroy(),
                ability.actions.makeTokenCreature()
            ])
        });
    }
}

OrnateTalkingTray.id = 'ornate-talking-tray';

export default OrnateTalkingTray;
