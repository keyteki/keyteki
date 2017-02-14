const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class HouseOfTheUndying extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Control opponent\'s dead characters',
            method: 'controlDeadCharacters',
            phase: 'challenge'
        });
    }

    controlDeadCharacters() {
        this.controller.moveCard(this, 'out of game');

        var opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return;
        }

        var eligibleCharacters = opponent.deadPile.filter(card => {
            if(!card.isUnique()) {
                return true;
            }

            return opponent.deadPile.filter(c => c.name === card.name).length === 1;
        });

        _.each(eligibleCharacters, card => {
            this.game.takeControl(this.controller, card);
            this.atEndOfPhase(ability => ({
                match: card,
                effect: ability.effects.moveToDeadPileIfStillInPlay()
            }));
        });

        var format = '';
        var index = 0;
        while(index < eligibleCharacters.length) {
            format += ' {' + (index + 2) + '}';
            index++;
        }
        this.game.addMessage('{0} removes {1} from the game to control' + format, this.controller, this, ...eligibleCharacters);
    }
}

HouseOfTheUndying.code = '04114';

module.exports = HouseOfTheUndying;
