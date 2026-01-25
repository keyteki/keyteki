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
                    inPlay: ['silvertooth', 'spyyyder', 'macis-asp', 'hapsis']
                }
            });
            this.shadowSelf1 = this.player1.findCardByName('shadow-self', 'play area');
            this.shadowSelf2 = this.player1.findCardByName('shadow-self', 'hand');
        });

        it('should not deal damage in fights', function () {
            this.player1.fightWith(this.shadowSelf1, this.silvertooth);
            expect(this.shadowSelf1.damage).toBe(2);
            expect(this.silvertooth.damage).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.shadowSelf1);
            expect(this.shadowSelf1.damage).toBe(4);
            expect(this.silvertooth.damage).toBe(0);
        });

        it('should take damage instead of a creature next to it', function () {
            this.player1.fightWith(this.urchin, this.silvertooth);
            expect(this.urchin.damage).toBe(0);
            expect(this.urchin.location).toBe('play area');
            expect(this.shadowSelf1.damage).toBe(2);
            expect(this.silvertooth.damage).toBe(1);
        });

        it('should not take damage when an elusive neighboring creature is attacked', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.urchin);
            expect(this.silvertooth.damage).toBe(0);
            expect(this.urchin.damage).toBe(0);
            expect(this.shadowSelf1.damage).toBe(0);
        });

        it('should reduce its armor before taking the damage', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.abondTheArmorsmith);
            this.player1.endTurn();
            expect(this.shadowSelf1.armor).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.shadowSelf1);
            expect(this.silvertooth.damage).toBe(0);
            expect(this.shadowSelf1.damage).toBe(1);
            expect(this.shadowSelf1.hasToken('armor')).toBe(false);
            expect(this.shadowSelf1.armorUsed).toBe(1);
        });

        it('should bypass its armor when taking the damage of neighbors', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.abondTheArmorsmith);
            this.player1.endTurn();
            expect(this.shadowSelf1.armor).toBe(1);
            expect(this.badPenny.armor).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.badPenny);
            expect(this.silvertooth.damage).toBe(1);
            expect(this.badPenny.hasToken('armor')).toBe(false);
            expect(this.badPenny.armorUsed).toBe(1);
            expect(this.badPenny.damage).toBe(0);
            expect(this.shadowSelf1.armor).toBe(1);
            expect(this.shadowSelf1.damage).toBe(1);
        });

        it('should bypass its ward and armor when taking the damage of neighbors', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.abondTheArmorsmith);
            this.player1.endTurn();
            this.shadowSelf1.ward();
            expect(this.shadowSelf1.armor).toBe(1);
            expect(this.badPenny.armor).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.badPenny);
            expect(this.silvertooth.damage).toBe(1);
            expect(this.badPenny.hasToken('armor')).toBe(false);
            expect(this.badPenny.armorUsed).toBe(1);
            expect(this.badPenny.damage).toBe(0);
            expect(this.shadowSelf1.armor).toBe(1);
            expect(this.shadowSelf1.warded).toBe(true);
            expect(this.shadowSelf1.damage).toBe(1);
        });

        it('should bypass its ward and be destroyed when taking the damage of neighbors', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.playCreature(this.abondTheArmorsmith);
            this.player1.endTurn();
            this.shadowSelf1.ward();
            this.shadowSelf1.damage = 8;
            expect(this.shadowSelf1.armor).toBe(1);
            expect(this.badPenny.armor).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.silvertooth, this.badPenny);
            expect(this.silvertooth.damage).toBe(1);
            expect(this.badPenny.hasToken('armor')).toBe(false);
            expect(this.badPenny.armorUsed).toBe(1);
            expect(this.badPenny.damage).toBe(0);
            expect(this.shadowSelf1.location).toBe('discard');
        });

        it('should be killed by transfered Poison effect', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.macisAsp, this.badPenny);
            expect(this.macisAsp.damage).toBe(0);
            expect(this.badPenny.damage).toBe(0);
            expect(this.macisAsp.location).toBe('play area');
            expect(this.badPenny.location).toBe('play area');
            expect(this.shadowSelf1.location).toBe('discard');
        });

        it('should be killed by transfered Poison from a flank creature effect', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.fightWith(this.spyyyder, this.badPenny);
            expect(this.spyyyder.damage).toBe(0);
            expect(this.badPenny.damage).toBe(0);
            expect(this.spyyyder.location).toBe('play area');
            expect(this.badPenny.location).toBe('play area');
            expect(this.shadowSelf1.location).toBe('discard');
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
            expect(this.shadowSelf1.damage).toBe(2);
            expect(this.shadowSelf2.damage).toBe(0);
        });

        it('should not be considered to be an enemy creature destroyed in a fight, if damage was redirected', function () {
            this.shadowSelf1.damage = 6;
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.hapsis, this.badPenny);
            expect(this.hapsis.damage).toBe(1);
            expect(this.hapsis.warded).toBe(true);
            expect(this.shadowSelf1.location).toBe('discard');
            expect(this.badPenny.location).toBe('play area');
        });
    });
});
