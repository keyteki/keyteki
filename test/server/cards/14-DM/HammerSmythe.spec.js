describe('Hammer Smythe', function () {
    describe("Hammer Smythe's after reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['hammer-smythe', 'echofly']
                },
                player2: {
                    inPlay: ['troll', 'lamindra']
                }
            });
        });

        it('deals 2 damage to chosen creature without destruction grants no counters', function () {
            this.player1.reap(this.hammerSmythe);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            this.player1.clickCard(this.troll);
            // Troll has 6 power, takes 2 damage, not destroyed
            expect(this.troll.damage).toBe(2);
            expect(this.troll.location).toBe('play area');
            expect(this.echofly.powerCounters).toBeFalsy();
            expect(this.player1).isReadyToTakeAction();
        });

        it('grants two +1 power counters when damage destroys the creature', function () {
            this.player1.reap(this.hammerSmythe);
            this.player1.clickCard(this.lamindra);
            // Lamindra has 1 power - 2 damage destroys it
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.hammerSmythe);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Hammer Smythe with no friendly target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['hammer-smythe']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('still grants counters to itself when only Hammer Smythe is friendly', function () {
            this.player1.reap(this.hammerSmythe);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            this.player1.clickCard(this.hammerSmythe);
            expect(this.hammerSmythe.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
