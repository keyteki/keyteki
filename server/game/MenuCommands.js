const ActivateProphecyAction = require('./GameActions/ActivateProphecyAction');
const DeactivateProphecyAction = require('./GameActions/DeactivateProphecyAction');
const FulfillProphecyAction = require('./GameActions/FulfillProphecyAction');

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
                if (!card.tokens.enrage) {
                    game.addAlert('danger', '{0} adds an enrage to {1}', player, card);
                    card.addToken('enrage', 1);
                } else {
                    game.addAlert('danger', '{0} removes an enrage from {1}', player, card);
                    card.removeToken('enrage', 1);
                }
                break;
            case 'ward':
                if (!card.tokens.ward) {
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
        }
    }
}

module.exports = MenuCommands;
