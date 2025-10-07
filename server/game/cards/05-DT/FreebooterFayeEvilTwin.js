import Card from '../../Card.js';

class FreebooterFayeEvilTwin extends Card {
    // (T) Play: Raise the tide.
    // (T) Before Fight: If the tide is high, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });

        this.beforeFight({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal()
        });
    }
}

FreebooterFayeEvilTwin.id = 'freebooter-faye-evil-twin';

export default FreebooterFayeEvilTwin;
