const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseStealthTargets = require('./choosestealthtargets.js');
const FulfillMilitaryClaim = require('./fulfillmilitaryclaim.js');

class ChallengeFlow extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.announceChallenge()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            () => new ChooseStealthTargets(this.game, this.challenge, this.stealthAttackers),
            // TODO: Action window
            new SimpleStep(this.game, () => this.announceAttackerStrength()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            // TODO: Action window
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.unopposedPower()),
            new SimpleStep(this.game, () => this.applyClaim()),
            new SimpleStep(this.game, () => this.applyKeywords()),
        ]);
    }

    announceChallenge() {
        this.game.addMessage('{0} is initiating a {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
        this.challenge.attackingPlayer.startChallenge(this.challenge.challengeType);
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
        return this.challenge.attackingPlayer.canAddToChallenge(card.uuid);
    }

    chooseAttackers(player, attackers) {
        player.cardsInChallenge = _(attackers);
        this.stealthAttackers = this.challenge.attackingPlayer.cardsInChallenge.filter(card => card.needsStealthTarget());

        this.game.raiseEvent('onChallenge', this.challenge.attackingPlayer, this.challenge.challengeType);

        this.challenge.attackingPlayer.doneChallenge(true);

        this.game.raiseEvent('onAttackersDeclared', this.challenge.attackingPlayer, this.challenge.challengeType);

        if(this.challenge.defendingPlayer) {
            this.challenge.defendingPlayer.currentChallenge = this.challenge.challengeType;
        }

        return true;
    }

    cancelChallenge() {
        this.game.addMessage('{0} cancels their {1} challenge', this.challenge.attackingPlayer, this.challenge.challengeType);
        this.cancelled = true;
        return true;
    }

    announceAttackerStrength() {
        this.game.addMessage('{0} has initiated a {1} challenge with strength {2}', this.challenge.attackingPlayer, this.challenge.challengeType, this.challenge.attackingPlayer.challengeStrength);
    }

    promptForDefenders() {
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
        return this.challenge.defendingPlayer.canAddToChallenge(card.uuid);
    }

    chooseDefenders(defenders) {
        this.challenge.defendingPlayer.cardsInChallenge = _(defenders);
        this.challenge.defendingPlayer.doneChallenge(false);

        if(this.challenge.defendingPlayer.challengeStrength > 0) {
            this.game.addMessage('{0} has defended with strength {1}', this.challenge.defendingPlayer, this.challenge.defendingPlayer.challengeStrength);
        }

        return true;
    }

    determineWinner() {
        if(this.challenge.attackingPlayer.challengeStrength >= this.challenge.defendingPlayer.challengeStrength) {
            this.loser = this.challenge.defendingPlayer;
            this.winner = this.challenge.attackingPlayer;
        } else {
            this.loser = this.challenge.attackingPlayer;
            this.winner = this.challenge.defendingPlayer;
        }

        this.winner.challenges[this.winner.currentChallenge].won++;

        this.game.addMessage('{0} won a {1} challenge {2} vs {3}',
            this.winner, this.challenge.challengeType, this.winner.challengeStrength, this.loser.challengeStrength);

        this.game.raiseEvent('afterChallenge', this.challenge.challengeType, this.winner, this.loser, this.challenge.attackingPlayer);
    }

    unopposedPower() {
        if(this.loser.challengeStrength === 0) {
            this.game.addMessage('{0} has gained 1 power from an unopposed challenge', this.winner);
            this.game.addPower(this.winner, 1);

            this.game.raiseEvent('onUnopposedWin', this.winner);
        }
    }

    applyClaim() {
        if(this.winner !== this.challenge.attackingPlayer) {
            return;
        }

        this.game.raiseEvent('beforeClaim', this.game, this.challenge.challengeType, this.winner, this.loser);
        var claim = this.winner.activePlot.getClaim();
        claim = this.winner.modifyClaim(this.winner, this.challenge.challengeType, claim);

        if(this.loser) {
            claim = this.loser.modifyClaim(this.winner, this.challenge.challengeType, claim);
        }

        if(claim <= 0) {
            this.game.addMessage('The claim value for {0} is 0, no claim occurs', this.challenge.challengeType);
        } else {
            if(this.challenge.challengeType === 'military') {
                this.game.queueStep(new FulfillMilitaryClaim(this.game, this.loser, claim));
                return;
            } else if(this.challenge.challengeType === 'intrigue') {
                this.loser.discardAtRandom(claim);
            } else if(this.challenge.challengeType === 'power') {
                this.game.transferPower(this.winner, this.loser, claim);
            }
        }

        this.game.raiseEvent('afterClaim', this.game, this.challenge.challengeType, this.winner, this.loser);
    }

    applyKeywords() {
        this.winner.cardsInChallenge.each(card => {
            if(card.hasKeyword('Insight')) {
                this.winner.drawCardsToHand(1);

                this.game.addMessage('{0} draws a card from Insight on {1}', this.winner, card);
            }

            if(card.hasKeyword('Intimidate')) {
                // something
            }

            if(card.hasKeyword('Pillage')) {
                this.loser.discardFromDraw(1);

                this.game.addMessage('{0} discards a card from the top of their deck from Pillage on {1}', this.loser, card);
            }

            if(card.isRenown()) {
                card.power++;

                this.game.addMessage('{0} gains 1 power on {1} from Renown', this.winner, card);
            }

            this.game.checkWinCondition(this.winner);
        });
    }

    completeChallenge() {
        this.game.raiseEvent('onChallengeFinished', this.challenge.challengeType, this.winner, this.loser, this.challenge.attackingPlayer);
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
