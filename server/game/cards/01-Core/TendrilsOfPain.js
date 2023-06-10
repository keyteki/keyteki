const Card = require('../../Card.js');

class TendrilsOfPain extends Card {
    // Play: Deal 1<D> to each creature. Deal an additional 3<D> to each creature if your opponent forged a key on their previous turn.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal {1} damage to all creatures',
            effectArgs: (context) =>
                context.player.opponent && context.player.opponent.keysForgedThisRound
                    ? context.player.opponent.keysForgedThisRound.length > 0
                        ? 4
                        : 1
                    : 1,
            gameAction: ability.actions.dealDamage((context) => ({
                amount:
                    context.player.opponent &&
                    context.player.opponent.keysForgedThisRound.length > 0
                        ? 4
                        : 1,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

TendrilsOfPain.id = 'tendrils-of-pain';

module.exports = TendrilsOfPain;
