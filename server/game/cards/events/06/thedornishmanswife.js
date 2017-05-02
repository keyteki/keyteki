const DrawCard = require('../../../drawcard.js');

class TheDornishmansWife extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain gold/power/card',
            condition: () => this.opponentHasMorePower() || this.opponentHasMoreCardsInHand() || this.opponentControlsMoreCharacters(),
            handler: () => {
                let bonusMessage = '';

                if(this.opponentHasMorePower()) {
                    this.game.addGold(this.controller, 2);
                    bonusMessage += ' gain 2 gold,';
                }

                if(this.opponentHasMoreCardsInHand()) {
                    this.game.addPower(this.controller, 1);
                    bonusMessage += ' gain 1 power for their faction,';
                }

                if(this.opponentControlsMoreCharacters()) {
                    this.controller.drawCardsToHand(1);
                    bonusMessage += ' draw 1 card';
                }

                this.game.addMessage('{0} uses {1} to{2}',
                                    this.controller, this, bonusMessage);
            }
        });
    }

    opponentHasMorePower() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent || opponent.getTotalPower() <= this.controller.getTotalPower()) {
            return false;
        }

        return true;
    }

    opponentHasMoreCardsInHand() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent || opponent.hand.size() <= this.controller.hand.size()) {
            return false;
        }

        return true;
    }

    opponentControlsMoreCharacters() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        let ownChars = this.controller.filterCardsInPlay(card => {
            return card.getType() === 'character';
        });

        let oppChars = opponent.filterCardsInPlay(card => {
            return card.getType() === 'character';
        });

        if(oppChars.length <= ownChars.length) {
            return false;
        }

        return true;
    }
}

TheDornishmansWife.code = '06039';

module.exports = TheDornishmansWife;
