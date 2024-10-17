describe('Mass Abduction', function () {
    describe("Mass Abduction's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['orbital-bombardment', 'soft-landing', 'mass-abduction', 'mindwarper']
                },
                player2: {
                    inPlay: ['troll', 'dextre', 'bumpsy', 'sequis']
                }
            });
        });

        it('should archive all creatures selected', function () {
            this.player1.play(this.orbitalBombardment);
            this.player1.clickCard(this.massAbduction);
            this.player1.clickCard(this.mindwarper);
            this.player1.clickCard(this.softLanding);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.bumpsy);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.dextre.tokens.damage).toBe(2);
            expect(this.bumpsy.tokens.damage).toBe(2);
            this.player1.play(this.massAbduction);
            expect(this.player1).toHavePrompt('Mass Abduction');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('archives');
            expect(this.dextre.location).toBe('archives');
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.archives).toContain(this.bumpsy);
            expect(this.player1.archives).toContain(this.troll);
            expect(this.player1.archives).toContain(this.dextre);
        });
    });
});
