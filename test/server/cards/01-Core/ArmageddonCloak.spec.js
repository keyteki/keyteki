describe('Armageddon Cloak', function () {
    describe("Armageddon Cloak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['sequis'],
                    hand: ['armageddon-cloak', 'one-stood-against-many']
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should heal destroyed creature of damage and prevent destruction', function () {
            this.player1.playUpgrade(this.armageddonCloak, this.sequis);
            this.player1.fightWith(this.sequis, this.troll);

            expect(this.sequis.damage).toBe(0);
            expect(this.troll.damage).toBe(4);
            expect(this.sequis.location).toBe('play area');
            expect(this.sequis.moribund).toBe(false);
            expect(this.armageddonCloak.location).toBe('discard');
        });

        it('should interact with OSAM', function () {
            this.player1.playUpgrade(this.armageddonCloak, this.sequis);
            this.player1.play(this.oneStoodAgainstMany);
            expect(this.player1).toHavePrompt('One Stood Against Many');
            expect(this.player1).toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.sequis);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.nexus.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.dodger.location).toBe('play area');
            this.player1.clickCard(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.nexus.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.dodger.location).toBe('play area');
            this.player1.clickCard(this.dodger);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            expect(this.nexus.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.dodger.location).toBe('play area');
            expect(this.dodger.damage).toBe(4);
            expect(this.sequis.damage).toBe(3);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(4);
            expect(this.sequis.hasToken('damage')).toBe(false);
            expect(this.sequis.location).toBe('play area');
            expect(this.sequis.moribund).toBe(false);
            expect(this.armageddonCloak.location).toBe('discard');
        });
    });
});
