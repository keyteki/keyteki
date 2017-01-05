const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Doreah extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge', 'onChallengeFinished']);
    }

    afterChallenge(challenge) {
        var ourCards = challenge.attackingPlayer === this.controller ? challenge.attackers : challenge.defenders;

        if(!_.any(ourCards, card => {
            return card.hasTrait('Lord') || card.hasTrait('Lady');
        })) {
            return;
        }

        this.addKeyword('Insight');
        this.keywordAdded = true;
    }

    onChallengeFinished() {
        if(this.keywordAdded) {
            this.removeKeyword('Insight');
            this.keywordAdded = false;
        }
    }
}

Doreah.code = '04033';

module.exports = Doreah;
