describe('Groupthink Tank', function () {
    describe("Groupthink Tank's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['groupthink-tank', 'yxilx-dominator', 'troll']
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

            expect(this.shooler.damage).toBe(4);
            expect(this.gub.damage).toBe(4);
            expect(this.skullion.damage).toBe(2);
        });
    });
});
