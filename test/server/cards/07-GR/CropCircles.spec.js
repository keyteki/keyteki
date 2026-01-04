describe('Crop Circles', function () {
    describe('is played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    archives: ['tunk'],
                    hand: ['crop-circles', 'scoop-up'],
                    house: 'mars',
                    inPlay: ['blypyp', 'dextre', 'batdrone']
                },
                player2: {
                    amber: 3,
                    archives: ['dodger'],
                    inPlay: ['troll', 'urchin', 'mindwarper']
                }
            });

            this.player1.play(this.scoopUp);
            expect(this.player1).toHavePrompt('Scoop Up');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow purging of any number of cards to capture', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.cropCircles);
            expect(this.player1).toHavePrompt('Crop Circles');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.tunk);
            this.player1.clickPrompt('done');
            expect(this.tunk.location).toBe('purged');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.urchin.tokens.amber).toBe(2);
        });

        it('should selecting friendly creature to capture', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.cropCircles);
            expect(this.player1).toHavePrompt('Crop Circles');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.tunk);
            this.player1.clickPrompt('done');
            expect(this.tunk.location).toBe('purged');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.batdrone.tokens.amber).toBe(2);
        });

        it('should return archived opponent cards to their hands and not capture', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.cropCircles);
            expect(this.player1).toHavePrompt('Crop Circles');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.tunk);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('done');
            expect(this.tunk.location).toBe('purged');
            expect(this.player2.hand).toContain(this.troll);
            expect(this.player1.hand).not.toContain(this.troll);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.urchin.tokens.amber).toBe(2);
        });

        it('should allow you to select no purges', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.cropCircles);
            expect(this.player1).toHavePrompt('Crop Circles');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickPrompt('done');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(2);
            expect(this.urchin.tokens.amber).toBe(1);
        });

        it('should work when opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.play(this.cropCircles);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.urchin.tokens.amber).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
