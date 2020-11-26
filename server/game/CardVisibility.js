const OpenInformationLocations = ['play area', 'purged', 'discard'];

class CardVisibility {
    constructor(game) {
        this.game = game;
        this.rules = [
            (card) => this.isPublicRule(card),
            (card) => this.isEffectRule(card),
            (card, player) => this.isControllerRule(card, player),
            (card, player) => this.isSpectatorRule(card, player)
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

    isPublicRule(card) {
        return OpenInformationLocations.includes(card.location) && !card.facedown;
    }

    isEffectRule(card) {
        return card.getEffects('visbileIn').some((effect) => effect === card.location);
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
