describe('Shadow Self', function () {
    describe("Shadow Self's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bad-penny', 'shadow-self', 'urchin'],
                    hand: ['shadow-self', 'abond-the-armorsmith']
                },
                player2: {
                    inPlay: ['silvertooth']
                }
            });
            this.shadowSelf1 = this.player1.findCardByName('shadow-self', 'play area');
            this.shadowSelf2 = this.player1.findCardByName('shadow-self', 'hand');
        });

        it('should not deal damage in fights', function () {
            this.player1.fightWith(this.shadowSelf1, this.silvertooth);
            expect(this.shadowSelf1.tokens.damage).toBe(2);
            expect(this.silvertooth.hasToken('damage')).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.shadowSelf1);
            expect(this.shadowSelf1.tokens.damage).toBe(4);
            expect(this.silvertooth.hasToken('damage')).toBe(false);
        });

        it('should take damage instead of a creature next to it', function () {
            this.player1.fightWith(this.urchin, this.silvertooth);
            expect(this.urchin.hasToken('damage')).toBe(false);
            expect(this.urchin.location).toBe('play area');
            expect(this.shadowSelf1.tokens.damage).toBe(2);
            expect(this.silvertooth.tokens.damage).toBe(1);
        });

        it('should not take damage when an elusive neighboring creature is attacked', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.urchin);
            expect(this.silvertooth.hasToken('damage')).toBe(false);
            expect(this.urchin.hasToken('damage')).toBe(false);
            expect(this.shadowSelf1.hasToken('damage')).toBe(false);
        });

        it('should reduce its armor before taking the damage', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.abondTheArmorsmith);
            this.player1.endTurn();
            expect(this.shadowSelf1.tokens.armor).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.shadowSelf1);
            expect(this.silvertooth.hasToken('damage')).toBe(false);
            expect(this.shadowSelf1.tokens.damage).toBe(1);
            expect(this.shadowSelf1.hasToken('armor')).toBe(false);
            expect(this.shadowSelf1.armorUsed).toBe(1);
        });

        it('should reduce its armor before taking the damage of neighbors', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.abondTheArmorsmith);
            this.player1.endTurn();
            expect(this.shadowSelf1.tokens.armor).toBe(1);
            expect(this.badPenny.tokens.armor).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.badPenny);
            expect(this.silvertooth.tokens.damage).toBe(1);
            expect(this.badPenny.hasToken('armor')).toBe(false);
            expect(this.badPenny.armorUsed).toBe(1);
            expect(this.badPenny.hasToken('damage')).toBe(false);
            expect(this.badPenny.hasToken('damage')).toBe(false);
            expect(this.shadowSelf1.hasToken('armor')).toBe(false);
            expect(this.shadowSelf1.armorUsed).toBe(1);
        });

        it('should prompt the active player to choose which Shadow Self gets the damage if two can receive it', function () {
            this.player1.playCreature(this.shadowSelf2, true);
            expect(this.badPenny.neighbors).toContain(this.shadowSelf1);
            expect(this.badPenny.neighbors).toContain(this.shadowSelf2);
            this.player1.fightWith(this.badPenny, this.silvertooth);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.shadowSelf1);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf2);
            this.player1.clickCard(this.shadowSelf1);
            expect(this.shadowSelf1.tokens.damage).toBe(2);
            expect(this.shadowSelf2.hasToken('damage')).toBe(false);
        });
    });
});
