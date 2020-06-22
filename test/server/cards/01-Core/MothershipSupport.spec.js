describe('Mothership Support', function () {
    describe("Mothership Support's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['mindwarper', 'john-smyth', 'ulyq-megamouth'],
                    hand: ['mothership-support']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('should not do anything if there are no creatures in play', function () {
            this.player1.fightWith(this.mindwarper, this.troll);
            this.player1.fightWith(this.johnSmyth, this.troll);
            this.player1.fightWith(this.ulyqMegamouth, this.bumpsy);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.play(this.mothershipSupport);
            expect(this.mothershipSupport.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should trigger and deal damage for each ready mars creature', function () {
            this.player1.play(this.mothershipSupport);
            expect(this.player1).toHavePrompt('Mothership Support');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Mothership Support');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.mindwarper);
            expect(this.player1).toHavePrompt('Mothership Support');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.mindwarper.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
