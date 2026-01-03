describe('Spade Teller', function () {
    describe("Spade Teller's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['pelf'],
                    inPlay: ['spade-teller']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('should gain amber if the house guess is correct on play', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.moveCard(this.spadeTeller, 'hand');
            this.player1.playCreature(this.spadeTeller);
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(2);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber if the house guess is wrong on play', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.moveCard(this.spadeTeller, 'hand');
            this.player1.playCreature(this.spadeTeller);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.amber).toBe(1);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain amber if the house guess is correct after fight', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.fightWith(this.spadeTeller, this.urchin);
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(2);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber if the house guess is wrong after fight', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.fightWith(this.spadeTeller, this.urchin);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.amber).toBe(1);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain amber if the house guess is correct after reap', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.reap(this.spadeTeller);
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(3);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber if the house guess is wrong after reap', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.reap(this.spadeTeller);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.amber).toBe(2);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
