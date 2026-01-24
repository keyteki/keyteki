describe('Ascendant Hester', function () {
    describe("Ascendant Hester's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    hand: ['ascendant-hester', 'ascendant-hester2'],
                    inPlay: ['raiding-knight', 'scrivener-favian']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });

            this.raidingKnight.amber = 1;
            this.lamindra.amber = 1;
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.ascendantHester2, 'discard');
            this.player1.clickCard(this.ascendantHester);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.ascendantHester, 'discard');
            this.player1.clickCard(this.ascendantHester2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.ascendantHester);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.ascendantHester2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should capture 1 on each friendly creature on play', function () {
            this.player1.playCreature(this.ascendantHester);
            expect(this.raidingKnight.amber).toBe(2);
            expect(this.scrivenerFavian.amber).toBe(1);
            expect(this.ascendantHester.amber).toBe(1);
            expect(this.lamindra.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should capture 1 on each other friendly creature on fight', function () {
            this.player1.playCreature(this.ascendantHester);
            this.ascendantHester.ready();
            this.player1.fightWith(this.ascendantHester, this.lamindra);
            expect(this.raidingKnight.amber).toBe(3);
            expect(this.scrivenerFavian.amber).toBe(2);
            expect(this.ascendantHester.amber).toBe(2);
            expect(this.lamindra.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give +2 armor for each amber on other friendly creatures', function () {
            this.player1.playCreature(this.ascendantHester);
            expect(this.raidingKnight.armor).toBe(6);
            expect(this.scrivenerFavian.armor).toBe(2);
            expect(this.ascendantHester.armor).toBe(0);
            expect(this.lamindra.armor).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
