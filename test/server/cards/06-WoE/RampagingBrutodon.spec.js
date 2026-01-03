describe('Rampaging Brutodon', function () {
    describe("Rampaging Brutodon's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    token: 'grumpus',
                    hand: ['rampaging-brutodon']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should make a token creature on play', function () {
            this.player1.playCreature(this.rampagingBrutodon);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });

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
            expect(this.player1).not.toBeAbleToSelect(this.brokenAxeOutpost);
            this.player1.clickCard(this.pelf);
            expect(this.player1.amber).toBe(2);
            expect(this.pelf.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
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
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be able to destroy itself', function () {
            this.player1.clickCard(this.rampagingBrutodon);
            this.player1.clickPrompt('Reap with this creature');
            this.player1.clickCard(this.rampagingBrutodon);
            expect(this.player1.amber).toBe(1);
            expect(this.rampagingBrutodon.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
