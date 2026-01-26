describe('Opposition Research', function () {
    describe("Opposition Research's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['batdrone'],
                    hand: ['opposition-research']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });

            this.player1.play(this.oppositionResearch);
        });

        it('own creatures should be able to reap', function () {
            this.player1.reap(this.batdrone);
            expect(this.player1.amber).toBe(1);
        });

        it('opponent creatures should not be able to reap', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should last for one turn only', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'logos',
                    hand: ['opposition-research'],
                    inPlay: ['tachyon-manifold', 'batdrone']
                },
                player2: {
                    amber: 0,
                    inPlay: ['ember-imp'],
                    hand: []
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'logos');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.oppositionResearch);
            this.player1.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.emberImp);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).toHavePromptButton('Fight with this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
