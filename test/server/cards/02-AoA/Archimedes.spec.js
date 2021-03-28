describe('Archimedes', function () {
    describe("Archimedes' gain ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['gub', 'archimedes', 'streke', 'krump'],
                    hand: ['collar-of-subordination', 'hand-of-dis', 'gateway-to-dis', 'shooler']
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['relentless-whispers']
                }
            });
        });

        it('should move destroyed neighbor to archive', function () {
            this.player1.play(this.handOfDis);
            this.player1.clickCard(this.streke);

            expect(this.streke.location).toBe('archives');
            expect(this.player1.archives).toContain(this.streke);
        });

        it('should move only immediate neighbors to archive on a board wipe', function () {
            this.player1.play(this.gatewayToDis);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.gub);
            this.player1.clickCard(this.gub);

            expect(this.streke.location).toBe('archives');
            expect(this.gub.location).toBe('archives');
            expect(this.krump.location).toBe('discard');
            expect(this.archimedes.location).toBe('discard');

            expect(this.player1.archives).toContain(this.streke);
            expect(this.player1.archives).toContain(this.gub);

            expect(this.player1.discard).toContain(this.archimedes);
            expect(this.player1.discard).toContain(this.krump);
        });

        it('should move only immediate neighbors to archive on a board wipe, even if Archimdes survives', function () {
            this.archimedes.ward();
            this.player1.play(this.gatewayToDis);

            // an interrupt
            this.player1.clickCard(this.gub);

            expect(this.archimedes.location).toBe('play area');

            expect(this.streke.location).toBe('archives');
            expect(this.gub.location).toBe('archives');
            expect(this.krump.location).toBe('discard');
        });

        it("should move controlled neighbor to opponent's archive", function () {
            this.player1.moveCard(this.gub, 'discard');
            expect(this.gub.location).toBe('discard');

            this.player1.playUpgrade(this.collarOfSubordination, this.lamindra);
            this.player1.clickPrompt('Left');
            this.player1.playCreature(this.shooler, true);
            this.player1.play(this.handOfDis);
            this.player1.clickCard(this.lamindra);

            expect(this.streke.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.archimedes.location).toBe('play area');
            expect(this.collarOfSubordination.location).toBe('discard');
            expect(this.lamindra.location).toBe('archives');

            expect(this.player2.archives).toContain(this.lamindra);
        });
    });

    describe("Archimedes' and Massive Damage", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lamindra'],
                    hand: ['whistling-darts', 'booby-trap']
                },
                player2: {
                    inPlay: [
                        'jargogle',
                        'tantadlin',
                        'helper-bot',
                        'archimedes',
                        'harland-mindlock',
                        'gub'
                    ]
                }
            });
        });

        it('should archive only immediate neighbors', function () {
            this.player1.play(this.whistlingDarts);
            this.player1.clickCard(this.helperBot);

            expect(this.jargogle.location).toBe('play area');
            expect(this.tantadlin.location).toBe('play area');
            expect(this.archimedes.location).toBe('play area');

            expect(this.gub.location).toBe('discard');

            expect(this.helperBot.location).toBe('archives');
            expect(this.harlandMindlock.location).toBe('archives');
        });

        it('should archive only immediate neighbors when archimedes dies', function () {
            this.player1.play(this.boobyTrap);
            this.player1.clickCard(this.archimedes);
            this.player1.clickCard(this.helperBot);

            expect(this.jargogle.location).toBe('play area');
            expect(this.tantadlin.location).toBe('play area');
            expect(this.gub.location).toBe('play area');

            expect(this.archimedes.location).toBe('discard');

            expect(this.helperBot.location).toBe('archives');
            expect(this.harlandMindlock.location).toBe('archives');
        });
    });
});
