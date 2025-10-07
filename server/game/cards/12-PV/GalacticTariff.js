import Card from '../../Card.js';

class GalacticTariff extends Card {
    // This creature gains, "After Fight/After Reap: Capture 1A from your own side."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('fight', {
                reap: true,
                gameAction: ability.actions.capture((context) => ({
                    player: context.player
                }))
            })
        });
    }
}

GalacticTariff.id = 'galactic-tariff';

export default GalacticTariff;
