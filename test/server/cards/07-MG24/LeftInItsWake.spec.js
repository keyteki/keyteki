describe('Left in Its Wake', function () {
    describe("Left in Its Wake's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['left-in-its-wake'],
                    inPlay: ['krump', 'batdrone']
                },
                player2: {
                    inPlay: ['troll', 'headhunter', 'lamindra']
                }
            });
        });

        it('exhausts all creatures of chosen house', function () {
            this.player1.play(this.leftInItsWake);
            expect(this.player1).toHavePrompt('Left in Its Wake');
            this.player1.clickPrompt('brobnar');
            expect(this.krump.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
            expect(this.headhunter.exhausted).toBe(true);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can choose house that is not in play', function () {
            this.player1.play(this.leftInItsWake);
            expect(this.player1).toHavePrompt('Left in Its Wake');
            this.player1.clickPrompt('skyborn');
            expect(this.krump.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(false);
            expect(this.headhunter.exhausted).toBe(false);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
