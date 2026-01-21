describe('Relentless Assault', function () {
    describe("Relentless Assault's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['relentless-assault'],
                    inPlay: ['bumpsy', 'troll', 'ganger-chieftain']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should ready and fight with up to 3 creatures', function () {
            this.bumpsy.exhausted = true;
            this.troll.exhausted = true;
            this.player1.play(this.relentlessAssault);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.zorg);
            expect(this.batdrone.location).toBe('discard');
            expect(this.mother.location).toBe('discard');
            expect(this.zorg.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow selecting fewer than 3 creatures', function () {
            this.player1.play(this.relentlessAssault);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
