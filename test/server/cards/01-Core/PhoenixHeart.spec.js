describe('Phoenix Heart', function () {
    describe("Phoenix Heart's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['phoenix-heart'],
                    inPlay: ['bumpsy']
                },
                player2: {
                    hand: ['wail-of-the-damned'],
                    inPlay: ['ember-imp', 'lilithal', 'bonesaw', 'batdrone', 'shadow-self']
                }
            });
        });

        it('should return attached creature to hand and deal 3 damage to all creatures when destroyed', function () {
            this.player1.playUpgrade(this.phoenixHeart, this.bumpsy);
            this.player1.fightWith(this.bumpsy, this.bonesaw);
            expect(this.bumpsy.location).toBe('hand');
            expect(this.emberImp.location).toBe('discard');
            expect(this.lilithal.location).toBe('play area');
            expect(this.bonesaw.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.shadowSelf.location).toBe('play area');
            expect(this.lilithal.damage).toBe(3);
            expect(this.batdrone.damage).toBe(0);
            expect(this.shadowSelf.damage).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return creature to hand before dealing damage', function () {
            this.player1.playUpgrade(this.phoenixHeart, this.shadowSelf);
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            this.player2.play(this.wailOfTheDamned);
            this.player2.clickCard(this.shadowSelf);
            expect(this.bumpsy.location).toBe('play area');
            expect(this.emberImp.location).toBe('discard');
            expect(this.lilithal.location).toBe('play area');
            expect(this.bonesaw.location).toBe('play area');
            expect(this.batdrone.location).toBe('discard'); // Shadow Self has already returned to hand and does not protect Batdrone
            expect(this.shadowSelf.location).toBe('hand');
            expect(this.bumpsy.damage).toBe(3);
            expect(this.lilithal.damage).toBe(3);
            expect(this.bonesaw.damage).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
