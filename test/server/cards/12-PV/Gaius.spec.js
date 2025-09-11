describe('Gaius', function () {
    describe("Gaius's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['gaius', 'raiding-knight', 'almsmaster', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should ward each other friendly creature with amber after reap', function () {
            this.raidingKnight.tokens.amber = 1;
            this.almsmaster.tokens.amber = 1;
            this.krump.tokens.amber = 1;
            this.player1.reap(this.gaius);
            expect(this.raidingKnight.warded).toBe(true);
            expect(this.almsmaster.warded).toBe(true);
            expect(this.emberImp.warded).toBe(false);
            expect(this.gaius.warded).toBe(false);
            expect(this.krump.warded).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ward a friendly creature when scrapped', function () {
            this.player1.moveCard(this.gaius, 'hand');
            this.player1.scrap(this.gaius);
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.raidingKnight);
            expect(this.raidingKnight.warded).toBe(true);
            expect(this.almsmaster.warded).toBe(false);
            expect(this.emberImp.warded).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
