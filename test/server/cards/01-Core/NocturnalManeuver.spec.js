describe('Nocturnal Maneuver', function () {
    describe("Nocturnal Maneuver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['nocturnal-maneuver'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['troll', 'batdrone', 'zorg', 'tunk']
                }
            });
        });

        it('should exhaust up to 3 creatures', function () {
            this.player1.play(this.nocturnalManeuver);
            expect(this.player1).toHavePrompt('Nocturnal Maneuver');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt('Done');
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.zorg.exhausted).toBe(true);
            expect(this.tunk.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting fewer than 3 creatures', function () {
            this.player1.play(this.nocturnalManeuver);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.zorg.exhausted).toBe(false);
            expect(this.tunk.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting friendly creatures', function () {
            this.player1.play(this.nocturnalManeuver);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.zorg.exhausted).toBe(false);
            expect(this.tunk.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
