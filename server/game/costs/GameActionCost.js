class GameActionCost {
    constructor(name, gameAction = null) {
        this.name = name;
        this.gameAction = gameAction || name;
    }

    isEligible(card, context) {
        return card.allowGameAction(this.gameAction, context);
    }

    payEvent(cards, context) {
        return context.game.getEventsForGameAction(this.gameAction, cards, context);
    }
}

module.exports = GameActionCost;
