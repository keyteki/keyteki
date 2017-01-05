const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class PlazaOfPunishment extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || challenge.challengeType !== 'power' || this.kneeled || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'chooseCharacter' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });    
    }

    chooseCharacter(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.attachments.size() === 0,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        card.strengthModifier -= 2;

        player.kneelCard(this);

        this.game.addMessage('{0} uses {1} to give {2} -2 STR', player, this, card);

        if(card.getStrength() <= 0) {
            card.controller.killCharacter(card, false);

            this.game.addMessage('{0} is killed as its STR is 0', card);
        } else {
            this.cardSelected = card;

            this.game.once('onPhaseEnded', () => {
                this.onPhaseEnded();
            });
        }

        return true;
    }

    onPhaseEnded() {
        if(this.cardSelected) {
            this.cardSelected.strengthModifier += 2;

            this.cardSelected = undefined;
        }
    }
}

PlazaOfPunishment.code = '01173';

module.exports = PlazaOfPunishment;
