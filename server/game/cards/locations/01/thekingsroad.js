const DrawCard = require('../../../drawcard.js');

class TheKingsroad extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
    }

    onClick(player) {
        if(player.phase !== 'marshal' || this.controller !== player || this.kneeled) {
            return false;
        }

        player.kneelCard(this);
        player.sacrificeCard(this);
        this.game.addMessage('{0} kneels and sacrifices {1} to reduce the cost of the next character by 3', player, this);

        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceNextMarshalledCardCost(3, card => card.getType() === 'character')
        }));

        return true;
    }
}

TheKingsroad.code = '01039';

module.exports = TheKingsroad;
