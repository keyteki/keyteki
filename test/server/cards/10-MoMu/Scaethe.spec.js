describe('Scaethe', function () {
    describe("Scaethe's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['scaethe', 'dust-pixie']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'old-bruno', 'shock-herder']
                }
            });
        });

        it('should destroy least powerful enemt creature when destroyed', function () {
            this.player1.fightWith(this.scaethe, this.troll);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).toBeAbleToSelect(this.shockHerder);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.scaethe);
            this.player1.clickCard(this.shockHerder);
            expect(this.shockHerder.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
