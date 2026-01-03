describe('Harmonic Ritual', function () {
    describe("Harmonic Ritual's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    inPlay: ['lamindra', 'angry-mob'],
                    hand: ['harmonic-ritual', 'barrister-joya', 'challe-the-safeguard', 'bulwark']
                },
                player2: {
                    inPlay: ['murkens']
                }
            });
        });

        describe('when there are not creatures in play', function () {
            beforeEach(function () {
                this.player1.moveCard(this.lamindra, 'discard');
                this.player1.moveCard(this.angryMob, 'discard');
                this.player1.play(this.harmonicRitual);
            });

            it('should not gain any amber', function () {
                expect(this.player1.amber).toBe(2);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.bulwark);
                this.player1.play(this.barristerJoya);
                this.player1.play(this.challeTheSafeguard, true, true);
                this.player1.clickCard(this.angryMob);
                this.player1.play(this.harmonicRitual);
            });

            it('should allow selecting friendly creatures only', function () {
                expect(this.player1).toBeAbleToSelect(this.angryMob);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.barristerJoya);
                expect(this.player1).toBeAbleToSelect(this.bulwark);
                expect(this.player1).toBeAbleToSelect(this.challeTheSafeguard);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
            });

            describe('when the selected creature has no left neighbor', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.lamindra);
                });

                it('should not gain any amber', function () {
                    expect(this.player1.amber).toBe(2);
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe("when the selected creature's left neighbor does not share a house", function () {
                beforeEach(function () {
                    this.player1.clickCard(this.challeTheSafeguard);
                });

                it('should not gain any amber', function () {
                    expect(this.player1.amber).toBe(2);
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe("when the selected creature's left neighbor shares a house", function () {
                beforeEach(function () {
                    this.player1.clickCard(this.angryMob);
                });

                it('should gain 1 amber', function () {
                    expect(this.player1.amber).toBe(3);
                    this.expectReadyToTakeAction(this.player1);
                });
            });

            describe('when the selected creature shares a house with its two left neighbors', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.barristerJoya);
                });

                it('should gain 2 ambers', function () {
                    expect(this.player1.amber).toBe(5);
                    this.expectReadyToTakeAction(this.player1);
                });
            });
        });
    });
});
