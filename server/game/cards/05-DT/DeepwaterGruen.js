import Card from '../../Card.js';

class DeepwaterGruen extends Card {
    // (T) Play/Reap: If the tide is low, your opponent gains 1A.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            condition: (context) => context.player.isTideLow(),
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

DeepwaterGruen.id = 'deepwater-gruen';

export default DeepwaterGruen;
