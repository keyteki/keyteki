describe('Rampaging Brutodon', function () {
    describe("Rampaging Brutodon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['rampaging-brutodon', 'pelf', 'broken-axe-outpost']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should require destroying a friendly creature to use', function () {
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);
            expect(this.player1.amber).toBe(2);
            expect(this.pelf.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should pop wards but not allow use of Brutodon', function () {
            this.pelf.tokens.ward = 1;
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.pelf);
            expect(this.player1.amber).toBe(1);
            expect(this.pelf.location).toBe('play area');
            expect(this.pelf.tokens.ward).toBe(undefined);
            expect(this.rampagingBrutodon.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to destroy itself', function () {
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            this.player1.clickCard(this.rampagingBrutodon);
            expect(this.player1.amber).toBe(1);
            expect(this.rampagingBrutodon.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
