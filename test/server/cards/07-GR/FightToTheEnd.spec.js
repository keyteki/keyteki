describe('Fight to the End', function () {
    describe("Fight to the End's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['fight-to-the-end', 'press-gang'],
                    inPlay: ['groke', 'cpo-zytar', 'sandhopper'],
                    discard: new Array(9).fill('anger') // not yet haunted
                },
                player2: {
                    inPlay: ['batdrone', 'hunting-witch', 'umbra']
                }
            });
        });

        it('ready and fight with a friendly creature', function () {
            this.player1.reap(this.groke);
            this.player1.play(this.fightToTheEnd);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.batdrone);
            expect(this.groke.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('give the friendly creature skirmish when haunted until it leaves play', function () {
            this.player1.play(this.pressGang);
            this.player1.play(this.fightToTheEnd);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.batdrone);
            expect(this.groke.tokens.damage).toBe(undefined);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            // Still has skirmish on the next turn, even though we're
            // not haunted anymore.
            expect(this.player1.player.isHaunted()).toBe(false);
            this.player1.fightWith(this.groke, this.huntingWitch);
            expect(this.groke.tokens.damage).toBe(undefined);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');

            // Return to hand and replay; should no longer have skirmish.
            this.player1.useAction(this.sandhopper);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.groke);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.groke, this.umbra);
            expect(this.groke.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can be played with no friendly creatures', function () {
            this.player1.moveCard(this.groke, 'discard');
            this.player1.moveCard(this.cpoZytar, 'discard');
            this.player1.play(this.fightToTheEnd);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
