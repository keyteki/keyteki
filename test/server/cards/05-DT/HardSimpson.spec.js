describe("Hard Simpson's ability", function () {
    describe('when tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    inPlay: ['bulwark', 'hard-simpson', 'bulwark'],
                    hand: ['shield-of-justice', 'masterplan']
                },
                player2: {
                    amber: 3,
                    inPlay: ['murkens', 'shooler', 'mega-narp']
                }
            });

            this.player1.play(this.masterplan);
            this.player1.clickCard(this.shieldOfJustice);
            this.masterplan.ready();
        });

        it('should steal 1 amber when attacking', function () {
            this.player1.fightWith(this.hardSimpson, this.shooler);
            expect(this.hardSimpson.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber if destroyed', function () {
            this.player1.fightWith(this.hardSimpson, this.megaNarp);
            expect(this.hardSimpson.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber if damage prevented by armor', function () {
            this.player1.fightWith(this.hardSimpson, this.murkens);
            expect(this.hardSimpson.location).toBe('play area');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber if damage prevented by effect', function () {
            this.player1.useOmni(this.masterplan);
            this.player1.fightWith(this.hardSimpson, this.megaNarp);
            expect(this.hardSimpson.location).toBe('play area');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal 1 amber if warded', function () {
            this.hardSimpson.ward();
            this.player1.fightWith(this.hardSimpson, this.megaNarp);
            expect(this.hardSimpson.location).toBe('play area');
            expect(this.hardSimpson.warded).toBe(false);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should steal 1 amber when attacking', function () {
                this.player1.fightWith(this.hardSimpson, this.shooler);
                expect(this.hardSimpson.tokens.damage).toBe(1);
                expect(this.player1.amber).toBe(5);
                expect(this.player2.amber).toBe(2);
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('opponent should steal 1 amber', function () {
                this.player1.fightWith(this.hardSimpson, this.shooler);
                expect(this.hardSimpson.tokens.damage).toBe(1);
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(4);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
