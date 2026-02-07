const BasePlayAction = require('./BasePlayAction');

/**
 * Action for playing a creature card from hand.
 *
 * When playing from hand, this class handles flank selection BEFORE opening the event window.
 * This allows the player to cancel (via Back button) without triggering any events or bonus icons.
 * The selected flank is passed to PutIntoPlayAction via the flankPreselected flag.
 *
 * For creatures put into play by other effects (not from hand), PutIntoPlayAction handles
 * the flank selection directly (without a Back button).
 */
class PlayCreatureAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this creature';
        this.deploy = false;
        this.flankSelection = null;
    }

    displayMessage() {
        // Suppress the default play message - PutIntoPlayAction will show the appropriate message
        // based on whether the creature enters play or gets returned
    }

    addSubEvent(event, context) {
        const playedFromHand = context.source.location === 'hand';

        let action = context.game.actions.putIntoPlay({
            myControl: true,
            deploy: this.deploy,
            beingPlayed: playedFromHand,
            flankPreselected: this.flankSelection !== null,
            left: this.flankSelection?.left ?? false,
            deployIndex: this.flankSelection?.deployIndex,
            playedOnLeftFlank: this.flankSelection?.playedOnLeftFlank ?? false,
            playedOnRightFlank: this.flankSelection?.playedOnRightFlank ?? false
        });

        super.addSubEvent(event, context);

        action.preEventHandler(context);
        event.putIntoPlayEvent = action.getEvent(context.source, context);
        event.putIntoPlayAction = action;
        event.addChildEvent(event.putIntoPlayEvent);
    }

    needsFlankSelection(context) {
        const card = context.source;
        const player = context.player;

        // Only need early flank selection (with Back button) when:
        // 1. Playing from hand
        // 2. It's a creature
        // 3. The player owns the card (not playing from opponent's hand via Talent Scout, etc.)
        // 4. Not being played via a card effect (mustPlay is set by PlayCardAction for effect-triggered plays)
        if (
            card.location !== 'hand' ||
            card.type !== 'creature' ||
            card.owner !== player ||
            context.mustPlay
        ) {
            return false;
        }

        // Check if creature goes to a different location
        const redirectLocation = card.mostRecentEffect('cardLocationAfterPlay');
        if (redirectLocation && redirectLocation !== 'play area') {
            return false;
        }

        return player.creaturesInPlay.length > 0;
    }

    promptForFlankSelection(context, callback) {
        const card = context.source;
        const player = context.player;
        const game = context.game;

        let choices = ['Left'];

        let allowRightFlankDeploy = true;
        if (!player.anyEffect('cannotPlayCreaturesOnRight')) {
            choices.push('Right');
        } else {
            allowRightFlankDeploy = false;
        }

        if (
            (card.anyEffect('enterPlayAnywhere', context) ||
                this.deploy ||
                card.hasKeyword('deploy')) &&
            player.creaturesInPlay.length > 1
        ) {
            choices.push('Deploy Left');

            if (
                !player.anyEffect('cannotPlayCreaturesOnRight') ||
                player.creaturesInPlay.length > 1
            ) {
                choices.push('Deploy Right');
            }
        }

        choices.push('Back');

        game.promptWithHandlerMenu(player, {
            activePromptTitle: 'Which flank do you want to place this creature on?',
            context: context,
            source: card,
            choices: choices,
            choiceHandler: (choice) => {
                if (choice === 'Back') {
                    // Don't proceed with the play
                    return;
                }

                let flank;
                let deploy = false;
                let playedOnLeftFlank = false;
                let playedOnRightFlank = false;

                switch (choice) {
                    case 'Left':
                        flank = 'left';
                        playedOnLeftFlank = true;
                        break;
                    case 'Right':
                        flank = 'right';
                        playedOnRightFlank = true;
                        break;
                    case 'Deploy Left':
                        flank = 'left';
                        deploy = true;
                        break;
                    case 'Deploy Right':
                        flank = 'right';
                        deploy = true;
                        break;
                }

                if (deploy) {
                    game.promptForSelect(game.activePlayer, {
                        source: card,
                        activePromptTitle: `Select a card to deploy to the ${flank} of`,
                        cardCondition: (c) =>
                            c.location === 'play area' &&
                            c.controller === player &&
                            c.type === 'creature' &&
                            (flank !== 'right' ||
                                allowRightFlankDeploy ||
                                player.creaturesInPlay.indexOf(c) <
                                    player.creaturesInPlay.length - 1),
                        onSelect: (p, selectedCard) => {
                            let deployIndex =
                                selectedCard.controller.cardsInPlay.indexOf(selectedCard);
                            if (flank === 'left' && deployIndex >= 0) {
                                deployIndex--;
                            }

                            const creaturesInPlay = selectedCard.controller.creaturesInPlay;
                            if (flank === 'left' && selectedCard === creaturesInPlay[0]) {
                                playedOnLeftFlank = true;
                            }
                            if (
                                flank === 'right' &&
                                selectedCard === creaturesInPlay[creaturesInPlay.length - 1]
                            ) {
                                playedOnRightFlank = true;
                            }

                            this.flankSelection = {
                                left: flank === 'left',
                                deployIndex: deployIndex,
                                playedOnLeftFlank: playedOnLeftFlank,
                                playedOnRightFlank: playedOnRightFlank
                            };
                            callback();
                            return true;
                        }
                    });
                } else {
                    this.flankSelection = {
                        left: flank === 'left',
                        deployIndex: undefined,
                        playedOnLeftFlank: playedOnLeftFlank,
                        playedOnRightFlank: playedOnRightFlank
                    };
                    callback();
                }
            }
        });
    }

    proceedWithPlay(context) {
        if (context.source.giganticBottom && !context.source.composedPart) {
            let parts = context.source.controller
                .getSourceList(context.source.location)
                .filter((part) => context.source.compositeId === part.id);

            if (parts.length > 1) {
                context.game.promptForSelect(context.game.activePlayer, {
                    source: context.source,
                    activePromptTitle: 'Choose a top part to play',
                    cardType: 'creature',
                    location: 'hand',
                    cardCondition: (card) => parts.includes(card),
                    onSelect: (p, part) => {
                        context.source.composedPart = part;
                        super.executeHandler(context);
                        return true;
                    }
                });
            } else {
                super.executeHandler(context);
            }
        } else {
            super.executeHandler(context);
        }
    }

    executeHandler(context) {
        if (this.needsFlankSelection(context)) {
            this.promptForFlankSelection(context, () => {
                this.proceedWithPlay(context);
            });
        } else {
            this.proceedWithPlay(context);
        }
    }
}

module.exports = PlayCreatureAction;
