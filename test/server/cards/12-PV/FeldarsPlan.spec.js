describe("Feldar's Plan", function () {
    describe("Feldar's Plan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['feldar-s-plan', 'customs-office'],
                    amber: 1
                },
                player2: {
                    hand: ['searine', 'ember-imp', 'krump'],
                    amber: 3
                }
            });
        });
        it('should steal amber for each card played', function () {
            this.player1.play(this.feldarSPlan);
            this.player1.play(this.customsOffice);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.emberImp);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.player2.play(this.searine);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.krump);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'shadows',
                    hand: ['feldar-s-plan'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 1,
                    inPlay: [],
                    hand: ['dew-faerie']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'shadows');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.feldarSPlan);
            this.player1.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
            this.player2.play(this.dewFaerie);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
