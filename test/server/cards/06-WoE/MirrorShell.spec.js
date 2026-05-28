describe('Mirror Shell', function () {
    describe("Mirror Shell's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    token: 'rebel',
                    inPlay: ['questor-jarta', 'first-officer-frane', 'rebel:collector-boren'],
                    hand: ['mirror-shell', 'legionary-trainer', 'temporal-purge']
                },
                player2: {
                    amber: 4,
                    token: 'grumpus',
                    inPlay: ['grumpus:batdrone', 'bumpsy']
                }
            });
        });

        it('makes a token on play', function () {
            this.player1.playUpgrade(this.mirrorShell, this.questorJarta);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
        });

        it('turns tokens into copy of a creature', function () {
            this.player1.playUpgrade(this.mirrorShell, this.firstOfficerFrane);
            this.player1.clickPrompt('Right');

            // Reaping with First Officer Frane triggers Mirror Shell to copy it
            // to our token creatures.
            this.player1.reap(this.firstOfficerFrane);
            this.player1.clickPrompt('First Officer Frane');

            // Frane also has its own reap effect for a friendly creature to
            // capture 1A.
            this.player1.clickCard(this.questorJarta);
            expect(this.questorJarta.amber).toBe(1);
            expect(this.player2.amber).toBe(3);

            // Reaping with the Rebel, which is now a copy of Frane.
            this.player1.reap(this.rebel);
            expect(this.player1).toHavePrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);

            // The reap effect triggered will be the Frane effect (capture), not
            // Rebel’s effect (damage).
            expect(this.questorJarta.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.questorJarta.tokens.damage).toBe(undefined);

            // No more effects to resolve.
            expect(this.player1).isReadyToTakeAction();
        });

        it('the copying goes away if the creatures un-tokenize', function () {
            this.player1.playUpgrade(this.mirrorShell, this.firstOfficerFrane);
            this.player1.clickPrompt('Right');

            // Mirror Shell goes off (as well as Frane’s After Reap: effect to
            // capture.) Our Rebel is now a First Officer Frane.
            this.player1.reap(this.firstOfficerFrane);
            this.player1.clickPrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);
            expect(this.questorJarta.amber).toBe(1);
            expect(this.player2.amber).toBe(3);

            // Temporal Purge to flip our tokens, so the Rebel goes to being a
            // Collector Boren and should no longer be copying Frane.
            this.player1.play(this.temporalPurge);
            expect(this.rebel.name).toBe('Collector Boren');

            this.player1.reap(this.rebel);

            // Collector Boren doesn’t have any Reap effects, so we should be
            // back to the main loop without any effects to resolve.
            expect(this.player1).isReadyToTakeAction();
        });

        it('works in a non staralliance house', function () {
            this.player1.playUpgrade(this.mirrorShell, this.questorJarta);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            this.player1.reap(this.questorJarta);
            this.player1.clickPrompt('Questor Jarta');
            this.player1.clickCard(this.questorJarta);
            this.player1.reap(this.rebel);
            this.player1.clickCard(this.rebel);
            expect(this.player1.amber).toBe(5);

            this.player1.playCreature(this.legionaryTrainer);
            this.player1.clickPrompt('Right');
            let rebel2 = this.player1.player.creaturesInPlay[5];
            this.player1.reap(rebel2);
            this.player1.clickCard(rebel2);
            expect(this.player1.amber).toBe(7);
        });

        it('does not expose the underlying card when copying onto a token', function () {
            // If Mirror Shell's token-copying ability is working correctly, the Grunt token should become a copy of Frane while retaining its original identity.
            this.player1.playUpgrade(this.mirrorShell, this.firstOfficerFrane);
            this.player1.clickPrompt('Right');
            this.player1.reap(this.firstOfficerFrane);
            this.player1.clickPrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);

            expect(this.rebel.getShortSummary().id).toBe('rebel');
            expect(this.rebel.getShortSummary().name).toBe('Rebel');
            this.player1.reap(this.rebel);
            this.player1.clickCard(this.rebel);
            expect(this.rebel.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Mirror Shell on a token creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    token: 'rebel',
                    inPlay: ['questor-jarta', 'first-officer-frane', 'rebel:collector-boren'],
                    hand: ['mirror-shell', 'mirror-shell', 'stunner']
                },
                player2: {
                    amber: 4,
                    token: 'grumpus',
                    inPlay: ['grumpus:batdrone', 'bumpsy']
                }
            });

            this.mirrorShell1 = this.player1.player.hand[0];
            this.mirrorShell2 = this.player1.player.hand[1];
        });

        it('does not infinite loop when reaping a token with Mirror Shell', function () {
            // Attach Mirror Shell to Frane and reap with Frane so the
            // Rebel token becomes a copy of Frane
            this.player1.playUpgrade(this.mirrorShell1, this.firstOfficerFrane);
            this.player1.clickPrompt('Right');
            this.player1.reap(this.firstOfficerFrane);
            this.player1.clickPrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);

            expect(this.rebel.name).toBe('First Officer Frane');
            expect(this.questorJarta.amber).toBe(1);

            // Attach a second Mirror Shell to Rebel
            this.player1.playUpgrade(this.mirrorShell2, this.rebel);
            this.player1.clickPrompt('Right');

            // Reaping the Rebel triggers Frane's printed reap (capture)
            // and Mirror Shell's reap (copy onto friendly tokens) without infinite loop.
            this.player1.reap(this.rebel);
            this.player1.clickPrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);

            expect(this.questorJarta.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('handles two Mirror Shells on the same token creature without infinite loop', function () {
            // Attach two Mirror Shells to the Rebel token.
            this.player1.playUpgrade(this.mirrorShell1, this.rebel);
            this.player1.clickPrompt('Right');
            this.player1.playUpgrade(this.mirrorShell2, this.rebel);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');

            // Reaping the host token with two Mirror Shells attached fires
            // both gained after-reap abilities plus Rebel's printed reap.
            // The copy effect excludes the source token, so there's no
            // infinite loop.
            this.player1.reap(this.rebel);
            this.player1.clickPrompt('Mirror Shell');
            this.player1.clickPrompt('Mirror Shell');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not copy upgrade-granted abilities to tokens', function () {
            this.player1.playUpgrade(this.stunner, this.firstOfficerFrane);
            this.player1.playUpgrade(this.mirrorShell1, this.firstOfficerFrane);
            this.player1.clickPrompt('Right');

            // Reap with Frane: Frane's capture, Stunner's stun,
            // and Mirror Shell's copy all trigger.
            this.player1.reap(this.firstOfficerFrane);
            this.player1.clickPrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);
            this.player1.clickPrompt('Stunner');
            this.player1.clickPrompt('Done');
            // Mirror Shell's copy auto-resolves

            expect(this.rebel.name).toBe('First Officer Frane');

            // Reap with the Rebel - only Frane's printed
            // reap should trigger
            this.player1.reap(this.rebel);
            expect(this.player1).toHavePrompt('First Officer Frane');
            this.player1.clickCard(this.questorJarta);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
