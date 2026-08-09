describe('Cladogenesis', function () {
    describe("Cladogenesis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: [
                        'cladogenesis',
                        'pelf',
                        'anger',
                        'hunting-witch',
                        'sensor-chief-garcia',
                        'away-team'
                    ],
                    discard: [
                        'troll',
                        'bumpsy',
                        'cpo-zytar',
                        'stealth-mode',
                        'dust-pixie',
                        'nepenthe-seed'
                    ]
                },
                player2: {
                    hand: ['urchin', 'dodger', 'umbra', 'sneklifter', 'ember-imp', 'censor-philo'],
                    discard: [
                        'draining-touch',
                        'the-terror',
                        'nerve-blast',
                        'throwing-stars',
                        'stomp',
                        'faust-the-great'
                    ]
                }
            });
        });

        it('should discard top cards and cards of same house from hand, then refill hands', function () {
            this.player1.moveCard(this.cpoZytar, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player2.moveCard(this.nerveBlast, 'deck');
            this.player2.moveCard(this.stomp, 'deck');
            this.player2.moveCard(this.drainingTouch, 'deck');
            this.player1.play(this.cladogenesis);
            expect(this.troll.location).toBe('discard');
            expect(this.pelf.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('hand');
            expect(this.drainingTouch.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.urchin.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not discard hand cards when deck is empty even if discard pile has matching house', function () {
            this.player1.player.deck = [];
            this.player2.player.deck = [];

            expect(this.pelf.location).toBe('hand');
            expect(this.anger.location).toBe('hand');
            expect(this.huntingWitch.location).toBe('hand');
            expect(this.sensorChiefGarcia.location).toBe('hand');
            expect(this.awayTeam.location).toBe('hand');

            expect(this.urchin.location).toBe('hand');
            expect(this.emberImp.location).toBe('hand');
            expect(this.dodger.location).toBe('hand');
            expect(this.umbra.location).toBe('hand');
            expect(this.sneklifter.location).toBe('hand');

            // No cards should be discarded from hand since there are no cards in deck
            this.player1.play(this.cladogenesis);

            expect(this.pelf.location).toBe('hand');
            expect(this.anger.location).toBe('hand');
            expect(this.huntingWitch.location).toBe('hand');
            expect(this.sensorChiefGarcia.location).toBe('hand');
            expect(this.awayTeam.location).toBe('hand');

            expect(this.urchin.location).toBe('hand');
            expect(this.dodger.location).toBe('hand');
            expect(this.umbra.location).toBe('hand');
            expect(this.sneklifter.location).toBe('hand');
            expect(this.emberImp.location).toBe('hand');
            expect(this.censorPhilo.location).toBe('hand');

            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should handle empty hand', function () {
            this.player1.player.hand = [this.cladogenesis];
            this.player2.player.hand = [];
            this.player1.play(this.cladogenesis);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
