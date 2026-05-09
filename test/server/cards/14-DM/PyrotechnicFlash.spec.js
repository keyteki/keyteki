describe('Pyrotechnic Flash', function () {
    describe("Pyrotechnic Flash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['pyrotechnic-flash'],
                    inPlay: ['dis-plant', 'logos-plant', 'untamed-plant']
                },
                player2: {
                    amber: 3,
                    inPlay: ['urchin', 'lamindra', 'mooncurser', 'troll', 'bumpsy']
                }
            });
        });

        it('destroys 0 creatures and does not steal', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.bumpsy);
            expect(this.urchin.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.mooncurser.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys 1 creature and does not steal', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.troll);
            expect(this.urchin.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys 2 creatures and steals 1', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.mooncurser.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys 3 creatures and steals 1', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.lamindra);
            expect(this.urchin.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('counts friendly creature kills toward the steal threshold', function () {
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.logosPlant);
            expect(this.disPlant.location).toBe('discard');
            expect(this.logosPlant.location).toBe('discard');
            expect(this.untamedPlant.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not count kills from a bonus damage icon toward the threshold', function () {
            this.pyrotechnicFlash.enhancements = ['damage'];
            this.player1.play(this.pyrotechnicFlash);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.troll);
            expect(this.urchin.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.mooncurser.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
