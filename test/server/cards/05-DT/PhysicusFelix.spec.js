describe('Physicus Felix', function () {
    describe("PhysicusFelix's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['dextre', 'archimedes'],
                    hand: ['physicus-felix']
                },
                player2: {
                    inPlay: ['bulwark', 'lamindra']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.play(this.physicusFelix);
            });

            it('should not prompt to exalt a creature', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.play(this.physicusFelix);
            });

            it('should not prompt to exalt a creature', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.play(this.physicusFelix);
            });

            it('should be optional to exalt a creature', function () {
                this.player1.clickPrompt('Done');
                expect(this.player1).isReadyToTakeAction();
                expect(this.bulwark.amber).toBe(0);
                expect(this.dextre.amber).toBe(0);
                expect(this.archimedes.amber).toBe(0);
                expect(this.bulwark.amber).toBe(0);
                expect(this.lamindra.amber).toBe(0);
            });

            it('should exalt a creature', function () {
                expect(this.player1).toBeAbleToSelect(this.physicusFelix);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.archimedes);
                expect(this.player1).toBeAbleToSelect(this.bulwark);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                this.player1.clickCard(this.bulwark);
                expect(this.physicusFelix.amber).toBe(0);
                expect(this.dextre.amber).toBe(0);
                expect(this.archimedes.amber).toBe(0);
                expect(this.bulwark.amber).toBe(1);
                expect(this.lamindra.amber).toBe(0);
            });
        });
    });

    describe("Physicus Felix's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['dextre', 'physicus-felix', 'archimedes']
                },
                player2: {
                    inPlay: ['bulwark', 'lamindra']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.fightWith(this.physicusFelix, this.bulwark);
            });

            it('should not prompt to exalt a creature', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.fightWith(this.physicusFelix, this.bulwark);
            });

            it('should not prompt to exalt a creature', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.fightWith(this.physicusFelix, this.bulwark);
            });

            it('should be optional to exalt a creature', function () {
                this.player1.clickPrompt('Done');
                expect(this.player1).isReadyToTakeAction();
                expect(this.bulwark.amber).toBe(0);
                expect(this.dextre.amber).toBe(0);
                expect(this.archimedes.amber).toBe(0);
                expect(this.bulwark.amber).toBe(0);
                expect(this.lamindra.amber).toBe(0);
            });

            it('should exalt a creature', function () {
                expect(this.player1).toBeAbleToSelect(this.physicusFelix);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.archimedes);
                expect(this.player1).toBeAbleToSelect(this.bulwark);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                this.player1.clickCard(this.bulwark);
                expect(this.physicusFelix.amber).toBe(0);
                expect(this.dextre.amber).toBe(0);
                expect(this.archimedes.amber).toBe(0);
                expect(this.bulwark.amber).toBe(1);
                expect(this.lamindra.amber).toBe(0);
            });
        });
    });
});
