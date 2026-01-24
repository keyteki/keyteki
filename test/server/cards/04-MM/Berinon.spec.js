describe('Berinon', function () {
    describe("Berinon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['berinon'],
                    hand: ['bull-wark', 'bulwark']
                },
                player2: {
                    amber: 4,
                    hand: ['munchling', 'dextre']
                }
            });
        });

        it('should capture two ambers after reaping', function () {
            this.player1.reap(this.berinon);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.berinon.amber).toBe(2);
        });

        it('should be enraged after playing a mutant creature', function () {
            this.player1.play(this.bullWark);
            expect(this.berinon.enraged).toBe(true);
            expect(this.bullWark.enraged).toBe(false);
        });

        it('should not be enraged after playing a non-mutant creature', function () {
            this.player1.play(this.bulwark);
            expect(this.berinon.enraged).toBe(false);
            expect(this.bulwark.enraged).toBe(false);
        });

        describe("during opponent's turn", function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
            });

            it('should be enraged after opponent plays a mutant creature', function () {
                this.player2.play(this.munchling);
                expect(this.berinon.enraged).toBe(true);
                expect(this.munchling.enraged).toBe(false);
            });

            it('should not be enraged after opponent plays a non-mutant creature', function () {
                this.player2.play(this.dextre);
                expect(this.berinon.enraged).toBe(false);
                expect(this.dextre.enraged).toBe(false);
            });
        });
    });
});
