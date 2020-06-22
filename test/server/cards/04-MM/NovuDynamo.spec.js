describe('novu-dynamo', function () {
    describe("Novu-Dynamo's constant ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['snufflegator', 'library-access'],
                    hand: ['eyegor', 'anger'],
                    inPlay: ['novu-dynamo'],
                    amber: 0
                },
                player2: {
                    inPlay: ['helper-bot']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
        });

        describe('and the ability is triggered', function () {
            it('selects a logos card from hand or archives', function () {
                expect(this.player1).toBeAbleToSelect(this.eyegor);
                expect(this.player1).toBeAbleToSelect(this.libraryAccess);
                expect(this.player1).toBeAbleToSelect(this.novuDynamo);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.anger);
            });

            describe('discard from hand', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.eyegor);
                });

                it('and gain amber', function () {
                    expect(this.eyegor.location).toBe('discard');
                    expect(this.novuDynamo.location).toBe('play area');
                    expect(this.player1.amber).toBe(1);
                });
            });

            describe('discard from archive', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.libraryAccess);
                });
                it('gives amber', function () {
                    expect(this.libraryAccess.location).toBe('discard');
                    expect(this.novuDynamo.location).toBe('play area');
                    expect(this.player1.amber).toBe(1);
                });
            });

            describe('destroy Novu Dynamo', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.novuDynamo);
                });

                it('should destroy Novu Dynamo end effect', function () {
                    expect(this.libraryAccess.location).toBe('archives');
                    expect(this.eyegor.location).toBe('hand');
                    expect(this.player1.amber).toBe(0);
                    expect(this.novuDynamo.location).toBe('discard');
                });
            });
        });
    });
});
