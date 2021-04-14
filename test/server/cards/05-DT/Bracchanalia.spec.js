describe('Bracchanalia', function () {
    describe("Bracchanalia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['bracchanalia'],
                    inPlay: ['toad', 'flaxia', 'halacor', 'niffle-ape']
                },
                player2: {
                    amber: 2,
                    inPlay: ['gub', 'krump', 'troll', 'groggins']
                }
            });

            this.player1.play(this.bracchanalia);
        });

        it('should be able to select a creature to capture 1 amber', function () {
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.halacor);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
        });

        describe('and a creature is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.flaxia);
            });

            it('should capture 1 amber and place 4 amber on it after play', function () {
                expect(this.flaxia.amber).toBe(1);
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(1);
                expect(this.bracchanalia.amber).toBe(4);
            });

            describe('when controller has less than 4 creatures with amber', function () {
                beforeEach(function () {
                    this.toad.amber = 1;
                    this.flaxia.amber = 4;
                    this.halacor.amber = 3;
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                    this.player2.endTurn();
                    this.player1.clickPrompt('saurian');
                });

                it('should not gain the 4A', function () {
                    expect(this.bracchanalia.amber).toBe(4);
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                    this.player1.endTurn();
                });
            });

            describe('when opponent has less than 4 creatures with amber', function () {
                beforeEach(function () {
                    this.gub.amber = 1;
                    this.troll.amber = 4;
                    this.krump.amber = 3;
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                });

                it('should not gain the 4A', function () {
                    expect(this.bracchanalia.amber).toBe(4);
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                    this.player2.endTurn();
                });
            });

            describe('when controller has 4 creatures with amber', function () {
                beforeEach(function () {
                    this.toad.amber = 1;
                    this.flaxia.amber = 4;
                    this.halacor.amber = 3;
                    this.niffleApe.amber = 1;
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                    this.player2.endTurn();
                    this.player1.clickPrompt('saurian');
                });

                it('should gain the 4A', function () {
                    expect(this.bracchanalia.amber).toBe(0);
                    expect(this.player1.amber).toBe(5);
                    expect(this.player2.amber).toBe(1);
                    this.player1.endTurn();
                });
            });

            describe('when opponent has 4 creatures with amber', function () {
                beforeEach(function () {
                    this.gub.amber = 1;
                    this.troll.amber = 4;
                    this.groggins.amber = 3;
                    this.krump.amber = 3;
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                });

                it('should gain the 4A', function () {
                    expect(this.bracchanalia.amber).toBe(0);
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(5);
                    this.player2.endTurn();
                });
            });
        });
    });
});
