const ActivateProphecyAction = require('./GameActions/ActivateProphecyAction');
const DeactivateProphecyAction = require('./GameActions/DeactivateProphecyAction');
const FulfillProphecyAction = require('./GameActions/FulfillProphecyAction');
const PlaceUnderAction = require('./GameActions/PlaceUnderAction');

class MenuCommands {
    static cardMenuClick(menuItem, game, player, card) {
        switch (menuItem.command) {
            case 'activateProphecy':
                if (game.manualMode && card.isProphecy()) {
                    let activateProphecyAction = new ActivateProphecyAction({
                        prophecyCard: card
                    });
                    let context = game.getFrameworkContext(player);
                    context.source = card;
                    if (activateProphecyAction.canAffect(player, context)) {
                        activateProphecyAction.resolve(player, context);
                    }
                }
                break;
            case 'deactivateProphecy':
                if (game.manualMode && card.isProphecy()) {
                    let deactivateProphecyAction = new DeactivateProphecyAction({
                        prophecyCard: card
                    });
                    let context = game.getFrameworkContext(player);
                    context.source = card;
                    if (deactivateProphecyAction.canAffect(player, context)) {
                        deactivateProphecyAction.resolve(player, context);
                    }
                }
                break;
            case 'fulfillProphecy':
                if (game.manualMode && card.isProphecy()) {
                    let fulfillProphecyAction = new FulfillProphecyAction({ card: card });
                    let context = game.getFrameworkContext(player);
                    context.source = card;
                    // The fulfill prophecy action targets the active player (opponent)
                    if (fulfillProphecyAction.canAffect(game.activePlayer, context)) {
                        fulfillProphecyAction.resolve(game.activePlayer, context);
                    }
                }
                break;
            case 'exhaust':
                if (card.exhausted) {
                    game.addAlert('danger', '{0} readies {1}', player, card);
                    card.ready();
                } else {
                    game.addAlert('danger', '{0} exhausts {1}', player, card);
                    card.exhaust();
                }

                break;
            case 'addDamage':
                game.addAlert('danger', '{0} adds a damage to {1}', player, card);
                card.addToken('damage', 1);
                break;
            case 'remDamage':
                game.addAlert('danger', '{0} removes a damage from {1}', player, card);
                card.removeToken('damage', 1);
                break;
            case 'remPower':
                game.addAlert('danger', '{0} removes a power token from {1}', player, card);
                card.removeToken('power', 1);
                break;
            case 'addPower':
                game.addAlert('danger', '{0} adds an power token to {1}', player, card);
                card.addToken('power', 1);
                break;
            case 'addAmber':
                game.addAlert('danger', '{0} adds an amber to {1}', player, card);
                card.addToken('amber', 1);
                break;
            case 'remAmber':
                game.addAlert('danger', '{0} removes an amber from {1}', player, card);
                card.removeToken('amber', 1);
                break;
            case 'stun':
                if (card.stunned) {
                    game.addAlert('danger', '{0} removes the stun from {1}', player, card);
                    card.unstun();
                } else {
                    game.addAlert('danger', '{0} stuns {1}', player, card);
                    card.stun();
                }
                break;
            case 'enrage':
                if (!card.enraged) {
                    game.addAlert('danger', '{0} adds an enrage to {1}', player, card);
                    card.addToken('enrage', 1);
                } else {
                    game.addAlert('danger', '{0} removes an enrage from {1}', player, card);
                    card.removeToken('enrage', 1);
                }
                break;
            case 'ward':
                if (!card.warded) {
                    game.addAlert('danger', '{0} adds a ward to {1}', player, card);
                    card.addToken('ward', 1);
                } else {
                    game.addAlert('danger', '{0} removes a ward from {1}', player, card);
                    card.removeToken('ward', 1);
                }
                break;
            case 'control':
                if (player.opponent) {
                    game.addAlert(
                        'danger',
                        '{0} gives {1} control of {2}',
                        player,
                        player.opponent,
                        card
                    );
                    // sets only the default controller, the engine will auto-adjust the controller
                    card.defaultController = player.opponent;
                }

                break;
            case 'placeFaceup':
            case 'placeFacedown': {
                if (!game.manualMode || card.location !== 'play area') {
                    break;
                }
                const facedown = menuItem.command === 'placeFacedown';
                game.promptForSelect(player, {
                    activePromptTitle:
                        'Select a card from your hand to place ' +
                        (facedown ? 'facedown ' : 'faceup ') +
                        'under ' +
                        card.name,
                    location: 'hand',
                    controller: 'self',
                    cardCondition: (selected) => selected !== card && selected.parent !== card,
                    source: card,
                    onSelect: (p, selectedCard) => {
                        const placeUnderAction = new PlaceUnderAction({
                            parent: card,
                            facedown
                        });
                        const context = game.getFrameworkContext(p);
                        context.source = card;
                        if (placeUnderAction.canAffect(selectedCard, context)) {
                            game.addAlert(
                                'danger',
                                '{0} manually places {1} ' +
                                    (facedown ? 'facedown ' : 'faceup ') +
                                    'under {2}',
                                p,
                                facedown ? 'a card' : selectedCard,
                                card
                            );
                            placeUnderAction.resolve(selectedCard, context);
                        }
                        return true;
                    }
                });
                break;
            }
            case 'takeChild': {
                if (!game.manualMode || card.location !== 'play area') {
                    break;
                }
                // Only the controller of the parent card may pull cards
                // out from under it. The menu also hides this option
                // for opponents; this is the server-side backstop.
                if (card.controller !== player) {
                    break;
                }
                const child = card.childCards.find((c) => c.uuid === menuItem.arg);
                if (!child) {
                    break;
                }
                game.addAlert(
                    'danger',
                    '{0} manually takes {1} from under {2} into their hand',
                    player,
                    child.facedown ? 'a facedown card' : child,
                    card
                );
                // moveCard delegates through removeCardFromPile, which
                // already detaches `parent.childCards` and clears
                // `card.parent`. Send to the owner's hand so opponent
                // cards return correctly.
                child.owner.moveCard(child, 'hand');
                break;
            }
            case 'returnToHand': {
                if (!game.manualMode || card.location !== 'play area' || !card.parent) {
                    break;
                }
                game.addAlert('danger', '{0} manually returns {1} to their hand', player, card);
                card.owner.moveCard(card, 'hand');
                break;
            }
        }
    }
}

module.exports = MenuCommands;
