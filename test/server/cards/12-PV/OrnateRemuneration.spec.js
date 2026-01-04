describe('Ornate Remuneration', function () {
    describe("Ornate Remuneration's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    hand: ['ornate-remuneration'],
                    inPlay: ['raiding-knight', 'almsmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should move amber from friendly creatures to pool', function () {
            this.raidingKnight.tokens.amber = 2;
            this.almsmaster.tokens.amber = 1;
            this.player1.play(this.ornateRemuneration);
            this.player1.clickPrompt('Move amber');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.raidingKnight);
            expect(this.raidingKnight.amber).toBe(0);
            expect(this.almsmaster.amber).toBe(1);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow a friendly creature to capture 3 amber', function () {
            this.player1.play(this.ornateRemuneration);
            this.player1.clickPrompt('Capture 3');
            this.player1.clickCard(this.raidingKnight);
            expect(this.raidingKnight.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
