const OpenInformationLocations = ['play area', 'purged', 'grafted', 'discard'];

class CardVisibility {
    constructor(game) {
        this.game = game;
        this.rules = [
            (card) => this.isPublicRule(card),
            (card) => this.isEffectRule(card),
            (card, player) => this.isControllerRule(card, player),
            (card, player) => this.isSpectatorRule(card, player),
            (card) => this.isTokenCreatureRule(card)
        ];
    }

    isVisible(card, player) {
        return this.rules.some((rule) => rule(card, player));
    }

    addRule(rule) {
        this.rules.push(rule);
    }

    removeRule(rule) {
        this.rules = this.rules.filter((r) => r !== rule);
    }

    isTokenCreatureRule(card) {
        return card.type === 'token creature';
    }

    isPublicRule(card, player) {
        return (
            OpenInformationLocations.includes(card.location) &&
            !card.facedown &&
            (card.controller === player || !card.isToken())
        );
    }

    isEffectRule(card) {
        if (card.getEffects('visibleIn').some((effect) => effect === card.location)) {
            return true;
        }

        return (
            card.location === 'deck' &&
            card.controller.deck[0] === card &&
            card.controller.isTopCardOfDeckVisible()
        );
    }

    isControllerRule(card, player) {
        return card.controller === player && (card.location !== 'draw deck' || player.showDeck);
    }

    isSpectatorRule(card, player) {
        return (
            this.game.showHand &&
            player.isSpectator() &&
            ['hand', 'archives'].includes(card.location)
        );
    }
}

module.exports = CardVisibility;
