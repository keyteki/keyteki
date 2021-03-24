describe('Corrode', function () {
    describe("Corrode's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['corrode', 'way-of-the-wolf'],
                    inPlay: ['flaxia', 'ritual-of-balance']
                },
                player2: {
                    amber: 1,
                    inPlay: ['francus', 'krump', 'lifeward']
                }
            });
            this.player1.playUpgrade(this.wayOfTheWolf, this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.play(this.corrode);
        });

        it('be able to select all upgrades, artifacts, and creatures with armor', function () {
            expect(this.player1).toBeAbleToSelect(this.lifeward);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.francus);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.wayOfTheWolf);
        });

        describe('select artifact', function () {
            it('destroy selected artifact', function () {
                this.player1.clickCard(this.lifeward);
                expect(this.lifeward.location).toBe('discard');
                expect(this.ritualOfBalance.location).toBe('play area');
                expect(this.flaxia.location).toBe('play area');
                expect(this.francus.location).toBe('play area');
                expect(this.krump.location).toBe('play area');
                expect(this.wayOfTheWolf.location).toBe('play area');
            });
        });

        describe('select upgrade', function () {
            it('destroy selected upgrade', function () {
                this.player1.clickCard(this.wayOfTheWolf);
                expect(this.lifeward.location).toBe('play area');
                expect(this.ritualOfBalance.location).toBe('play area');
                expect(this.flaxia.location).toBe('play area');
                expect(this.francus.location).toBe('play area');
                expect(this.krump.location).toBe('play area');
                expect(this.wayOfTheWolf.location).toBe('discard');
            });
        });

        describe('select creature', function () {
            it('destroy selected creature', function () {
                this.player1.clickCard(this.francus);
                expect(this.lifeward.location).toBe('play area');
                expect(this.ritualOfBalance.location).toBe('play area');
                expect(this.flaxia.location).toBe('play area');
                expect(this.francus.location).toBe('discard');
                expect(this.krump.location).toBe('play area');
                expect(this.wayOfTheWolf.location).toBe('play area');
            });
        });
    });
});
