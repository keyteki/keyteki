describe('Protectrix', function () {
    describe("Protectrix's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'titan-mechanic'],
                    hand: ['poke']
                },
                player2: {
                    inPlay: ['commander-remiel', 'protectrix'],
                    hand: ['inspiration']
                }
            });
        });
        it('should make a creature invincible if it heals damage off it.', function () {
            this.player1.play(this.poke);
            expect(this.player1).toHavePrompt('Poke');
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toBeAbleToSelect(this.protectrix);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.commanderRemiel);
            expect(this.commanderRemiel.tokens.damage).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.reap(this.protectrix);
            expect(this.player2).toHavePrompt('Choose a creature');
            expect(this.player2).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player2).toBeAbleToSelect(this.protectrix);
            this.player2.clickCard(this.commanderRemiel);
            expect(this.commanderRemiel.tokens.damage).toBe(undefined);
            this.player2.fightWith(this.commanderRemiel, this.dextre);
            expect(this.commanderRemiel.tokens.damage).toBe(undefined);
            expect(this.dextre.location).toBe('deck');
            this.player2.play(this.inspiration);
            this.player2.clickCard(this.commanderRemiel);
            this.player2.clickPrompt('Fight with this creature');
            this.player2.clickCard(this.titanMechanic);
            expect(this.commanderRemiel.tokens.damage).toBe(undefined);
            expect(this.titanMechanic.tokens.damage).toBe(3);
        });
    });
});
