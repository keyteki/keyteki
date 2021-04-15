describe('C.R. Officer Hawkins', function () {
    describe("C.R. Officer Hawkins's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['cr-officer-hawkins'],
                    inPlay: [
                        'armsmaster-molina',
                        'sensor-chief-garcia',
                        'champion-anaphiel',
                        'ardent-hero'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra']
                }
            });
        });

        it('should not gain any amber when no other creatures are in the battleline', function () {
            this.player1.moveCard(this.sensorChiefGarcia, 'discard');
            this.player1.moveCard(this.championAnaphiel, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.play(this.crOfficerHawkins);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should gain 1A when played on flank next to non-SA', function () {
            this.player1.play(this.crOfficerHawkins, false, false);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });

        it('should gain 1A when deployed next to SA and non-SA', function () {
            this.player1.play(this.crOfficerHawkins, false, true);
            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });

        it('should not gain 1A when deployed next to SA and SA', function () {
            this.player1.play(this.crOfficerHawkins, true, true);
            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should gain 2A when deployed next to non-SA and non-SA', function () {
            this.player1.play(this.crOfficerHawkins, false, true);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
        });

        it('should not gain 1A when played on flank next to SA', function () {
            this.player1.play(this.crOfficerHawkins, true, false);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
