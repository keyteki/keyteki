class MarshalLocation {
    constructor(player, location) {
        this.player = player;
        this.location = location;
    }

    contains(card) {
        var pile = this.player.getSourceList(this.location);
        return pile.contains(card);
    }
}

module.exports = MarshalLocation;
