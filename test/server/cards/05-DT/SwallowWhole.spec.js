describe('Swallow Whole', function () {
    describe("Swallow Whole's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['swallow-whole'],
                    inPlay: ['senator-shrix', 'shooler']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('cannot be played when tide is not high', function () {
            this.player1.clickCard(this.swallowWhole);
            expect(this.player1).not.toHavePromptButton('Play this action');
        });

        describe('and tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should purge a creature with lower power and give the other creature +1 power tokens', function () {
                this.player1.play(this.swallowWhole);

                expect(this.player1).toBeAbleToSelect(this.gub);
                expect(this.player1).toBeAbleToSelect(this.senatorShrix);
                expect(this.player1).toBeAbleToSelect(this.shooler);
                expect(this.player1).not.toBeAbleToSelect(this.krump); // -- the highest power creature cannot be selected

                this.player1.clickCard(this.senatorShrix);

                expect(this.player1).not.toBeAbleToSelect(this.gub);
                expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                expect(this.player1).toBeAbleToSelect(this.shooler);
                expect(this.player1).toBeAbleToSelect(this.krump);

                this.player1.clickCard(this.krump);

                expect(this.senatorShrix.location).toBe('purged');
                expect(this.krump.powerCounters).toBe(4);
                expect(this.gub.powerCounters).toBe(0);
                expect(this.shooler.powerCounters).toBe(0);
            });

            describe('there are two creatures with equal highest power', function () {
                beforeEach(function () {
                    this.shooler.powerCounters = 1;
                });

                it('should purge a creature with lower power and give the other creature +1 power tokens', function () {
                    this.player1.play(this.swallowWhole);

                    expect(this.player1).toBeAbleToSelect(this.gub);
                    expect(this.player1).toBeAbleToSelect(this.senatorShrix);
                    expect(this.player1).toBeAbleToSelect(this.shooler);
                    expect(this.player1).toBeAbleToSelect(this.krump);

                    this.player1.clickCard(this.krump);

                    expect(this.player1).not.toBeAbleToSelect(this.gub);
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    expect(this.player1).toBeAbleToSelect(this.shooler);
                    expect(this.player1).not.toBeAbleToSelect(this.krump);

                    this.player1.clickCard(this.shooler);

                    expect(this.krump.location).toBe('purged');
                    expect(this.shooler.powerCounters).toBe(7);
                    expect(this.gub.powerCounters).toBe(0);
                    expect(this.senatorShrix.powerCounters).toBe(0);
                });
            });
        });
    });
});
