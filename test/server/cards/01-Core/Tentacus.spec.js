describe('Tentacus', function () {
    describe("Tentacus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['library-of-babble', 'ember-imp'],
                    hand: ['remote-access', 'anomaly-exploiter']
                },
                player2: {
                    inPlay: ['tentacus', 'ether-spider', 'dominator-bauble']
                }
            });
        });

        it('should stop players from using artifacts when they have no amber', function () {
            this.player1.play(this.anomalyExploiter);
            expect(this.anomalyExploiter.location).toBe('play area');
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.play(this.remoteAccess);
            expect(this.etherSpider.amber).toBe(1);
            expect(this.player1).toHavePrompt('Remote Access');
            expect(this.player1).toBeAbleToSelect(this.dominatorBauble);
            this.player1.clickCard(this.dominatorBauble);
            expect(this.dominatorBauble.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should pay an amber to the opponent when they use an artifact', function () {
            this.player1.amber = 3;
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            this.player1.play(this.remoteAccess);
            expect(this.player1).toHavePrompt('Remote Access');
            this.player1.clickCard(this.dominatorBauble);
            expect(this.player1).toHavePrompt('Dominator Bauble');
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toHavePrompt('Ember Imp');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.etherSpider.amber).toBe(2);
        });
    });

    describe("Tentacus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['library-of-babble', 'ether-spider'],
                    hand: ['remote-access', 'anomaly-exploiter']
                },
                player2: {
                    inPlay: ['tentacus', 'dominator-bauble']
                }
            });
        });

        it('paid amount should be captured by Ether Spider', function () {
            this.player1.amber = 3;
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.etherSpider.amber).toBe(1);
        });
    });
});
