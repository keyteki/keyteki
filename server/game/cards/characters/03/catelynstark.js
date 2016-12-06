const DrawCard = require('../../../drawcard.js');
 
class CatelynStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.power = 0;
        this.lastPower = 0;
        
        this.registerEvents(['onCardSacrificed', 'onCharacterKilled', 'onBeginRound']);
    }

    updateStrength() {
        if(!this.inPlay || this.isBlank()) {
            return;
        }
        
        this.strengthModifier -= this.lastPower;
        this.strengthModifier += this.power;

        this.lastPower = this.owner.power;
    }

    onBeginRound() {
        this.abilityUsed = 0;
    }

    onCardSacrificed(event, player, card) {
        if(!this.inPlay || this.isBlank() || this.owner !== player || this.abilityUsed >= 2) {
            return;
        }

        if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
            this.game.promptWithMenu(player, this, {
                activePrompt: {
                    menuTitle: 'Gain 1 power on ' + this.name + '?',
                    buttons: [
                        { text: 'Yes', command: 'menuButton', method: 'gainPower' },
                        { text: 'No', command: 'menuButton', method: 'cancel' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name
            });
        }
    }

    onCharacterKilled(event, player, card) {
        this.onCardSacrificed(event, player, card);
    }

    gainPower(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} gains 1 power on {1} in reaction to a {2} character being sacrificed or killed', player, this, this.getFaction());
        this.power++;
        this.updateStrength();

        this.abilityUsed++;

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }
}

CatelynStark.code = '03002';

module.exports = CatelynStark;
