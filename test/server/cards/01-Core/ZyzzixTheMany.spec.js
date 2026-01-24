describe('Zyzzix the Many', function () {
    describe("Zyzzix the Many's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'mindwarper', 'squawker'],
                    inPlay: ['zyzzix-the-many']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should optionally reveal a creature from hand to archive it and gain power counters after reap', function () {
            this.player1.reap(this.zyzzixTheMany);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.zyzzixTheMany);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.squawker);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.location).toBe('archives');
            expect(this.zyzzixTheMany.tokens.power).toBe(3);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should optionally reveal a creature from hand after fight', function () {
            this.player1.fightWith(this.zyzzixTheMany, this.lamindra);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickCard(this.zyzzixTheMany);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.location).toBe('archives');
            expect(this.zyzzixTheMany.tokens.power).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow skipping the ability', function () {
            this.player1.reap(this.zyzzixTheMany);
            expect(this.player1).toHavePrompt('Any reactions?');
            this.player1.clickPrompt('Done');
            expect(this.zorg.location).toBe('hand');
            expect(this.zyzzixTheMany.tokens.power).toBeUndefined();
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stack power counters on multiple uses', function () {
            this.player1.reap(this.zyzzixTheMany);
            this.player1.clickCard(this.zyzzixTheMany);
            this.player1.clickCard(this.zorg);
            expect(this.zyzzixTheMany.tokens.power).toBe(3);
            this.zyzzixTheMany.ready();
            this.player1.reap(this.zyzzixTheMany);
            this.player1.clickCard(this.zyzzixTheMany);
            this.player1.clickCard(this.mindwarper);
            expect(this.zyzzixTheMany.tokens.power).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
