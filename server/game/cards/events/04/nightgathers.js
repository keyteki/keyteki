const DrawCard = require('../../../drawcard.js');

class NightGathers extends DrawCard {
    canPlay(player, card) {
        if(this !== card || player.phase !== 'marshal') {
            return false;
        }

        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return true;
        }

        if(otherPlayer.getTotalReserve() >= player.getTotalReserve()) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        var opponent = this.game.getOtherPlayer(player);
        if(!opponent) {
            return;
        }

        this.game.addMessage('{0} plays {1} to allow cards from {2}\'s discard pile to be marshaled', player, this, opponent);
        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.canMarshalFrom(opponent, 'discard pile')
        }));

        return true;
    }
}

NightGathers.code = '04046';

module.exports = NightGathers;
