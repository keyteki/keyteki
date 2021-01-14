describe('B4-TH05', function () {
    describe('when tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina'],
                    hand: ['b4-th05']
                },
                player2: {
                    amber: 3,
                    inPlay: ['murkens']
                }
            });

            this.player1.playUpgrade(this.b4Th05, this.armsmasterMolina);
        });

        it('should not give any new keyword', function () {
            expect(this.player1.isTideNeutral()).toBe(true);
            expect(this.armsmasterMolina.getKeywordValue('skirmish')).toBe(0);
            expect(this.armsmasterMolina.getKeywordValue('elusive')).toBe(0);
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should gain skirmish keyword', function () {
                expect(this.player1.isTideHigh()).toBe(true);
                expect(this.armsmasterMolina.getKeywordValue('skirmish')).toBe(1);
                expect(this.armsmasterMolina.getKeywordValue('elusive')).toBe(0);
            });

            describe('when tide is low', function () {
                beforeEach(function () {
                    this.player1.lowerTide();
                });

                it('should gain elusive keyword', function () {
                    expect(this.player1.isTideLow()).toBe(true);
                    expect(this.armsmasterMolina.getKeywordValue('skirmish')).toBe(0);
                    expect(this.armsmasterMolina.getKeywordValue('elusive')).toBe(1);
                });
            });
        });
    });
});
