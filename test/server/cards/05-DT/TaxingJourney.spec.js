describe('Taxing Journey', function () {
    describe("Taxing Journey's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    inPlay: ['lamindra', 'angry-mob'],
                    hand: ['taxing-journey', 'barrister-joya', 'challe-the-safeguard']
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
                this.player1.play(this.taxingJourney);
            });

            it('should not capture any amber', function () {
                expect(this.player2.amber).toBe(0);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when opponent has no amber', function () {
            beforeEach(function () {
                this.player1.play(this.barristerJoya);
                this.player1.play(this.taxingJourney);
            });

            it('should not capture any amber', function () {
                expect(this.angryMob.amber).toBe(0);
                expect(this.barristerJoya.amber).toBe(0);
                expect(this.player2.amber).toBe(0);
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when opponent has 1 amber', function () {
            beforeEach(function () {
                this.player2.amber = 1;
                this.player1.play(this.barristerJoya);
                this.player1.play(this.taxingJourney);
            });

            describe('and a friendly creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.angryMob);
                });

                it('should capture 1 amber the selected creature', function () {
                    expect(this.angryMob.amber).toBe(1);
                    expect(this.player2.amber).toBe(0);
                });

                it('should not prompt to capture more ambers', function () {
                    expect(this.barristerJoya.amber).toBe(0);
                    this.expectReadyToTakeAction(this.player1);
                });
            });
        });

        describe('when opponent has 2 ambers', function () {
            beforeEach(function () {
                this.player2.amber = 2;
            });

            describe('and only 1 neighbor shares a house', function () {
                beforeEach(function () {
                    this.player1.play(this.barristerJoya);
                    this.player1.play(this.taxingJourney);
                });

                describe('and a friendly creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.angryMob);
                    });

                    it('should capture 1 amber the selected creature', function () {
                        expect(this.angryMob.amber).toBe(1);
                    });

                    it('should not prompt to capture more ambers', function () {
                        expect(this.barristerJoya.amber).toBe(1);
                        expect(this.player2.amber).toBe(0);
                        this.expectReadyToTakeAction(this.player1);
                    });
                });
            });

            describe('and 2 neighbors shares a house', function () {
                beforeEach(function () {
                    this.player1.play(this.barristerJoya);
                    this.player1.play(this.challeTheSafeguard, true, true);
                    this.player1.clickCard(this.angryMob);
                    this.player1.play(this.taxingJourney);
                });

                describe('and a friendly creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.angryMob);
                    });

                    it('should capture 1 amber on the selected creature', function () {
                        expect(this.angryMob.amber).toBe(1);
                        expect(this.player2.amber).toBe(1);
                    });

                    it('should prompt to capture amber on one of the neighbors', function () {
                        expect(this.player1).toBeAbleToSelect(this.barristerJoya);
                        expect(this.player1).toBeAbleToSelect(this.challeTheSafeguard);
                        this.player1.clickCard(this.barristerJoya);
                        expect(this.barristerJoya.amber).toBe(1);
                        expect(this.challeTheSafeguard.amber).toBe(0);
                        expect(this.player2.amber).toBe(0);
                        this.expectReadyToTakeAction(this.player1);
                    });
                });
            });
        });

        describe('when opponent has 3 ambers', function () {
            beforeEach(function () {
                this.player2.amber = 3;
            });

            describe('and only 1 neighbor shares a house', function () {
                beforeEach(function () {
                    this.player1.play(this.barristerJoya);
                    this.player1.play(this.taxingJourney);
                });

                describe('and a friendly creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.angryMob);
                    });

                    it('should capture 1 amber the selected creature', function () {
                        expect(this.angryMob.amber).toBe(1);
                    });

                    it('should not prompt to capture more ambers', function () {
                        expect(this.barristerJoya.amber).toBe(1);
                        expect(this.player2.amber).toBe(1);
                        this.expectReadyToTakeAction(this.player1);
                    });
                });
            });

            describe('and 2 neighbors shares a house', function () {
                beforeEach(function () {
                    this.player1.play(this.barristerJoya);
                    this.player1.play(this.challeTheSafeguard, true, true);
                    this.player1.clickCard(this.angryMob);
                    this.player1.play(this.taxingJourney);
                });

                it('should allow selecting friendly creatures only', function () {
                    expect(this.player1).toBeAbleToSelect(this.angryMob);
                    expect(this.player1).toBeAbleToSelect(this.barristerJoya);
                    expect(this.player1).toBeAbleToSelect(this.challeTheSafeguard);
                    expect(this.player1).not.toBeAbleToSelect(this.murkens);
                });

                describe('and a friendly creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.angryMob);
                    });

                    it('should capture 1 amber on the selected creature', function () {
                        expect(this.angryMob.amber).toBe(1);
                    });

                    it('should capture ambers on both neighbors', function () {
                        expect(this.barristerJoya.amber).toBe(1);
                        expect(this.challeTheSafeguard.amber).toBe(1);
                        expect(this.player2.amber).toBe(0);
                        this.expectReadyToTakeAction(this.player1);
                    });
                });
            });
        });
    });
});
