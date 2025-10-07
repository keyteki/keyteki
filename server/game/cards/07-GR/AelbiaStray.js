import Card from '../../Card.js';

class AelbiaStray extends Card {
    // If you are haunted, Ælbia Stray enters play ready.
    //
    // After Reap: Capture 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isHaunted(),
            effect: ability.effects.entersPlayReady()
        });

        this.reap({
            gameAction: ability.actions.capture()
        });
    }
}

AelbiaStray.id = 'ælbia-stray';

export default AelbiaStray;
