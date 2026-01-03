describe('Knockback', function () {
    describe("Knockback's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['knockback'],
                    inPlay: ['ember-imp', 'yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine'],
                    discard: ['stampede', 'urchin', 'draining-touch']
                }
            });
        });

        it('should put a creature on top of its owner deck', function () {
            this.player1.play(this.knockback);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.searine);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('deck');
            expect(this.player2.deck[0]).toBe(this.flaxia);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard cards until a creature is found when fate is triggered', function () {
            this.player2.moveCard(this.drainingTouch, 'deck');
            this.player2.moveCard(this.urchin, 'deck');
            this.player2.moveCard(this.stampede, 'deck');
            this.player1.activateProphecy(this.overreach, this.knockback);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.stampede.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.drainingTouch.location).toBe('deck');
            expect(this.knockback.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });

        it('should discard all cards if no creature is found', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.drainingTouch, 'deck');
            this.player2.moveCard(this.stampede, 'deck');
            this.player1.activateProphecy(this.overreach, this.knockback);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.player2.deck.length).toBe(0);
            expect(this.player2.discard.length).toBe(3);
            expect(this.knockback.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
