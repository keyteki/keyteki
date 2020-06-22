describe('Sci. Officer Morpheus', function () {
    describe("Sci. Officer Morpheus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['sci-officer-morpheus', 'lamindra', 'redlock'],
                    hand: ['medic-ingram', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 11,
                    inPlay: ['mighty-tiger'],
                    hand: ['dextre', 'krump']
                }
            });
        });

        it('should activate play effect of a creature twice and ask for use iteraction twice', function () {
            this.player1.playCreature(this.medicIngram);
            this.player1.clickCard(this.sciOfficerMorpheus);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.redlock);
            expect(this.lamindra.warded).toBe(true);
            expect(this.redlock.warded).toBe(true);
        });

        it('should activate play effect of a creature without user iteraction', function () {
            this.player1.playCreature(this.sensorChiefGarcia);
            this.player1.clickCard(this.sciOfficerMorpheus);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(1);
        });
    });
    describe("Sci. Officer Morpheus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['sci-officer-morpheus', 'lamindra', 'redlock'],
                    hand: ['medic-ingram', 'sensor-chief-garcia', 'helper-bot']
                },
                player2: {
                    amber: 11,
                    inPlay: ['mighty-tiger'],
                    hand: ['dextre', 'krump']
                }
            });
        });

        it('should stack off house play effects, like kirby, or helper bot', function () {
            this.player1.playCreature(this.helperBot, true);
            this.player1.clickCard(this.sciOfficerMorpheus);
            this.player1.playCreature(this.medicIngram, true);
            this.player1.clickCard(this.medicIngram);
            this.player1.clickCard(this.helperBot);
            this.player1.clickPrompt('Done');
            this.player1.playCreature(this.sensorChiefGarcia, true);
        });
    });

    describe('Morpheus/Mindlock interaction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['harland-mindlock']
                },
                player2: {
                    inPlay: ['sci-officer-morpheus', 'lamindra']
                }
            });
        });

        it('should allow mindlock to trigger again if morpheus is taken control of', function () {
            this.player1.playCreature(this.harlandMindlock);
            expect(this.player1).toHavePrompt('Harland Mindlock');
            expect(this.player1).toBeAbleToSelect(this.sciOfficerMorpheus);
            this.player1.clickCard(this.sciOfficerMorpheus);
            this.player1.clickPrompt('Left');
            expect(this.sciOfficerMorpheus.controller).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Harland Mindlock');
        });
    });
});
