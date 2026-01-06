describe('Devour Whole', function () {
    describe("Devour Whole's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['legendary-keyraken', 'devour-whole'],
                    inPlay: ['garnet-squire', 'epic-quest']
                },
                player2: {
                    inPlay: ['troll', 'screechbomb']
                }
            });
        });

        it('does nothing when legendary keyraken is not in play', function () {
            this.player1.play(this.devourWhole);
            expect(this.garnetSquire.location).toBe('play area');
            expect(this.epicQuest.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.screechbomb.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys an enemy creature when legendary keyraken is in play', function () {
            this.player1.play(this.legendaryKeyraken);
            this.player1.play(this.devourWhole);
            expect(this.player1).toHavePrompt('Devour Whole');
            expect(this.player1).not.toBeAbleToSelect(this.garnetSquire);
            expect(this.player1).not.toBeAbleToSelect(this.epicQuest);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.screechbomb);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys an enemy artifact when legendary keyraken is in play', function () {
            this.player1.play(this.legendaryKeyraken);
            this.player1.play(this.devourWhole);
            expect(this.player1).toHavePrompt('Devour Whole');
            expect(this.player1).not.toBeAbleToSelect(this.garnetSquire);
            expect(this.player1).not.toBeAbleToSelect(this.epicQuest);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.screechbomb);
            this.player1.clickCard(this.screechbomb);
            expect(this.screechbomb.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
