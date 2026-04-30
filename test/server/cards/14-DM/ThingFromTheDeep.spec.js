describe('Thing from the Deep', function () {
    describe("Thing from the Deep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['thing-from-the-deep'],
                    discard: ['open-the-seal']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        it('cannot be played unless Open the Seal is in discard pile', function () {
            this.player1.player.discard = [];
            this.player1.clickCard(this.thingFromTheDeep);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Cancel');
            expect(this.thingFromTheDeep.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be played when Open the Seal is in discard pile', function () {
            this.player1.play(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 2 amber on fight', function () {
            this.player1.play(this.thingFromTheDeep);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.fightWith(this.thingFromTheDeep, this.troll);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals only what opponent has', function () {
            this.player2.player.amber = 1;
            this.player1.play(this.thingFromTheDeep);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.fightWith(this.thingFromTheDeep, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
