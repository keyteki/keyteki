describe('Musthic Murmook', function () {
    describe("Musthic Murmook's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'untamed',
                    hand: ['musthic-murmook'],
                    inPlay: ['batdrone'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    amber: 6,
                    inPlay: ['mighty-tiger', 'snufflegator'],
                    hand: ['inka-the-spider', 'sequis'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });
        it('should deal 4 damage to a creature when played', function () {
            this.player1.play(this.musthicMurmook);
            expect(this.player1).toHavePrompt('Musthic Murmook');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.snufflegator);
            expect(this.snufflegator.location).toBe('discard');
        });
        it('should increase key cost by 1 for both players.', function () {
            this.player1.play(this.musthicMurmook);
            expect(this.player1).toHavePrompt('Musthic Murmook');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.snufflegator);
            expect(this.snufflegator.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.amber).toBe(6);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(6);
        });
    });
});
