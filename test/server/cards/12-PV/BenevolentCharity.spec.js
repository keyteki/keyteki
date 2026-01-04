describe('Benevolent Charity', function () {
    describe("Benevolent Charity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['benevolent-charity'],
                    inPlay: ['ember-imp', 'yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });

            this.emberImp.tokens.amber = 2;
            this.yurk.tokens.amber = 1;
            this.searine.tokens.amber = 1;
        });

        it('should move all amber from friendly creatures to common supply', function () {
            this.emberImp.tokens.amber = 2;
            this.yurk.tokens.amber = 1;
            this.player1.play(this.benevolentCharity);
            expect(this.emberImp.amber).toBe(0);
            expect(this.yurk.amber).toBe(0);
            expect(this.searine.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make enemy creatures with amber capture 1 amber when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.benevolentCharity);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.emberImp.amber).toBe(3);
            expect(this.yurk.amber).toBe(2);
            expect(this.searine.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.benevolentCharity.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
