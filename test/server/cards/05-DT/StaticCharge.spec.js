describe('Static Charge', function () {
    describe("Static Charge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['static-charge']
                },
                player2: {
                    inPlay: ['troll', 'bad-penny', 'headhunter', 'eyegor']
                }
            });
            this.player1.playUpgrade(this.staticCharge, this.badPenny);
        });

        describe('on creatures controllers turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('2 damage done to neighbors', function () {
                expect(this.troll.damage).toBe(2);
                expect(this.badPenny.damage).toBe(0);
                expect(this.headhunter.damage).toBe(2);
                expect(this.eyegor.damage).toBe(0);
            });

            describe('on creatures controllers opponents turn', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();
                });

                it('0 damage done', function () {
                    expect(this.troll.damage).toBe(2);
                    expect(this.badPenny.damage).toBe(0);
                    expect(this.headhunter.damage).toBe(2);
                    expect(this.eyegor.damage).toBe(0);
                });
            });
        });
    });

    describe('Static Charge and Shoulder Id', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    hand: ['static-charge']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'shoulder-id', 'eyegor']
                }
            });
            this.player1.playUpgrade(this.staticCharge, this.shoulderId);
        });

        describe('on creatures controllers turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('should steal 1 amber', function () {
                expect(this.troll.damage).toBe(0);
                expect(this.eyegor.damage).toBe(0);
                expect(this.player1.amber).toBe(5);
                expect(this.player2.amber).toBe(3);
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
            });
        });
    });
});
