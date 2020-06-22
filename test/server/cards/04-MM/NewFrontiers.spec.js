describe('New Frontiers', function () {
    describe("New Frontiers' abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['flaxia', 'medic-ingram', 'bumblebird', 'ancient-bear'],
                    hand: ['new-frontiers']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should work and just reveal cards when deck is empty', function () {
            this.player1.player.deck = [];

            this.player1.play(this.newFrontiers);
            expect(this.player1).not.toHavePrompt('Choose a house');
            expect(this.player1.amber).toBe(1);
        });

        it('should archive selected house cards and discard the others', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.medicIngram, 'deck');
            this.player1.moveCard(this.bumblebird, 'deck');
            this.player1.moveCard(this.ancientBear, 'deck');

            this.player1.play(this.newFrontiers);
            expect(this.player1).toHavePrompt('Choose a house');
            this.player1.clickPrompt('untamed');

            expect(this.flaxia.location).toBe('deck');
            expect(this.medicIngram.location).toBe('discard');
            expect(this.bumblebird.location).toBe('archives');
            expect(this.ancientBear.location).toBe('archives');
        });
    });
});
