const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.deployIndex = undefined;
        this.myControl = false;
        this.ready = false;
        this.deploy = false;
        this.playedOnLeftFlank = false;
        this.playedOnRightFlank = false;
        this.promptSource = false;
        this.beingPlayed = false;
        this.controller = null;
    }

    setup() {
        this.name = 'putIntoPlay';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'put {0} into play';
    }

    canAffect(card, context) {
        if (!context || !super.canAffect(card, context)) {
            return false;
        } else if (!context.player) {
            return false;
        } else if (card.location === 'play area') {
            return false;
        }

        return true;
    }

    preEventHandler(context) {
        super.preEventHandler(context);
        let card = this.target.length > 0 ? this.target[0] : context.source;
        let player;

        if (this.deployIndex !== undefined) {
            return;
        }

        if (card.anyEffect('entersPlayUnderOpponentsControl') && card.owner.opponent) {
            if (this.myControl) {
                // If we are putting this card into play as if we
                // owned it, then our opponent gets the card, not the
                // card's owner's opponent.
                player = context.player.opponent;
            } else {
                player = card.owner.opponent;
            }
        } else if (this.controller) {
            player = this.controller;
        } else {
            player = this.myControl ? context.player : card.controller;
        }

        if (
            (this.target.length === 0 || this.target[0].type === 'creature') &&
            player.cardsInPlay.some((card) => card.type === 'creature')
        ) {
            let choices = ['Left'];

            let allowRightFlankDeploy = true;
            if (!this.beingPlayed || !player.anyEffect('cannotPlayCreaturesOnRight')) {
                choices.push('Right');
            } else {
                allowRightFlankDeploy = false;
            }

            if (
                (card.anyEffect('enterPlayAnywhere', context) ||
                    (context.ability &&
                        context.ability.isCardPlayed() &&
                        (this.deploy || card.hasKeyword('deploy')))) &&
                player.creaturesInPlay.length > 1
            ) {
                choices.push('Deploy Left');

                // Can only deploy right when prevented from playing
                // on the right flank if there is more than one
                // creature in play.
                if (
                    !this.beingPlayed ||
                    !player.anyEffect('cannotPlayCreaturesOnRight') ||
                    player.creaturesInPlay.length > 1
                ) {
                    choices.push('Deploy Right');
                }
            }

            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Which flank do you want to place this creature on?',
                context: context,
                source:
                    this.promptSource || (this.target.length > 0 ? this.target[0] : context.source),
                choices: choices,
                choiceHandler: (choice) => {
                    let deploy;
                    let flank;

                    switch (choice) {
                        case 'Left':
                            flank = 'left';
                            deploy = false;
                            this.playedOnLeftFlank = true;

                            break;
                        case 'Right':
                            flank = 'right';
                            deploy = false;
                            this.playedOnRightFlank = true;

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
                        context.game.promptForSelect(context.game.activePlayer, {
                            source: card,
                            activePromptTitle: `Select a card to deploy to the ${flank} of`,
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.controller === player &&
                                card.type === 'creature' &&
                                (flank !== 'right' ||
                                    allowRightFlankDeploy ||
                                    player.creaturesInPlay.indexOf(card) <
                                        player.creaturesInPlay.length - 1),
                            onSelect: (p, card) => {
                                this.deployIndex = card.controller.cardsInPlay.indexOf(card);
                                if (flank === 'left' && this.deployIndex >= 0) {
                                    this.deployIndex--;
                                }

                                this.left = flank === 'left';

                                let creaturesInPlay = card.controller.creaturesInPlay;

                                if (flank === 'left' && card === creaturesInPlay[0]) {
                                    this.playedOnLeftFlank = true;
                                }

                                if (
                                    flank === 'right' &&
                                    card === creaturesInPlay[creaturesInPlay.length - 1]
                                ) {
                                    this.playedOnRightFlank = true;
                                }

                                return true;
                            }
                        });
                    } else {
                        this.left = flank === 'left';
                    }
                }
            });
        } else {
            this.playedOnLeftFlank = true;
            this.playedOnRightFlank = true;
        }
    }

    getEvent(card, context) {
        return super.createEvent(
            'onCardEntersPlay',
            {
                card: card,
                context: context
            },
            (event) => {
                event.playedOnLeftFlank = this.playedOnLeftFlank;
                event.playedOnRightFlank = this.playedOnRightFlank;

                let player;
                let control;
                if (card.anyEffect('entersPlayUnderOpponentsControl') && card.owner.opponent) {
                    if (this.myControl) {
                        // If we are putting this card into play as if
                        // we owned it, then our opponent gets the
                        // card, not the card's owner's opponent.
                        player = context.player.opponent;
                    } else {
                        player = card.owner.opponent;
                    }
                    control = true;
                } else if (this.controller) {
                    player = this.controller;
                    control = player !== context.player;
                } else {
                    player = this.myControl ? context.player : card.controller;
                    control = this.myControl;
                }

                if (card.gigantic) {
                    let part =
                        card.composedPart ||
                        card.controller
                            .getSourceList(card.location)
                            .find((part) => card.compositeId === part.id);

                    if (!part && card.parent) {
                        // parts are placed togehter under another card and can be put into play together
                        part = card.parent.childCards.find((part) => card.compositeId === part.id);
                    }

                    if (part) {
                        card.controller.removeCardFromPile(part);
                        card.composedPart = part;
                    }

                    card.image = card.compositeImageId || card.id;
                }

                // If we took control, we need to update the effect
                // contexts AND update the game state to reflect the
                // new controller, since it could affect the
                // 'entersPlay' properties below.  But it must be done
                // before the location of the card is moved to 'play
                // area', since that could incorrectly affect the
                // 'entersPlay' effect.
                if (control && card.controller != player) {
                    let prevController = card.controller;
                    card.controller = player;
                    card.updateEffectContexts();
                    context.game.checkGameState(true);
                    card.controller = prevController;
                }

                for (let e of card.getEffects('entersPlayWithEffect')) {
                    context.game.actions
                        .cardLastingEffect({
                            target: card,
                            targetLocation: 'play area',
                            duration: e.duration,
                            effect: e.builder()
                        })
                        .resolve(card, context);
                }

                player.moveCard(card, 'play area', {
                    left: this.left,
                    deployIndex: this.deployIndex,
                    myControl: control
                });

                if (control) {
                    card.updateEffectContexts();
                }

                if (!this.ready && !card.checkConditions('entersPlayReady', context)) {
                    card.exhaust();
                }

                if (card.checkConditions('entersPlayStunned', context)) {
                    card.stun();
                }

                if (card.checkConditions('entersPlayEnraged', context)) {
                    card.enrage();
                }
            }
        );
    }
}

module.exports = PutIntoPlayAction;
