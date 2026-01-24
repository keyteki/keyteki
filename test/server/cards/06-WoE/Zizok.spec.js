describe('Zizok', function () {
    describe("Zizok's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'mars',
                    inPlay: ['zizok', 'blypyp', 'crim-torchtooth']
                },
                player2: {
                    inPlay: ['urchin', 'witch-of-the-eye', 'dust-pixie']
                }
            });

            this.crimTorchtooth.printedHouse = 'mars';
            this.crimTorchtooth.maverick = 'mars';
        });

        it('should ready when creature destroyed by its splash attack', function () {
            this.player1.fightWith(this.zizok, this.witchOfTheEye);
            expect(this.urchin.location).toBe('discard');
            expect(this.witchOfTheEye.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.zizok.location).toBe('play area');
            this.player1.clickCard(this.urchin); // 2 cards died from splash
            expect(this.zizok.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not ready when no creature destroyed by its splash attack', function () {
            this.player1.fightWith(this.zizok, this.dustPixie);
            expect(this.urchin.location).toBe('play area');
            expect(this.witchOfTheEye.location).toBe('play area');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.zizok.location).toBe('play area');
            expect(this.witchOfTheEye.damage).toBe(1);
            expect(this.zizok.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should not ready when creature destroyed by another creature's splash attack", function () {
            this.player1.reap(this.zizok);
            this.player1.fightWith(this.crimTorchtooth, this.witchOfTheEye);
            expect(this.urchin.location).toBe('discard');
            expect(this.witchOfTheEye.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.zizok.location).toBe('play area');
            expect(this.zizok.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
