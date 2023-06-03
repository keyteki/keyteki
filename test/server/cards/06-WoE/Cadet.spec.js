describe('Cadet', function () {
    describe("Cadet's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: [
                        'doctor-driscoll',
                        'armsmaster-molina',
                        'cadet:keyfrog',
                        'crash-muldoon',
                        'lieutenant-khrkhar'
                    ],
                    token: 'cadet'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gravelguts', 'krump', 'ogopogo']
                }
            });
        });

        it('should have no prompt and no effect if has no neighbors', function () {
            this.player1.fightWith(this.doctorDriscoll, this.ogopogo);
            this.player1.fightWith(this.armsmasterMolina, this.krump);
            this.player1.fightWith(this.crashMuldoon, this.krump);
            this.player1.fightWith(this.lieutenantKhrkhar, this.ogopogo);

            expect(this.armsmasterMolina.location).toBe('discard');
            expect(this.crashMuldoon.location).toBe('discard');

            this.player1.fightWith(this.cadet, this.gravelguts);

            expect(this.cadet.location).toBe('discard');

            this.player1.endTurn();
        });

        it('should ready its one neighbor if it has one', function () {
            this.player1.fightWith(this.armsmasterMolina, this.krump);
            this.player1.fightWith(this.crashMuldoon, this.krump);
            this.player1.reap(this.lieutenantKhrkhar);

            expect(this.crashMuldoon.location).toBe('discard');
            expect(this.armsmasterMolina.location).toBe('discard');
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);

            this.player1.fightWith(this.cadet, this.gravelguts);
            this.player1.clickCard(this.lieutenantKhrkhar);

            expect(this.lieutenantKhrkhar.location).toBe('play area');
            expect(this.cadet.location).toBe('discard');
            expect(this.lieutenantKhrkhar.exhausted).toBe(false);

            this.player1.reap(this.lieutenantKhrkhar);

            this.player1.endTurn();
        });

        it('it should ready the largest neighbor', function () {
            this.player1.reap(this.armsmasterMolina);
            this.player1.reap(this.crashMuldoon);
            this.player1.reap(this.lieutenantKhrkhar);

            expect(this.armsmasterMolina.exhausted).toBe(true);
            expect(this.crashMuldoon.exhausted).toBe(true);
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);

            this.player1.fightWith(this.cadet, this.gravelguts);
            expect(this.player1).not.toBeAbleToSelect(this.crashMuldoon);
            this.player1.clickCard(this.armsmasterMolina);

            expect(this.cadet.location).toBe('discard');
            expect(this.armsmasterMolina.exhausted).toBe(false);
            expect(this.crashMuldoon.exhausted).toBe(true);
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);

            this.player1.reap(this.armsmasterMolina);

            this.player1.endTurn();
        });

        it('it should let player choose when there is a tie', function () {
            this.player1.fightWith(this.armsmasterMolina, this.krump);
            this.player1.reap(this.crashMuldoon);
            this.player1.reap(this.doctorDriscoll);
            this.player1.reap(this.lieutenantKhrkhar);

            expect(this.armsmasterMolina.location).toBe('discard');
            expect(this.doctorDriscoll.exhausted).toBe(true);
            expect(this.crashMuldoon.exhausted).toBe(true);
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);

            this.player1.fightWith(this.cadet, this.gravelguts);
            expect(this.player1).toBeAbleToSelect(this.crashMuldoon);
            expect(this.player1).toBeAbleToSelect(this.doctorDriscoll);
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.crashMuldoon);

            expect(this.cadet.location).toBe('discard');
            expect(this.crashMuldoon.exhausted).toBe(false);
            expect(this.doctorDriscoll.exhausted).toBe(true);
            expect(this.lieutenantKhrkhar.exhausted).toBe(true);

            this.player1.reap(this.crashMuldoon);

            this.player1.endTurn();
        });
    });
});
