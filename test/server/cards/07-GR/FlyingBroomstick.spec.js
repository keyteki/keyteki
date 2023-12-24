describe('Flying Broomstick', function () {
    describe("Flying Broomstick's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['tantadlin'],
                    hand: ['flying-broomstick', 'wild-spirit']
                },
                player2: {
                    amber: 1,
                    inPlay: ['wretched-doll', 'umbra']
                }
            });
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
            expect(this.tantadlin.tokens.damage).toBe(undefined);
        });

        it('remove amber', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.playUpgrade(this.wildSpirit, this.tantadlin);
            this.player1.reap(this.tantadlin);
            this.player1.clickPrompt('Wild Spirit');
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
            expect(this.tantadlin.tokens.doom).toBe(undefined);
        });

        it('gain elusive', function () {
            this.player1.playUpgrade(this.flyingBroomstick, this.tantadlin);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.umbra, this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(undefined);
        });
    });
});
