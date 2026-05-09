describe('Peace Accord', function () {
    describe("Peace Accord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    inPlay: ['peace-accord', 'lieutenant-khrkhar', 'tactical-officer-moon'],
                    hand: ['hand-of-dis', 'pitlord']
                },
                player2: {
                    amber: 3,
                    inPlay: ['mighty-tiger', 'snufflegator', 'dust-pixie', 'briar-grubbling']
                }
            });
        });

        it('should cause a controller who fights to lose 4A and destroy itself', function () {
            this.player1.fightWith(this.lieutenantKhrkhar, this.dustPixie);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.peaceAccord.location).toBe('discard');
        });

        it('should cause a controller who fights to lose 4A and destroy itself, if creature is destroyed by assault', function () {
            this.player1.fightWith(this.tacticalOfficerMoon, this.dustPixie);
            expect(this.tacticalOfficerMoon.damage).toBe(0);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.peaceAccord.location).toBe('discard');
        });

        it('should cause a controller who fights to lose 4A and destroy itself, if attacker is destroyed by hazardous', function () {
            this.player1.fightWith(this.lieutenantKhrkhar, this.briarGrubbling);
            expect(this.briarGrubbling.damage).toBe(0);
            expect(this.lieutenantKhrkhar.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.peaceAccord.location).toBe('discard');
        });

        it('should cause an opponent who fights to lose 4A and destroy itself', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.mightyTiger, this.lieutenantKhrkhar);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.peaceAccord.location).toBe('discard');
        });
    });
});
