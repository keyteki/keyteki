describe('Calv-1N', function () {
    describe("Calv-1N's creature ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['captain-val-jericho'],
                    inPlay: ['calv-1n']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should draw one card after reap', function () {
            this.player1.reap(this.calv1n);
            expect(this.player1.hand.length).toBe(2);
        });

        it('should draw one card after figth', function () {
            this.player1.fightWith(this.calv1n, this.lamindra);
            expect(this.player1.hand.length).toBe(2);
        });
    });

    describe("Calv-1N's upgrade ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['calv-1n', 'medic-ingram'],
                    inPlay: ['captain-val-jericho']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should be able to play as upgrade', function () {
            this.player1.playUpgrade(this.calv1n, this.captainValJericho);
            expect(this.calv1n.parent).toBe(this.captainValJericho);
        });

        it('should draw one card after reap', function () {
            this.player1.playUpgrade(this.calv1n, this.captainValJericho);
            this.player1.reap(this.captainValJericho);
            expect(this.player1.hand.length).toBe(2);
        });

        it('should draw one card after figth', function () {
            this.player1.playUpgrade(this.calv1n, this.captainValJericho);
            this.player1.fightWith(this.captainValJericho, this.lamindra);
            expect(this.player1.hand.length).toBe(2);
        });
    });
});
