describe('Portal Guardian', function () {
    describe("Portal Guardian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['krump', 'echofly', 'portal-guardian']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        it('capture 2 on a friendly creature on destroy', function () {
            this.player1.fightWith(this.portalGuardian, this.troll);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.portalGuardian);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.portalGuardian.location).toBe('discard');
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('capture 2 on a friendly creature when opponent destroys it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.portalGuardian);
            expect(this.player2).toBeAbleToSelect(this.echofly);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.portalGuardian);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            this.player2.clickCard(this.krump);
            expect(this.portalGuardian.location).toBe('discard');
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
