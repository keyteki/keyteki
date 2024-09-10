describe('Articulated Ren', function () {
    describe("Articulated Ren's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['articulated-ren'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    inPlay: ['krump'],
                    hand: ['storm-surge']
                }
            });
        });

        it('exhausts a creature to draw a card', function () {
            this.player1.playCreature(this.articulatedRen);
            this.player1.endTurn();
            expect(this.player1).toBeAbleToSelect(this.articulatedRen);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.articulatedRen);
            expect(this.articulatedRen.exhausted).toBe(true);
            expect(this.helperBot.exhausted).toBe(false);
            expect(this.player1.player.hand.length).toBe(7);
            this.player2.clickPrompt('brobnar');
        });

        it('is optional', function () {
            this.player1.playCreature(this.articulatedRen);
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.articulatedRen.exhausted).toBe(false);
            expect(this.helperBot.exhausted).toBe(false);
            expect(this.player1.player.hand.length).toBe(6);
            this.player2.clickPrompt('brobnar');
        });

        it('does nothing if you do not exhaust a creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.stormSurge);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.playCreature(this.articulatedRen);
            this.player1.endTurn();
            this.player1.clickCard(this.articulatedRen);
            expect(this.articulatedRen.exhausted).toBe(true);
            expect(this.player1.player.hand.length).toBe(6);
            this.player2.clickPrompt('brobnar');
        });
    });
});
