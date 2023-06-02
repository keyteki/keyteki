describe('Stealthster', function () {
    describe("Stealthster's creature ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['captain-val-jericho'],
                    inPlay: ['stealthster']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should be an elusive creature', function () {
            expect(this.stealthster.getKeywordValue('elusive')).toBe(1);
        });
    });

    describe("Stealthster's upgrade ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['stealthster', 'medic-ingram'],
                    inPlay: ['captain-val-jericho']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should be able to play as upgrade', function () {
            this.player1.playUpgrade(this.stealthster, this.captainValJericho);
            expect(this.stealthster.parent).toBe(this.captainValJericho);
        });

        it('should give elusive to the parent creature', function () {
            this.player1.playUpgrade(this.stealthster, this.captainValJericho);
            expect(this.captainValJericho.getKeywordValue('elusive')).toBe(1);
        });
    });
});
