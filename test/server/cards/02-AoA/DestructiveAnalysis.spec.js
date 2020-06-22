describe('Destructive Analysis', function () {
    describe("Destructive Analysis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['sample-collection', 'destructive-analysis'],
                    archives: ['tunk']
                },
                player2: {
                    inPlay: ['troll', 'dextre', 'bumpsy', 'sequis'],
                    archives: ['raiding-knight']
                }
            });
            this.player1.player.keys = { red: false, blue: false, yellow: false };
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.play(this.sampleCollection);
            expect(this.player1).toHavePrompt('Sample Collection');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should allow purging of any number of cards to deal 2D to a creature', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.destructiveAnalysis);
            expect(this.player1).toHavePrompt('Destructive Analysis');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            this.player1.clickCard(this.tunk);
            this.player1.clickPrompt('done');
            expect(this.tunk.location).toBe('purged');
            expect(this.bumpsy.tokens.damage).toBe(4);
        });
        it('should return archived opponent cards to their hands and deal no additional damage ', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.destructiveAnalysis);
            expect(this.player1).toHavePrompt('Destructive Analysis');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('done');
            expect(this.troll.location).not.toBe('purged');
            expect(this.player2.hand).toContain(this.troll);
            expect(this.player1.hand).not.toContain(this.troll);
            expect(this.bumpsy.tokens.damage).toBe(2);
        });
        it('should allow you to select no creatures', function () {
            expect(this.tunk.location).toBe('archives');
            this.player1.play(this.destructiveAnalysis);
            expect(this.player1).toHavePrompt('Destructive Analysis');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.raidingKnight);
            this.player1.clickPrompt('done');
            expect(this.bumpsy.tokens.damage).toBe(2);
        });
    });
});
