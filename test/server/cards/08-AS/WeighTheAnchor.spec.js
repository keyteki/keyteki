describe('Weigh the Anchor', function () {
    describe("Weigh the Anchor's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['weigh-the-anchor'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    inPlay: ['dust-pixie', 'lamindra', 'umbra']
                }
            });
        });

        it('should stun creatures for each more opponent has over you', function () {
            this.player1.play(this.weighTheAnchor);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.umbra);
            this.player1.clickPrompt('Done');
            expect(this.helperBot.stunned).toBe(false);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.lamindra.stunned).toBe(false);
            expect(this.umbra.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if you have more creatures', function () {
            this.player2.moveCard(this.dustPixie, 'discard');
            this.player2.moveCard(this.lamindra, 'discard');
            this.player2.moveCard(this.umbra, 'discard');
            this.player1.play(this.weighTheAnchor);
            expect(this.helperBot.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
