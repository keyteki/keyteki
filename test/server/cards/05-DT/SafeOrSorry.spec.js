describe('Safe or Sorry', function () {
    describe("Safe or Sorry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['safe-or-sorry'],
                    inPlay: ['hookmaster', 'fidgit', 'lamindra']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'alaka']
                }
            });

            this.troll.amber = 4;
            this.player1.play(this.safeOrSorry);
        });

        it('should prompt to archive or deal damage', function () {
            expect(this.player1).toHavePromptButton('Archive friendly creatures');
            expect(this.player1).toHavePromptButton('Deal damage');
        });

        describe('archive is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Archive friendly creatures');
            });

            it('should be able to select friendly creature', function () {
                expect(this.player1).toBeAbleToSelect(this.fidgit);
                expect(this.player1).toBeAbleToSelect(this.hookmaster);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.alaka);
            });

            it('should be able to archive no creatures', function () {
                this.player1.clickPrompt('Done');
                expect(this.fidgit.location).toBe('play area');
                expect(this.hookmaster.location).toBe('play area');
                expect(this.lamindra.location).toBe('play area');
                expect(this.safeOrSorry.location).toBe('discard');
                this.player1.endTurn();
            });

            describe('friendly creatures are selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.hookmaster);
                    this.player1.clickCard(this.lamindra);
                    this.player1.clickPrompt('Done');
                });

                it('should be archived', function () {
                    expect(this.fidgit.location).toBe('play area');
                    expect(this.hookmaster.location).toBe('archives');
                    expect(this.lamindra.location).toBe('archives');
                    expect(this.safeOrSorry.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });

        describe('deal damage is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Deal damage');
            });

            it('should be able to select any creature', function () {
                expect(this.player1).toBeAbleToSelect(this.fidgit);
                expect(this.player1).toBeAbleToSelect(this.hookmaster);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.alaka);
            });

            describe('a creature with amber is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.troll);
                });

                it('should deal damage equal to amber on that creature', function () {
                    expect(this.troll.damage).toBe(4);
                    this.player1.endTurn();
                });
            });

            describe('a creature without amber is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.troll);
                });

                it('should deal no damage', function () {
                    expect(this.alaka.damage).toBe(0);
                    this.player1.endTurn();
                });
            });
        });
    });
});
