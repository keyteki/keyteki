describe('Make It So', function () {
    describe("Make It So's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska', 'operative-espion'],
                    hand: ['make-it-so'],
                    discard: [
                        'sensor-chief-garcia',
                        'transporter-platform',
                        'lamindra',
                        'stealth-mode'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['bad-penny', 'troll', 'groggins']
                }
            });
        });

        describe('when the card does not match the selected house', function () {
            beforeEach(function () {
                this.player1.moveCard(this.lamindra, 'deck');
                this.player1.play(this.makeItSo);
                this.player1.clickPrompt('staralliance');
            });

            it('should not draw it, but keep it in the deck', function () {
                expect(this.player1.player.deck[0]).toBe(this.lamindra);
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when the card matches the selected house once', function () {
            beforeEach(function () {
                this.player1.moveCard(this.lamindra, 'deck');
                this.player1.moveCard(this.stealthMode, 'deck');
                this.player1.play(this.makeItSo);
                this.player1.clickPrompt('staralliance');
            });

            it('should draw one card, and keep the second in the deck', function () {
                expect(this.stealthMode.location).toBe('hand');
            });

            describe('when the effect is repeated and same house is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('staralliance');
                });

                it('should keep the next card in the deck', function () {
                    expect(this.stealthMode.location).toBe('hand');
                    expect(this.player1.player.deck[0]).toBe(this.lamindra);
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });

        describe('when the card matches the selected house multiple times', function () {
            beforeEach(function () {
                this.player1.moveCard(this.lamindra, 'deck');
                this.player1.moveCard(this.stealthMode, 'deck');
                this.player1.moveCard(this.transporterPlatform, 'deck');
                this.player1.moveCard(this.sensorChiefGarcia, 'deck');
                this.player1.play(this.makeItSo);
                this.player1.clickPrompt('staralliance');
            });

            it('should draw all cards, and keep the last in the deck', function () {
                expect(this.sensorChiefGarcia.location).toBe('hand');
                this.player1.clickPrompt('staralliance');
                expect(this.transporterPlatform.location).toBe('hand');
                this.player1.clickPrompt('staralliance');
                expect(this.stealthMode.location).toBe('hand');
                this.player1.clickPrompt('staralliance');
                expect(this.player1.player.deck[0]).toBe(this.lamindra);
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when different houses are selected', function () {
            beforeEach(function () {
                this.player1.moveCard(this.lamindra, 'deck');
                this.player1.moveCard(this.stealthMode, 'deck');
                this.player1.moveCard(this.transporterPlatform, 'deck');
                this.player1.moveCard(this.sensorChiefGarcia, 'deck');
                this.player1.play(this.makeItSo);
                this.player1.clickPrompt('staralliance');
            });

            it('should draw all cards, and keep the last in the deck', function () {
                expect(this.sensorChiefGarcia.location).toBe('hand');
                this.player1.clickPrompt('shadows');
                expect(this.player1.player.deck[0]).toBe(this.transporterPlatform);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
