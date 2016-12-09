const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseStealthTargets = require('./choosestealthtargets.js');
const FulfillMilitaryClaim = require('./fulfillmilitaryclaim.js');
const ActionWindow = require('../actionwindow.js');

class ChallengeFlow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.announceChallenge()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            () => new ChooseStealthTargets(this.game, this.challenge, this.challenge.getStealthAttackers()),
            new SimpleStep(this.game, () => this.announceAttackerStrength()),
            new ActionWindow(this.game),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new ActionWindow(this.game),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.unopposedPower()),
            new SimpleStep(this.game, () => this.beforeClaim()),
            new SimpleStep(this.game, () => this.applyKeywords())
        ]);
    }

    resetCards() {
        this.challenge.resetCards();
    }

    announceChallenge() {
        this.game.addMessage('{0} is initiating a {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
    }

    promptForAttackers() {
        this.game.promptForSelect(this.challenge.attackingPlayer, {
            numCards: this.challenge.attackingPlayer.challengerLimit,
            activePromptTitle: 'Select challenge attackers',
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            cardCondition: card => this.allowAsAttacker(card),
            onSelect: (player, attackers) => this.chooseAttackers(player, attackers),
            onCancel: () => this.cancelChallenge()
        });
    }

    allowAsAttacker(card) {
        var event = this.game.raiseEvent('onAttackerSelected', this.challenge, card);

        if(event.cancel) {
            return false;
        }

        return this.challenge.attackingPlayer.canAddToChallenge(card, this.challenge.challengeType);
    }

    chooseAttackers(player, attackers) {
        this.challenge.addAttackers(attackers);

        this.game.raiseEvent('onChallenge', this.challenge);
        this.challenge.initiateChallenge();
        this.challenge.calculateStrength();
        this.game.raiseEvent('onAttackersDeclared', this.challenge);

        return true;
    }

    cancelChallenge() {
        this.game.addMessage('{0} cancels their {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
        this.cancelled = true;
        return true;
    }

    announceAttackerStrength() {
        this.game.addMessage('{0} has initiated a {1} challenge with strength {2}', this.challenge.attackingPlayer, this.challenge.challengeType, this.challenge.attackerStrength);
    }

    promptForDefenders() {
        if(this.challenge.isSinglePlayer) {
            return;
        }

        this.game.promptForSelect(this.challenge.defendingPlayer, {
            numCards: this.challenge.defendingPlayer.challengerLimit,
            activePromptTitle: 'Select defenders',
            waitingPromptTitle: 'Waiting for opponent to defend',
            cardCondition: card => this.allowAsDefender(card),
            onSelect: (player, defenders) => this.chooseDefenders(defenders),
            onCancel: () => this.chooseDefenders([])
        });
    }

    allowAsDefender(card) {
        return this.challenge.defendingPlayer.canAddToChallenge(card, this.challenge.challengeType);
    }

    chooseDefenders(defenders) {
        this.challenge.addDefenders(defenders);
        this.challenge.calculateStrength();

        if(!this.challenge.isUnopposed()) {
            this.game.addMessage('{0} has defended with strength {1}', this.challenge.defendingPlayer, this.challenge.defenderStrength);
        }

        return true;
    }

    determineWinner() {
        this.challenge.determineWinner();

        this.game.addMessage('{0} won a {1} challenge {2} vs {3}',
            this.challenge.winner, this.challenge.challengeType, this.challenge.winner.challengeStrength, this.challenge.loser.challengeStrength);

        this.game.raiseEvent('afterChallenge', this.challenge);
    }

    unopposedPower() {
        if(this.challenge.isUnopposed() && this.challenge.isAttackerTheWinner()) {
            this.game.addMessage('{0} has gained 1 power from an unopposed challenge', this.challenge.winner);
            this.game.addPower(this.challenge.winner, 1);

            this.game.raiseEvent('onUnopposedWin', this.challenge);
        }
    }

    beforeClaim() {
        if(!this.challenge.isAttackerTheWinner()) {
            return;
        }

        if(this.challenge.isSinglePlayer) {
            return;
        }

        this.game.raiseEvent('beforeClaim', this.challenge);
        var claim = this.challenge.getClaim();

        if(claim <= 0) {
            this.game.addMessage('The claim value for {0} is 0, no claim occurs', this.challenge.challengeType);
        } else {
            this.game.promptWithMenu(this.challenge.winner, this, {
                activePrompt: {
                    menuTitle: 'Perform before claim actions',
                    buttons: [
                        { text: 'Apply Claim', command: 'menuButton', method: 'applyClaim' },
                        { text: 'Continue', command: 'menuButton', method: 'cancelClaim' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to apply claim'
            });

            this.challenge.claim = claim;
        }

        this.game.raiseEvent('afterClaim', this.challenge);
    }

    applyClaim(player) {
        if(player !== this.challenge.winner) {
            return false;
        }
        
        switch(this.challenge.challengeType) {
            case 'military':
                this.game.queueStep(new FulfillMilitaryClaim(this.game, this.challenge.loser, this.challenge.claim));
                break;
            case 'intrigue':
                this.challenge.loser.discardAtRandom(this.challenge.claim);
                break;
            case 'power':
                this.game.transferPower(this.challenge.winner, this.challenge.loser, this.challenge.claim);
                break;
        }

        return true;
    }

    cancelClaim(player) {
        this.game.addMessage('{0} continues without applying claim', player, this);

        return true;
    }

    applyKeywords() {
        var appliedIntimidate = false;

        this.challenge.winner.cardsInChallenge.each(card => {
            if(card.hasKeyword('Insight')) {
                this.challenge.winner.drawCardsToHand(1);

                this.game.addMessage('{0} draws a card from Insight on {1}', this.challenge.winner, card);
            }

            if(card.hasKeyword('Intimidate') && !appliedIntimidate) {
                var strength = this.challenge.strengthDifference;
                this.game.promptForSelect(this.challenge.winner, {
                    activePromptTitle: 'Choose and kneel a character with ' + strength + ' strength or less',
                    cardCondition: card => this.canIntimidate(card, strength),
                    onSelect: (player, targetCard) => this.intimidate(card, targetCard)
                });
                appliedIntimidate = true;
            }

            if(card.hasKeyword('Pillage')) {
                this.challenge.loser.discardFromDraw(1);

                this.game.raiseEvent('onPillage', this.challenge, card);

                this.game.addMessage('{0} discards a card from the top of their deck from Pillage on {1}', this.challenge.loser, card);
            }

            if(card.isRenown()) {
                card.power++;

                this.game.raiseEvent('onRenown', this.challenge, card);

                this.game.addMessage('{0} gains 1 power on {1} from Renown', this.challenge.winner, card);
            }

            this.game.checkWinCondition(this.challenge.winner);
        });
    }

    canIntimidate(card, strength) {
        return !card.kneeled && card.controller === this.challenge.loser && card.getStrength() <= strength;
    }

    intimidate(sourceCard, targetCard) {
        targetCard.kneeled = true;
        this.game.addMessage('{0} uses intimidate from {1} to kneel {2}', sourceCard.controller, sourceCard, targetCard);
        return true;
    }

    completeChallenge() {
        this.game.raiseEvent('onChallengeFinished', this.challenge);
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    continue() {
        return this.cancelled || this.pipeline.continue();
    }
}

module.exports = ChallengeFlow;
