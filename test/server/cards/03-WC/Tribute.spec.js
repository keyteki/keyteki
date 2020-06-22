describe('Tribute', function () {
    describe("Tribute's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    hand: ['tribute'],
                    inPlay: ['shooler', 'gub', 'krump']
                },
                player2: {
                    amber: 12,
                    inPlay: ['tunk']
                }
            });
        });

        it('should prompt for most powerful creature to capture amber, and allow not to exalt', function () {
            this.player1.play(this.tribute);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.krump);
            expect(this.krump.amber).toBe(2);
            expect(this.player1).toHavePrompt('Do you wish to exalt the creature?');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture amber, and allow exalt, but just once', function () {
            this.player1.play(this.tribute);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.krump);
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(10);
            expect(this.player1).toHavePrompt('Do you wish to exalt the creature?');
            this.player1.clickPrompt('Yes');
            expect(this.krump.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.gub);
            expect(this.gub.amber).toBe(2);
            expect(this.player2.amber).toBe(8);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow exalt even if no amber was captured', function () {
            this.player2.amber = 0;
            this.player1.play(this.tribute);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.krump);
            expect(this.krump.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Do you wish to exalt the creature?');
            this.player1.clickPrompt('Yes');
            expect(this.krump.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.gub);
            expect(this.gub.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow multiple tribute plays', function () {
            this.player1.play(this.tribute);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.krump);
            expect(this.krump.amber).toBe(5);
            expect(this.player2.amber).toBe(8);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.moveCard(this.tribute, 'hand');

            this.player1.play(this.tribute);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.krump);
            expect(this.krump.amber).toBe(10);
            expect(this.player2.amber).toBe(4);
        });
    });
});
