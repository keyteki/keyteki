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
    });
});
