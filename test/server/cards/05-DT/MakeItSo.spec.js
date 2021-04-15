describe('MakeItSo', function () {
    describe("MakeItSo's ability", function () {
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
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
                expect(this.player1.player.deck[0]).toBe(this.lamindra);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
                expect(this.stealthMode.location).toBe('hand');
                expect(this.sensorChiefGarcia.location).toBe('hand');
                expect(this.transporterPlatform.location).toBe('hand');
                expect(this.player1.player.deck[0]).toBe(this.lamindra);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
