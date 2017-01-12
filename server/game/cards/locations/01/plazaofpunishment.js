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
        this.game.addMessage('{0} uses {1} to give {2} -2 STR', player, this, card);
        player.kneelCard(this);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: [
                ability.effects.modifyStrength(-2),
                ability.effects.killByStrength
            ]
        }));

        return true;
    }
}

PlazaOfPunishment.code = '01173';

module.exports = PlazaOfPunishment;
