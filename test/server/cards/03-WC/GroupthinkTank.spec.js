describe('Groupthink Tank', function () {
    describe("Groupthink Tank's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['groupthink-tank', 'yxilx-dominator', 'troll'],
                    hand: ['experimental-therapy']
                },
                player2: {
                    amber: 3,
                    inPlay: ['shooler', 'gub', 'skullion', 'zorg', 'archimedes']
                }
            });
        });

        it('deal damage to all creatures with at least one neighbor sharing the same house', function () {
            this.player1.useAction(this.groupthinkTank);

            expect(this.groupthinkTank.hasToken('damage')).toBe(false);
            expect(this.zorg.hasToken('damage')).toBe(false);
            expect(this.archimedes.hasToken('damage')).toBe(false);

            expect(this.shooler.tokens.damage).toBe(4);
            expect(this.gub.tokens.damage).toBe(4);
            expect(this.skullion.tokens.damage).toBe(2);
        });

        it('should be affected by experimental therapy', function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.yxilxDominator);
            this.player1.useAction(this.groupthinkTank);

            expect(this.groupthinkTank.tokens.damage).toBe(1);
            expect(this.yxilxDominator.tokens.damage).toBe(3);
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.shooler.tokens.damage).toBe(4);
            expect(this.gub.tokens.damage).toBe(4);
            expect(this.skullion.tokens.damage).toBe(2);
        });
    });
});
