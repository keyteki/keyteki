describe('Recovery Operation', function () {
    describe("Recovery Operation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['recovery-operation'],
                    discard: ['krump', 'anger', 'uncharted-lands', 'troll']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });

            this.player2.moveCard(this.troll, 'deck bottom');
            this.player2.moveCard(this.unchartedLands, 'deck bottom');
            this.player2.moveCard(this.anger, 'deck bottom');
            this.player2.moveCard(this.krump, 'deck bottom');
        });

        it('should discard bottom 3 cards and allow putting all on top', function () {
            this.player1.play(this.recoveryOperation);
            expect(this.player1.discard.length).toBe(3);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).toBeAbleToSelect(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).not.toBeAbleToSelect(this.unchartedLands);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.anger);
            expect(this.player1.deck[0]).toBe(this.anger);
            expect(this.player1.deck[1]).toBe(this.unchartedLands);
            expect(this.player1.deck[2]).toBe(this.krump);
            expect(this.player1.discard.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard bottom 3 cards and allow putting none on top', function () {
            this.player1.play(this.recoveryOperation);
            expect(this.player1.discard.length).toBe(3);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.krump.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.unchartedLands.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
