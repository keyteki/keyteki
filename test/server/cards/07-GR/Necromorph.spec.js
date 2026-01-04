describe('Necromorph', function () {
    describe("Necromorph's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'culf-the-quiet', 'flamethrower']
                },
                player2: {
                    amber: 1,
                    inPlay: ['hunting-witch', 'necromorph', 'cpo-zytar', 'flaxia']
                }
            });
        });

        it('destroys the one non-staralliance neighbor instead', function () {
            this.player1.fightWith(this.troll, this.necromorph);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).isReadyToTakeAction();
            expect(this.necromorph.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(5);
        });

        it('heals instead of getting destroyed', function () {
            this.player1.useAction(this.flamethrower);
            this.player1.clickCard(this.necromorph);
            expect(this.necromorph.tokens.damage).toBe(1);
            this.player1.fightWith(this.troll, this.necromorph);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).isReadyToTakeAction();
            expect(this.necromorph.location).toBe('play area');
            expect(this.necromorph.tokens.damage).toBe(undefined);
        });

        it('destroys the chosen non-staralliance neighbor instead', function () {
            this.player1.fightWith(this.culfTheQuiet, this.cpoZytar);
            this.player1.fightWith(this.troll, this.necromorph);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
            expect(this.necromorph.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.flaxia.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(5);
        });

        it('gets destroyed with no non-staralliance neighbors', function () {
            this.player1.fightWith(this.culfTheQuiet, this.huntingWitch);
            this.player1.fightWith(this.troll, this.necromorph);
            expect(this.player1).isReadyToTakeAction();
            expect(this.necromorph.location).toBe('discard');
        });
    });
});
