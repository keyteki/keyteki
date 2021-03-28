describe('Might Makes Right', function () {
    describe("Might Makes Right's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: [
                        'groke',
                        'hebe-the-huge',
                        'ganger-chieftain',
                        'bellowing-patrizate',
                        'king-of-the-crag'
                    ],
                    hand: ['might-makes-right']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should award 1 amber when played, even if player elects not to sacrifice', function () {
            this.player1.play(this.mightMakesRight);
            expect(this.player1.player.amber).toBe(3);
        });

        it('should allow key to be forged at zero cost if creatures of total power of 25 or more are sacrificed', function () {
            this.player1.play(this.mightMakesRight);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.bellowingPatrizate);
            this.player1.clickCard(this.kingOfTheCrag);
            this.player1.clickPrompt('Done');
            this.player1.forgeKey('Red');
            expect(this.groke.location).toBe('discard');
            expect(this.hebeTheHuge.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.bellowingPatrizate.location).toBe('discard');
            expect(this.kingOfTheCrag.location).toBe('discard');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.amber).toBe(3);
        });

        it('should not allow key to be forged if creatures under total power of 25 are sacrificed', function () {
            this.player1.play(this.mightMakesRight);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickPrompt('Done');
            expect(this.groke.location).toBe('play area');
            expect(this.hebeTheHuge.location).toBe('play area');
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.amber).toBe(3);
        });

        it('should ensure that sacrificed creatures are in the discard pile under normal conditions', function () {
            this.player1.play(this.mightMakesRight);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.bellowingPatrizate);
            this.player1.clickCard(this.kingOfTheCrag);
            this.player1.clickPrompt('Done');

            expect(this.groke.location).toBe('discard');
            expect(this.hebeTheHuge.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.bellowingPatrizate.location).toBe('discard');
            expect(this.kingOfTheCrag.location).toBe('discard');
        });
    });

    describe("Might Makes Right's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    inPlay: ['panpaca-anga', 'knoxx', 'lion-bautrem', 'marmo-swarm'],
                    hand: ['might-makes-right']
                }
            });
        });

        it('should allow key to be forged at zero cost if creatures of total power of 25 or more (including modifiers) are sacrificed', function () {
            this.player1.play(this.mightMakesRight);
            this.player1.clickCard(this.knoxx);
            this.player1.clickCard(this.lionBautrem);
            this.player1.clickCard(this.marmoSwarm);
            this.player1.clickPrompt('Done');
            expect(this.knoxx.location).toBe('discard');
            expect(this.lionBautrem.location).toBe('discard');
            expect(this.marmoSwarm.location).toBe('discard');
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.player.amber).toBe(2);
        });
    });

    describe("Might Makes Right's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: [
                        'groke',
                        'hebe-the-huge',
                        'archimedes',
                        'ganger-chieftain',
                        'bellowing-patrizate',
                        'king-of-the-crag'
                    ],
                    hand: ['might-makes-right']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should ensure that sacrificed creatures end up in the Archive (due to Archimedes)', function () {
            this.player1.play(this.mightMakesRight);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.bellowingPatrizate);
            this.player1.clickCard(this.kingOfTheCrag);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.hebeTheHuge);
            this.player1.clickCard(this.groke);
            expect(this.groke.location).toBe('discard');
            expect(this.hebeTheHuge.location).toBe('archives');
            expect(this.gangerChieftain.location).toBe('archives');
            expect(this.bellowingPatrizate.location).toBe('discard');
            expect(this.kingOfTheCrag.location).toBe('discard');
        });
    });

    describe("Might Makes Right's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 2,
                    inPlay: ['groke', 'hebe-the-huge'],
                    hand: ['might-makes-right']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it("should simply award one amber if there's insufficient creatures on the board", function () {
            this.player1.play(this.mightMakesRight);
            expect(this.player1.player.amber).toBe(3);
        });
    });
});
