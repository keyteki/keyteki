describe('Overlord Greking', function () {
    integration(function () {
        describe("Overlord Greking's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['overlord-greking', 'dominator-bauble']
                    },
                    player2: {
                        inPlay: ['mother', 'troll', 'dextre']
                    }
                });
            });

            it("should put a destroyed creature into play under the controller's control", function () {
                this.player1.fightWith(this.overlordGreking, this.mother);
                expect(this.overlordGreking.tokens.damage).toBe(5);
                expect(this.mother.hasToken('damage')).toBe(false);
                expect(this.mother.location).toBe('discard');
                expect(this.player1).toHavePrompt('mother');
                this.player1.clickPrompt('Left');
                expect(this.mother.location).toBe('play area');
                expect(this.mother.controller).toBe(this.player1.player);
                expect(this.player1.player.cardsInPlay).toContain(this.mother);
                this.player1.endTurn();
                expect(this.player1.hand.length).toBe(7);
            });

            it('should make the controlled creature die as normal', function () {
                this.player1.fightWith(this.overlordGreking, this.mother);
                this.player1.clickPrompt('Left');
                this.mother.ready();
                expect(this.player1.player.cardsInPlay).toContain(this.mother);
                expect(this.player2.player.discard).not.toContain(this.mother);
                this.player1.clickCard(this.dominatorBauble);
                this.player1.clickPrompt("Use this card's Action ability");
                this.player1.clickCard(this.mother);
                expect(this.player1).toHavePrompt('Mother');
                this.player1.clickPrompt('Fight with this creature');
                this.player1.clickCard(this.troll);
                expect(this.troll.tokens.damage).toBe(5);
                expect(this.mother.location).toBe('discard');
                expect(this.mother.controller).toBe(this.player2.player);
                expect(this.player2.player.discard).toContain(this.mother);
            });

            it('should not work on Dextre', function () {
                this.player1.fightWith(this.overlordGreking, this.dextre);
                expect(this.overlordGreking.tokens.damage).toBe(3);
                expect(this.dextre.hasToken('damage')).toBe(false);
                expect(this.dextre.location).toBe('deck');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.dextre.controller).toBe(this.player2.player);
            });
        });
    });
});
