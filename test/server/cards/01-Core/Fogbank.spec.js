describe('Fogbank', function () {
    describe("Fogbank's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['niffle-ape'],
                    hand: ['fogbank']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });

            this.player1.play(this.fogbank);
        });

        it('own creatures should be able to fight', function () {
            this.player1.fightWith(this.niffleApe, this.emberImp);
            expect(this.niffleApe.tokens.damage).toBe(2);
            expect(this.emberImp.location).toBe('discard');
        });

        it('creature not should be able to fight', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
        });

        it('should last for one turn only', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'untamed',
                    hand: ['fogbank'],
                    inPlay: ['tachyon-manifold', 'niffle-ape']
                },
                player2: {
                    amber: 0,
                    inPlay: ['ember-imp'],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'untamed';
            this.tachyonManifold.printedHouse = 'untamed';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.fogbank);
            this.player1.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Reap with this creature');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
