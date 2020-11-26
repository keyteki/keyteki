const CardGameAction = require('./CardGameAction');

class PutIntoPlayAction extends CardGameAction {
    setDefaultProperties() {
        this.left = false;
        this.deployIndex = undefined;
        this.myControl = false;
        this.ready = false;
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
            player = card.owner.opponent;
        } else {
            player = this.myControl ? context.player : card.controller;
        }

        if (card.giganticBottom && !card.composedPart) {
            let parts = card.controller
                .getSourceList(card.location)
                .filter((part) => card.compositeId === part.id);

            if (parts.length > 1) {
                // if there are two gigantic top parts, it could be relevant to choose among them
                // if they have different enhancements
                context.game.promptForSelect(context.player, {
                    source: card,
                    activePromptTitle: 'Choose a top part to play',
                    cardType: 'creature',
                    location: 'hand',
                    cardCondition: (card) => parts.includes(card),
                    onSelect: (p, part) => {
                        card.composedPart = part;
                        return true;
                    }
                });
            }
        }

        if (player.cardsInPlay.some((card) => card.type === 'creature')) {
            let choices = ['Left', 'Right'];

            if (
                context.ability &&
                context.ability.isCardPlayed() &&
                card.hasKeyword('deploy') &&
                player.creaturesInPlay.length > 1
            ) {
                choices.push('Deploy Left');
                choices.push('Deploy Right');
            }

            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Which flank do you want to place this creature on?',
                context: context,
                source: this.target.length > 0 ? this.target[0] : context.source,
                choices: choices,
                choiceHandler: (choice) => {
                    let deploy;
                    let flank;

                    switch (choice) {
                        case 'Left':
                            flank = 'left';
                            deploy = false;

                            break;
                        case 'Right':
                            flank = 'right';
                            deploy = false;

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
                        context.game.promptForSelect(player, {
                            source: card,
                            activePromptTitle: `Select a card to deploy to the ${flank} of`,
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.controller === player &&
                                card.type === 'creature',
                            onSelect: (p, card) => {
                                this.deployIndex = card.controller.cardsInPlay.indexOf(card);
                                if (flank === 'left' && this.deployIndex >= 0) {
                                    this.deployIndex--;
                                }

                                this.left = flank === 'left';

                                return true;
                            }
                        });
                    } else {
                        this.left = flank === 'left';
                    }
                }
            });
        }
    }

    getEvent(card, context) {
        return super.createEvent('onCardEntersPlay', { card: card, context: context }, () => {
            let player;
            let control;
            if (card.anyEffect('entersPlayUnderOpponentsControl') && card.owner.opponent) {
                player = card.owner.opponent;
                control = true;
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

            player.moveCard(card, 'play area', {
                left: this.left,
                deployIndex: this.deployIndex,
                myControl: control
            });

            if (this.myControl) {
                card.updateEffectContexts();
            }

            if (!this.ready && !card.anyEffect('entersPlayReady')) {
                card.exhaust();
            }

            if (card.anyEffect('entersPlayStunned')) {
                card.stun();
            }

            if (card.anyEffect('entersPlayEnraged')) {
                card.enrage();
            }
        });
    }
}

module.exports = PutIntoPlayAction;
