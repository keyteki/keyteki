describe('Abandon Ship', function () {
    describe("Abandon Ship's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['abandon-ship'],
                    inPlay: ['kaupe', 'wikolia']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg', 'krump']
                }
            });
        });

        it('returns one creature when the tide is low', function () {
            this.player1.play(this.abandonShip);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.wikolia);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.wikolia);
            expect(this.wikolia.location).toBe('hand');
        });

        it('returns 4 creatures when the tide is high', function () {
            this.player1.raiseTide();
            this.player1.play(this.abandonShip);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.wikolia);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1.currentButtons).not.toContain('Done');
            this.player1.clickCard(this.wikolia);
            expect(this.player1.currentButtons).not.toContain('Done');
            this.player1.clickCard(this.batdrone);
            expect(this.player1.currentButtons).not.toContain('Done');
            this.player1.clickCard(this.mother);
            expect(this.player1.currentButtons).not.toContain('Done');
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.wikolia.location).toBe('hand');
            expect(this.batdrone.location).toBe('hand');
            expect(this.mother.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
        });
    });
});
