describe('Befuddle', function () {
    describe("Befuddle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 4,
                    inPlay: ['yanthi-ghostfin', 'earthshaker'],
                    hand: ['befuddle']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'mother', 'subject-kirby', 'sandhopper'],
                    hand: [
                        'helper-bot',
                        'dimension-door',
                        'sensor-chief-garcia',
                        'red-alert',
                        'disruption-field'
                    ]
                }
            });
        });

        it('should block opponent from playing cards of other house', function () {
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.helperBot);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.dimensionDoor);
            expect(this.player2).not.toHavePromptButton('Play this action');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Discard this card');
        });

        it('should not block opponent from using cards of other house', function () {
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.reap(this.batdrone);
        });

        it('should not block opponent from playing cards of same house', function () {
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.helperBot);
            this.player2.play(this.dimensionDoor);
        });

        it('should block opponent from playing cards of other houses due to effect', function () {
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.subjectKirby);
            expect(this.player2).not.toBeAbleToSelect(this.helperBot);
        });

        it('should block opponent from playing cards with house enhancements', function () {
            this.sensorChiefGarcia.enhancements = ['logos'];
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.clickCard(this.sensorChiefGarcia);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            expect(this.player2).toHavePromptButton('Discard this card');
            this.player2.clickPrompt('Cancel');
        });

        it('should not prevent playing cards of that house off house', function () {
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.sandhopper);
            this.player2.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('hand');
            this.player2.clickCard(this.batdrone);
            this.player2.clickPrompt('Right');
            expect(this.batdrone.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'unfathomable',
                    hand: ['befuddle'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 0,
                    inPlay: [],
                    hand: ['fogbank']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'unfathomable');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.befuddle);
            this.player1.clickPrompt('sanctum');
            this.player1.endTurn();
            this.player1.clickPrompt('unfathomable');
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
