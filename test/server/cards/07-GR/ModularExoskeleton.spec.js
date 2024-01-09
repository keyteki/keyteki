describe('Modular Exoskeleton', function () {
    describe('Modular Exoskeleton', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['modular-exoskeleton'],
                    inPlay: ['cpo-zytar']
                },
                player2: {
                    inPlay: ['kelifi-dragon']
                }
            });
            this.player1.playUpgrade(this.modularExoskeleton, this.cpoZytar);
        });

        it('gives +4 power', function () {
            expect(this.cpoZytar.power).toBe(8);
        });

        it('can return to hand at start of turn', function () {
            this.player1.fightWith(this.cpoZytar, this.kelifiDragon);
            expect(this.modularExoskeleton.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1).toBeAbleToSelect(this.modularExoskeleton);
            this.player1.clickCard(this.modularExoskeleton);
            expect(this.modularExoskeleton.location).toBe('hand');
            this.player1.clickPrompt('staralliance');
        });

        it('can not return to hand at start of turn', function () {
            this.player1.fightWith(this.cpoZytar, this.kelifiDragon);
            expect(this.modularExoskeleton.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.modularExoskeleton.location).toBe('discard');
            this.player1.clickPrompt('staralliance');
        });
    });
});
