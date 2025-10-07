import Card from '../../Card.js';

class FreebooterFaye extends Card {
    // (T) Play: Raise the tide.
    // (T) Reap: If the tide is high, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });

        this.reap({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal()
        });
    }
}

FreebooterFaye.id = 'freebooter-faye';

export default FreebooterFaye;
