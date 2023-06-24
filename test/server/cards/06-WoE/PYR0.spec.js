describe('PYR*0', function () {
    describe("PYR*0's creature ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['captain-val-jericho'],
                    inPlay: ['pyr*0']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should have splash-attack 3', function () {
            expect(this['pyr*0'].getKeywordValue('splash-attack')).toBe(3);
        });
    });

    describe("PYR-0's upgrade ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['pyr*0', 'medic-ingram'],
                    inPlay: ['captain-val-jericho']
                },
                player2: {
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should be able to play as upgrade', function () {
            this.player1.playUpgrade(this['pyr*0'], this.captainValJericho);
            expect(this['pyr*0'].parent).toBe(this.captainValJericho);
        });

        it('should give splash-attack to the parent creature', function () {
            this.player1.playUpgrade(this['pyr*0'], this.captainValJericho);
            expect(this.captainValJericho.getKeywordValue('splash-attack')).toBe(3);
        });
    });
});
