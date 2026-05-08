describe('Suspendamander', function () {
    describe("Suspendamander's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['suspendamander']
                },
                player2: {
                    hand: ['too-much-to-protect', 'the-circle-of-life', 'umbra', 'wild-wormhole'],
                    inPlay: ['lamindra']
                }
            });
        });

        it('should prevent opponent from playing actions of a house next turn', function () {
            this.player1.fightWith(this.suspendamander, this.lamindra);
            expect(this.player1).toHavePrompt('Suspendamander');
            expect(this.player1).toHavePromptButton('brobnar');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('mars');
            expect(this.player1).toHavePromptButton('sanctum');
            expect(this.player1).toHavePromptButton('shadows');
            expect(this.player1).toHavePromptButton('untamed');
            expect(this.player1).toHavePromptButton('staralliance');
            expect(this.player1).toHavePromptButton('saurian');
            expect(this.player1).toHavePromptButton('ekwidon');
            expect(this.player1).toHavePromptButton('geistoid');
            expect(this.player1).toHavePromptButton('skyborn');
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.tooMuchToProtect);
            expect(this.player2).toHavePrompt('Too Much To Protect');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
            expect(this.player2).not.toHavePromptButton('Play this action');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();

            // Works fine next turn.
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.tooMuchToProtect);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent opponent from other card types', function () {
            this.player1.fightWith(this.suspendamander, this.lamindra);
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.umbra);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent opponent from playing actions of a different house', function () {
            this.player1.fightWith(this.suspendamander, this.lamindra);
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.theCircleOfLife);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent opponent from using wild wormhole to play creatures of the chosen house', function () {
            this.player1.fightWith(this.suspendamander, this.lamindra);
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.moveCard(this.umbra, 'deck');
            this.player2.play(this.wildWormhole);
            this.player2.clickPrompt('Right');
            expect(this.umbra.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should  prevent opponent from using wild wormhole to play actions of the chosen house', function () {
            this.player1.fightWith(this.suspendamander, this.lamindra);
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.moveCard(this.tooMuchToProtect, 'deck');
            this.player2.play(this.wildWormhole);
            expect(this.tooMuchToProtect.location).toBe('deck');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'suspendamander']
                },
                player2: {
                    amber: 0,
                    inPlay: ['hunting-witch'],
                    hand: ['fogbank']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'dis');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.fightWith(this.suspendamander, this.huntingWitch);
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
            this.player2.clickCard(this.fogbank);
            expect(this.player2).not.toHavePrompt('Play this action');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
