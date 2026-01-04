describe('Thing from the Deep', function () {
    describe("Thing from the Deep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['thing-from-the-deep', 'open-the-seal']
                },
                player2: {
                    amber: 3,
                    inPlay: ['umbra']
                }
            });
        });

        it('cannot be played without Open the Seal in the discard', function () {
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.player1).toHavePrompt('Thing from the Deep');
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.player1).toHavePromptButton('Discard this card');
        });

        it('can be played without Open the Seal in the discard', function () {
            this.player1.play(this.openTheSeal);
            this.player1.playCreature(this.thingFromTheDeep);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 2 on fight', function () {
            this.player1.play(this.openTheSeal);
            expect(this.player1.amber).toBe(2);
            this.player1.playCreature(this.thingFromTheDeep);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.fightWith(this.thingFromTheDeep, this.umbra);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
        });
    });
});
