const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ChooseStealthTargets = require('./choosestealthtargets.js');

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
            // TODO: Temporarily re-enter old game flow
            new SimpleStep(this.game, () => this.game.completeAttacker(this.challenge.attackingPlayer))
            // Declare defenders
            // Action window
            // Determine winner
            // Unopposed bonus
            // Claim
            // Keywords
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
        // TODO: Temporarily re-enter old game flow.
        this.game.promptForChallenge(this.challenge.attackingPlayer);
        return true;
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
