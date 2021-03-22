describe('C.R. Officer Hawkins Evil Twin', function () {
    describe("C.R. Officer Hawkins Evil Twin's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['cr-officer-hawkins-evil-twin'],
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

        it('should not make opponent lose amber when no other creatures are in the battleline', function () {
            this.player1.moveCard(this.sensorChiefGarcia, 'discard');
            this.player1.moveCard(this.championAnaphiel, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.play(this.crOfficerHawkinsEvilTwin);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should make opponent lose 1A when played on flank next to non-SA', function () {
            this.player1.play(this.crOfficerHawkinsEvilTwin, false, false);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should make opponent lose 1A when deployed next to SA and non-SA', function () {
            this.player1.play(this.crOfficerHawkinsEvilTwin, false, true);
            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should not make opponent lose amber when deployed next to SA and SA', function () {
            this.player1.play(this.crOfficerHawkinsEvilTwin, true, true);
            this.player1.clickCard(this.sensorChiefGarcia);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should make opponent lose 2A when deployed next to non-SA and non-SA', function () {
            this.player1.play(this.crOfficerHawkinsEvilTwin, false, true);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        it('should not make opponent lose amber when played on flank next to SA', function () {
            this.player1.play(this.crOfficerHawkinsEvilTwin, true, false);
            this.player1.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
