describe('Further Testing Needed', function () {
    describe("Further Testing Needed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['troll', 'krump', 'gauntlet-of-command'],
                    hand: ['further-testing-needed', 'hypnobeam']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should archive a friendly card when played', function () {
            this.player1.play(this.furtherTestingNeeded);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.gauntletOfCommand);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should archive a friendly opponent-owned creature when played', function () {
            this.player1.play(this.hypnobeam);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Right');
            this.player1.play(this.furtherTestingNeeded);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player2.archives).toContain(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
