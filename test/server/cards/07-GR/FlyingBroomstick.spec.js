describe('Flying Broomstick', function () {
    describe("Flying Broomstick's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['tantadlin', 'flaxia'],
                    hand: ['flying-broomstick', 'wild-spirit']
                },
                player2: {
                    amber: 1,
                    inPlay: ['wretched-doll', 'umbra', 'gub']
                }
            });
            this.umbra.tokens.damage = 1;
            this.umbra.amber = 1;
        });

        it('should heal', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.fightWith(this.tantadlin, this.umbra);
            expect(this.tantadlin.tokens.damage).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(undefined);
        });

        it('remove amber', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.playUpgrade(this.wildSpirit, this.tantadlin);
            this.player1.reap(this.tantadlin);
            this.player1.clickPrompt('Wild Spirit');
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });

        it('should clear counters', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.useAction(this.wretchedDoll);
            this.player2.clickCard(this.tantadlin);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            expect(this.tantadlin.tokens.doom).toBe(1);
            this.player1.reap(this.tantadlin);
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.tokens.doom).toBe(undefined);
        });

        it('gain elusive', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.umbra, this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(undefined);
        });

        it('should work on other creatures', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.fightWith(this.tantadlin, this.gub);
            expect(this.tantadlin.tokens.damage).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.tantadlin);
            this.player1.clickCard(this.umbra);
            expect(this.tantadlin.tokens.damage).toBe(1);
            expect(this.umbra.tokens.damage).toBe(undefined);
            expect(this.umbra.amber).toBe(0);
        });
    });
});
