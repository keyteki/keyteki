const PlotCard = require('../../../plotcard.js');

class WraithsInTheirMidst extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseEnded']);
    }

    onPhaseEnded(event, phase) {
        if(phase !== 'plot') {
            return;
        }

        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer) {
            return;
        }

        this.untilEndOfRound(ability => ({
            match: otherPlayer.activePlot,
            effect: ability.effects.modifyReserve(-2)
        }));
    }
}

WraithsInTheirMidst.code = '02080';

module.exports = WraithsInTheirMidst;
