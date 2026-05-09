describe('Undagnathus Evil Twin', function () {
    describe("Undagnathus Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['grommid', 'bumpsy']
                },
                player2: {
                    inPlay: ['undagnathus-evil-twin', 'bulwark']
                }
            });
        });

        describe('while the tide is neutral', function () {
            it('should not double damage dealt to Undagnathus', function () {
                this.player1.fightWith(this.bumpsy, this.undagnathusEvilTwin);
                expect(this.bumpsy.location).toBe('discard');
                expect(this.undagnathusEvilTwin.damage).toBe(3);
            });
        });

        describe('while the tide is low', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should double damage dealt to Undagnathus', function () {
                this.player2.moveCard(this.bulwark, 'discard');
                this.player1.fightWith(this.bumpsy, this.undagnathusEvilTwin);
                expect(this.bumpsy.location).toBe('discard');
                expect(this.undagnathusEvilTwin.damage).toBe(10);
            });

            it('should double damage dealt to Undagnathus, after armor', function () {
                this.player1.fightWith(this.bumpsy, this.undagnathusEvilTwin);
                expect(this.bumpsy.location).toBe('discard');
                expect(this.undagnathusEvilTwin.damage).toBe(6);
            });
        });

        describe('while the tide is high', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not double damage dealt to Undagnathus', function () {
                this.player1.fightWith(this.bumpsy, this.undagnathusEvilTwin);
                expect(this.bumpsy.location).toBe('discard');
                expect(this.undagnathusEvilTwin.damage).toBe(3);
            });
        });
    });
});
