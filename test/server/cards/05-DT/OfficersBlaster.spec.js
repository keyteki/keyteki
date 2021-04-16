describe('Officers Blaster', function () {
    describe('ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: [
                        'officer-s-blaster',
                        'quintrino-flux',
                        'chief-engineer-walls',
                        'dew-faerie',
                        'helmsman-spears'
                    ],
                    inPlay: ['dust-pixie', 'stealthster', 'fanghouse']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should increase power while on a creature', function () {
            expect(this.stealthster.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            expect(this.stealthster.power).toBe(5);
            this.player1.endTurn();
        });

        it('should go to discard when there are no other creatures', function () {
            this.player1.moveCard(this.fanghouse, 'discard');
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf
            this.player1.endTurn();
            expect(this.officerSBlaster.location).toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        it('should go to discard when there is no creature on the right, but is one on the left', function () {
            this.player1.moveCard(this.fanghouse, 'discard');
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf

            this.player1.endTurn();
            expect(this.officerSBlaster.location).toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        it('should go to creature on the right when destroyed, when a left and right neighor exist', function () {
            expect(this.fanghouse.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf
            this.player1.clickCard(this.fanghouse); // select to take blaster

            this.player1.endTurn();
            expect(this.fanghouse.location).toBe('play area');
            expect(this.fanghouse.power).toBe(5);
            expect(this.officerSBlaster.location).not.toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        it('should go to creature on right when destroyed when only a right neighor exists', function () {
            this.player1.moveCard(this.dustPixie, 'discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.fanghouse.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            expect(this.stealthster.upgrades).toContain(this.officerSBlaster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.fanghouse);

            this.player1.endTurn();
            expect(this.stealthster.upgrades).not.toContain(this.officerSBlaster);
            expect(this.fanghouse.upgrades).toContain(this.officerSBlaster);
            expect(this.fanghouse.location).toBe('play area');
            expect(this.fanghouse.power).toBe(5);
            expect(this.officerSBlaster.location).not.toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });

        it('should go to creature on the right when there are more creatures on both sides of creature', function () {
            this.player1.play(this.helmsmanSpears, true);
            this.player1.play(this.chiefEngineerWalls, false);

            expect(this.fanghouse.power).toBe(3);
            this.player1.playUpgrade(this.officerSBlaster, this.stealthster);
            this.player1.play(this.quintrinoFlux);
            this.player1.clickCard(this.stealthster); // destroy for qf
            this.player1.clickCard(this.krump); // destroy for qf
            this.player1.clickCard(this.fanghouse); // select to take blaster

            this.player1.endTurn();
            expect(this.fanghouse.location).toBe('play area');
            expect(this.fanghouse.power).toBe(5);
            expect(this.officerSBlaster.location).not.toBe('discard');
            expect(this.stealthster.location).toBe('discard');
        });
    });
});
