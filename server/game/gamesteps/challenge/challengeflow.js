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
            new SimpleStep(this.game, () => this.announceDefenderStrength()),
            new ActionWindow(this.game),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.unopposedPower()),
            new SimpleStep(this.game, () => this.beforeClaim()),
            new SimpleStep(this.game, () => this.applyKeywords()),
            new SimpleStep(this.game, () => this.completeChallenge())
        ]);
    }

    resetCards() {
        this.challenge.resetCards();
    }

    announceChallenge() {
        this.game.addMessage('{0} is initiating a {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
    }

    promptForAttackers() {
        var title = 'Select challenge attackers';
        if(this.challenge.attackingPlayer.challengerLimit !== 0) {
            title += ' (limit ' + this.challenge.attackingPlayer.challengerLimit + ')';
        }

        this.game.promptForSelect(this.challenge.attackingPlayer, {
            numCards: this.challenge.attackingPlayer.challengerLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            cardCondition: card => this.allowAsAttacker(card),
            onSelect: (player, attackers) => this.chooseAttackers(player, attackers),
            onCancel: () => this.challenge.cancelChallenge()
        });
    }

    allowAsAttacker(card) {
        return this.challenge.attackingPlayer === card.controller && card.canAddAsAttacker(this.challenge.challengeType);
    }

    chooseAttackers(player, attackers) {
        this.challenge.addAttackers(attackers);

        this.game.raiseEvent('onChallenge', this.challenge, () => {
            this.challenge.initiateChallenge();
            this.game.raiseEvent('onAttackersDeclared', this.challenge);
        });

        return true;
    }

    announceAttackerStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();
        this.game.addMessage('{0} has initiated a {1} challenge with strength {2}', this.challenge.attackingPlayer, this.challenge.challengeType, this.challenge.attackerStrength);
    }

    promptForDefenders() {
        if(this.challenge.isSinglePlayer) {
            return;
        }

        var title = 'Select defenders';
        if(this.challenge.defendingPlayer.challengerLimit !== 0) {
            title += ' (limit ' + this.challenge.defendingPlayer.challengerLimit + ')';
        }

        this.game.promptForSelect(this.challenge.defendingPlayer, {
            numCards: this.challenge.defendingPlayer.challengerLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to defend',
            cardCondition: card => this.allowAsDefender(card),
            onSelect: (player, defenders) => this.chooseDefenders(defenders),
            onCancel: () => this.chooseDefenders([])
        });
    }

    allowAsDefender(card) {
        return this.challenge.defendingPlayer === card.controller && card.canAddAsDefender(this.challenge.challengeType);
    }

    chooseDefenders(defenders) {
        this.challenge.addDefenders(defenders);

        this.game.raiseEvent('onDefendersDeclared', this.challenge);

        return true;
    }

    announceDefenderStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.challenge.calculateStrength();
        if(this.challenge.defenderStrength > 0) {
            this.game.addMessage('{0} has defended with strength {1}', this.challenge.defendingPlayer, this.challenge.defenderStrength);
        } else {
            this.game.addMessage('{0} does not defend the challenge', this.challenge.defendingPlayer);
        }
    }

    determineWinner() {
        this.challenge.determineWinner();

        if(!this.challenge.winner && !this.challenge.loser) {
            if(this.challenge.attackerStrength === 0) {
                this.game.addMessage('Attacking strength is 0, there is no winner for this challenge');
            } else {
                this.game.addMessage('There is no winner or loser for this challenge');
            }
        } else {
            this.game.addMessage('{0} won a {1} challenge {2} vs {3}',
                this.challenge.winner, this.challenge.challengeType, this.challenge.winnerStrength, this.challenge.loserStrength);
        }

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

        var claim = this.challenge.getClaim();

        if(claim <= 0) {
            this.game.addMessage('The claim value for {0} is 0, no claim occurs', this.challenge.challengeType);
        } else {
            this.game.promptWithMenu(this.challenge.winner, this, {
                activePrompt: {
                    menuTitle: 'Perform before claim actions',
                    buttons: [
                        { text: 'Apply Claim', method: 'applyClaim' },
                        { text: 'Continue', method: 'cancelClaim' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to apply claim'
            });

            this.challenge.claim = claim;
        }
    }

    applyClaim(player) {
        if(player !== this.challenge.winner) {
            return false;
        }

        this.game.raiseEvent('onClaimApplied', this.challenge, () => {
            switch(this.challenge.challengeType) {
                case 'military':
                    this.game.addMessage('{0} claim is applied.  {1} must kill {2} character{3}', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                        this.challenge.claim > 1 ? 's' : '');
                    this.game.queueStep(new FulfillMilitaryClaim(this.game, this.challenge.loser, this.challenge.claim));
                    break;
                case 'intrigue':
                    this.game.addMessage('{0} claim is applied.  {1} must discard {2} card{3} at random', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                        this.challenge.claim > 1 ? 's' : '');
                    this.challenge.loser.discardAtRandom(this.challenge.claim);
                    break;
                case 'power':
                    if(this.challenge.loser.faction.power > 0) {
                        this.game.addMessage('{0} claim is applied.  {1} removes {2} power and {3} gains {2} power', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                            this.challenge.winner);
                    }
                    this.game.transferPower(this.challenge.winner, this.challenge.loser, this.challenge.claim);
                    break;
            }
        });

        return true;
    }

    cancelClaim(player) {
        this.game.addMessage('{0} continues without applying claim', player, this);

        return true;
    }

    applyKeywords() {
        var appliedIntimidate = false;
        var winnerCards = this.challenge.getWinnerCards();

        _.each(winnerCards, card => {
            if(card.hasKeyword('Insight')) {
                this.challenge.winner.drawCardsToHand(1);

                this.game.addMessage('{0} draws a card from Insight on {1}', this.challenge.winner, card);
            }

            if(card.hasKeyword('Intimidate') && !appliedIntimidate && this.challenge.isAttackerTheWinner()) {
                var strength = this.challenge.strengthDifference;
                this.game.promptForSelect(this.challenge.winner, {
                    activePromptTitle: 'Choose and kneel a character with ' + strength + ' strength or less',
                    cardCondition: card => this.canIntimidate(card, strength),
                    onSelect: (player, targetCard) => this.intimidate(card, targetCard)
                });
                appliedIntimidate = true;
            }

            if(card.hasKeyword('Pillage')) {
                var discarded = this.challenge.loser.discardFromDraw(1);

                this.game.raiseEvent('onPillage', this.challenge, card, discarded);

                this.game.addMessage('{0} discards {1} from the top of their deck due to Pillage from {2}', this.challenge.loser, discarded, card);
            }

            if(card.isRenown()) {
                card.modifyPower(1);

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
        targetCard.controller.kneelCard(targetCard);
        this.game.addMessage('{0} uses intimidate from {1} to kneel {2}', sourceCard.controller, sourceCard, targetCard);
        return true;
    }

    completeChallenge() {
        this.game.raiseEvent('onChallengeFinished', this.challenge);

        this.resetCards();

        this.challenge.finish();
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
        return this.challenge.cancelled || this.pipeline.continue();
    }
}

module.exports = ChallengeFlow;
