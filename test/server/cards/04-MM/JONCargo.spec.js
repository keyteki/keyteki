describe('J.O.N. Cargo', function () {
    describe("J.O.N. Cargo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['jon-cargo'],
                    hand: ['stunner', 'sensor-chief-garcia', 'flaxia', 'medic-ingram']
                },
                player2: {
                    amber: 1,
                    hand: ['detention-coil', 'disruption-field']
                }
            });
        });

        it('should not archive any card if deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.reap(this.jonCargo);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.archives.length).toBe(0);
        });

        it('should not archive any card if hand has no card of same house as discarded card', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.reap(this.jonCargo);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.flaxia.location).toBe('discard');
        });

        it('should not archive any card if hand is empty', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.stunner, 'deck');
            this.player1.play(this.sensorChiefGarcia);
            this.player1.play(this.medicIngram);
            this.player1.clickCard(this.medicIngram);
            this.player1.reap(this.jonCargo);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.stunner.location).toBe('discard');
        });

        it('should archive all cards that shares a house with discarded card', function () {
            this.player1.moveCard(this.stunner, 'deck');
            this.player1.reap(this.jonCargo);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.stunner.location).toBe('discard');
            expect(this.flaxia.location).toBe('hand');
            expect(this.medicIngram.location).toBe('archives');
            expect(this.sensorChiefGarcia.location).toBe('archives');
        });
    });
});
