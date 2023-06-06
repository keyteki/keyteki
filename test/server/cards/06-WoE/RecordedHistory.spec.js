describe('Recorded History', function () {
    describe("Recorded History's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: [
                        'recorded-history',
                        'helmsman-spears',
                        'lay-of-the-land',
                        'batdrone',
                        'labwork',
                        'pelf',
                        'bumpsy'
                    ]
                }
            });
        });

        it('should allow for archiving none', function () {
            this.player1.play(this.recordedHistory);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow for archiving one card', function () {
            this.player1.play(this.recordedHistory);
            this.player1.clickCard(this.helmsmanSpears);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.labwork);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.layOfTheLand);
            this.player1.clickPrompt('Done');
            expect(this.helmsmanSpears.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow for archiving two cards', function () {
            this.player1.play(this.recordedHistory);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickCard(this.labwork);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.layOfTheLand);
            this.player1.clickPrompt('Done');
            expect(this.helmsmanSpears.location).toBe('archives');
            expect(this.labwork.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow for archiving three cards', function () {
            this.player1.play(this.recordedHistory);
            this.player1.clickCard(this.helmsmanSpears);
            this.player1.clickCard(this.labwork);
            this.player1.clickCard(this.pelf);
            expect(this.helmsmanSpears.location).toBe('archives');
            expect(this.labwork.location).toBe('archives');
            expect(this.pelf.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
