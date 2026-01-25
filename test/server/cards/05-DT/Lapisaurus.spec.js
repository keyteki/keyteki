describe('Lapisaurus', function () {
    describe("Lapisaurus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: [],
                    inPlay: ['lapisaurus', 'consul-primus', 'rhetor-gallim', 'questor-jarta']
                },
                player2: {
                    amber: 1,
                    inPlay: ['mother', 'earthshaker', 'dust-pixie', 'daughter']
                }
            });
        });

        it('should not exalt lapisaurus when attacking', function () {
            expect(this.lapisaurus.amber).toBe(0);
            this.player1.fightWith(this.lapisaurus, this.dustPixie);
            this.player1.endTurn();
            expect(this.lapisaurus.amber).toBe(0);

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should not exalt friendly creature when attacking', function () {
            expect(this.rhetorGallim.amber).toBe(0);
            expect(this.lapisaurus.amber).toBe(0);
            this.player1.fightWith(this.rhetorGallim, this.dustPixie);
            this.player1.endTurn();

            expect(this.rhetorGallim.amber).toBe(0);
            expect(this.lapisaurus.amber).toBe(0);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should not exalt enemy creature when attacking other creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            expect(this.mother.amber).toBe(0);
            expect(this.lapisaurus.amber).toBe(0);

            this.player2.fightWith(this.mother, this.rhetorGallim);
            this.player2.endTurn();

            expect(this.lapisaurus.amber).toBe(0);
            expect(this.mother.amber).toBe(0);
            expect(this.rhetorGallim.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        describe('should exalt', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
            });

            it('enemy creatures attacking it', function () {
                expect(this.mother.amber).toBe(0);
                expect(this.lapisaurus.amber).toBe(0);

                this.player2.fightWith(this.mother, this.lapisaurus);
                this.player2.endTurn();

                expect(this.lapisaurus.location).toBe('play area');
                expect(this.mother.location).toBe('play area');
                expect(this.mother.damage).toBe(4);

                expect(this.lapisaurus.amber).toBe(0);
                expect(this.mother.amber).toBe(1);
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(1);
            });

            it('enemy creatures attacking it and gain amber if they die', function () {
                expect(this.daughter.amber).toBe(0);
                expect(this.lapisaurus.amber).toBe(0);

                this.player2.fightWith(this.daughter, this.lapisaurus);
                this.player2.endTurn();

                expect(this.lapisaurus.location).toBe('play area');
                expect(this.daughter.location).toBe('discard');

                expect(this.lapisaurus.amber).toBe(0);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(1);
            });

            it('enemy creatures attacking it, but not when attacking other creatures right after', function () {
                expect(this.mother.amber).toBe(0);
                expect(this.lapisaurus.amber).toBe(0);

                this.player2.fightWith(this.mother, this.lapisaurus);
                expect(this.mother.amber).toBe(1);

                this.mother.ready();

                this.player2.fightWith(this.mother, this.questorJarta);
                expect(this.mother.amber).toBe(1);
            });
        });
    });
});
