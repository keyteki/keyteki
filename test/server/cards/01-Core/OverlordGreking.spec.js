describe('Overlord Greking', function () {
    describe("Overlord Greking's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    inPlay: ['overlord-greking', 'dominator-bauble']
                },
                player2: {
                    amber: 3,
                    inPlay: ['mother', 'troll', 'batdrone', 'dextre', 'groke']
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

        it('should be able to use the controller creature', function () {
            this.player1.fightWith(this.overlordGreking, this.batdrone);
            expect(this.overlordGreking.tokens.damage).toBe(2);
            expect(this.batdrone.hasToken('damage')).toBe(false);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('batdrone');
            this.player1.clickPrompt('Left');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.controller).toBe(this.player1.player);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.fightWith(this.batdrone, this.troll);
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.hasToken('damage')).toBe(false);
            expect(this.troll.tokens.damage).toBe(2);
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
            this.expectReadyToTakeAction(this.player1);
            expect(this.dextre.controller).toBe(this.player2.player);
        });

        it('should not trigger fight effects of attacker (Groke)', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.groke, this.overlordGreking);
            this.player2.clickPrompt('Left');
            expect(this.player1.player.cardsInPlay).toContain(this.groke);
            expect(this.player2.player.discard).not.toContain(this.groke);
            expect(this.groke.tokens.damage).toBeUndefined();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });
    });
});
