describe('ColonelMariana', function () {
    describe("ColonelMariana's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    hand: ['colonel-mariana', 'ardent-hero'],
                    inPlay: ['flaxia', 'badgemagus', 'almsmaster']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should capture 3 ameber when there are 3 knights in play including Colonel Mariana', function () {
            expect(this.player2.amber).toBe(3);
            this.player1.playCreature(this.colonelMariana);

            expect(this.colonelMariana.tokens.amber).toBe(1);
            expect(this.badgemagus.tokens.amber).toBe(1);
            expect(this.almsmaster.tokens.amber).toBe(1);

            expect(this.player2.amber).toBe(0);

            this.player1.endTurn();
        });

        it('should prmopt for capture when there is more creatures than ameber to capture', function () {
            this.player1.playCreature(this.ardentHero);

            this.player1.playCreature(this.colonelMariana);

            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.badgemagus);
            expect(this.player1).toBeAbleToSelect(this.almsmaster);
            expect(this.player1).toBeAbleToSelect(this.colonelMariana);
            expect(this.player1).toBeAbleToSelect(this.ardentHero);

            this.player1.clickCard(this.colonelMariana);
            this.player1.clickCard(this.badgemagus);
            this.player1.clickCard(this.ardentHero);
            this.player1.clickPrompt('Done');

            expect(this.colonelMariana.tokens.amber).toBe(1);
            expect(this.badgemagus.tokens.amber).toBe(1);
            expect(this.ardentHero.tokens.amber).toBe(1);

            expect(this.player2.amber).toBe(0);

            this.player1.endTurn();
        });
    });
});
