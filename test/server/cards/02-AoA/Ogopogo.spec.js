describe('Ogopogo', function () {
    describe("Ogopogo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ogopogo', 'bumpsy', 'culf-the-quiet']
                },
                player2: {
                    house: 'shadows',
                    inPlay: ['umbra', 'gamgee']
                }
            });
        });

        it('should deal 2 damage to another creature after it attacks and destroys a different one', function () {
            this.player1.fightWith(this.ogopogo, this.umbra);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.ogopogo);
            this.player1.clickCard(this.ogopogo);
            expect(this.player1).toHavePrompt('Ogopogo');
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            this.player1.clickCard(this.gamgee);
            expect(this.ogopogo.tokens.damage).toBe(2);
            expect(this.umbra.location).toBe('discard');
            expect(this.gamgee.location).toBe('discard');
        });

        it('should not prompt to deal damage when a creature dies after attacking ogopogo', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.gamgee, this.ogopogo);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.ogopogo.location).toBe('play area');
            expect(this.gamgee.location).toBe('discard');
            expect(this.ogopogo.tokens.damage).toBe(2);
        });
    });
});
