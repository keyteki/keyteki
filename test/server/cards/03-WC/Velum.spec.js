describe('Velum', function () {
    describe("Velum's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['velum'],
                    hand: ['hyde', 'dextre', 'dextre', 'dextre', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['groggins']
                }
            });
        });

        it('Should archive 1 card when Hyde is not in play', function () {
            this.player1.reap(this.velum);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Velum');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.troll);

            expect(this.player1.archives.length).toBe(1);
            expect(this.troll.location).toBe('archives');
            expect(this.velum.location).toBe('play area');
        });

        it('Should archive 2 cards when Hyde is in play', function () {
            this.player1.playCreature(this.hyde);
            this.player1.reap(this.velum);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Velum');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);

            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.player1.archives.length).toBe(2);
            expect(this.troll.location).toBe('archives');
            expect(this.krump.location).toBe('archives');
            expect(this.velum.location).toBe('play area');
        });
    });

    describe("Velum's destroy ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['velum'],
                    hand: ['hyde', 'dextre', 'dextre', 'dextre', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['groggins']
                }
            });
        });

        it('Should destroy Velum since Hyde is in hand', function () {
            this.player1.fightWith(this.velum, this.groggins);

            expect(this.velum.location).toBe('discard');
            expect(this.hyde.location).toBe('hand');
        });

        it('Should destroy Velum since Hyde is in play', function () {
            this.player1.playCreature(this.hyde);
            this.player1.fightWith(this.velum, this.groggins);

            expect(this.velum.location).toBe('discard');
            expect(this.hyde.location).toBe('play area');
        });

        it('Should archive Velum and Hyde', function () {
            this.player1.moveCard(this.hyde, 'discard');
            expect(this.hyde.location).toBe('discard');

            this.player1.fightWith(this.velum, this.groggins);

            expect(this.velum.location).toBe('archives');
            expect(this.hyde.location).toBe('archives');
        });
    });
});
