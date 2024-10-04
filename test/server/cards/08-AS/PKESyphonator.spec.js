describe('P.K.E. Syphonator', function () {
    describe("P.K.E. Syphonator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['pke-syphonator'],
                    inPlay: ['gub']
                },
                player2: {
                    hand: ['scoop-up'],
                    archives: ['charette', 'shooler']
                }
            });
        });

        it('should give an amber for each card in opponent archives, and discard them', function () {
            this.player1.playCreature(this.pkeSyphonator);
            expect(this.player1.amber).toBe(3);
            expect(this.charette.location).toBe('discard');
            expect(this.shooler.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give amber for abducted cards as well', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.clickPrompt('No');
            this.player2.play(this.scoopUp);
            this.player2.clickCard(this.gub);
            this.player2.endTurn();

            this.player1.clickPrompt('geistoid');
            this.player1.playCreature(this.pkeSyphonator);
            expect(this.player1.amber).toBe(4);
            expect(this.charette.location).toBe('discard');
            expect(this.shooler.location).toBe('discard');
            expect(this.gub.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
