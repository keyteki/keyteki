describe('Martian Hounds', function () {
    describe("Martian Hounds' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['martian-hounds'],
                    inPlay: ['zorg', 'tunk']
                },
                player2: {
                    inPlay: ['lamindra', 'batdrone']
                }
            });
        });

        it('should add no counters when no creatures are damaged', function () {
            this.player1.play(this.martianHounds);
            expect(this.zorg.hasToken('power')).toBe(false);
            expect(this.tunk.hasToken('power')).toBe(false);
            expect(this.lamindra.hasToken('power')).toBe(false);
            expect(this.batdrone.hasToken('power')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should add two +1 power counters based on count of damaged creatures', function () {
            this.zorg.tokens.damage = 2;
            this.batdrone.tokens.damage = 1;
            this.player1.play(this.martianHounds);
            expect(this.player1).toHavePrompt('Martian Hounds');
            this.player1.clickCard(this.tunk);
            expect(this.tunk.tokens.power).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow empowering enemy creatures', function () {
            this.zorg.tokens.damage = 2;
            this.batdrone.tokens.damage = 1;
            this.player1.play(this.martianHounds);
            expect(this.player1).toHavePrompt('Martian Hounds');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.tokens.power).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
