describe('Hammer Smythe', function () {
    describe("Hammer Smythe's after reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['hammer-smythe', 'echofly']
                },
                player2: {
                    inPlay: ['troll', 'lamindra', 'bad-penny']
                }
            });
        });

        it('deals 2 damage to chosen creature without destruction grants no counters', function () {
            this.player1.reap(this.hammerSmythe);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.hammerSmythe);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.troll.location).toBe('play area');
            expect(this.hammerSmythe.powerCounters).toBe(0);
            expect(this.echofly.powerCounters).toBe(0);
            expect(this.troll.powerCounters).toBe(0);
            expect(this.lamindra.powerCounters).toBe(0);
            expect(this.badPenny.powerCounters).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('grants two +1 power counters when damage destroys an opposing creature', function () {
            this.player1.reap(this.hammerSmythe);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.hammerSmythe);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.echofly);
            expect(this.hammerSmythe.powerCounters).toBe(0);
            expect(this.echofly.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('grants power counters when Hammer Smythe destroys itself', function () {
            this.player1.reap(this.hammerSmythe);
            this.player1.clickCard(this.hammerSmythe);
            expect(this.hammerSmythe.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.echofly);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('still grants power counters when Bad Penny bounces back to hand', function () {
            this.player1.reap(this.hammerSmythe);
            this.player1.clickCard(this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.echofly);
            expect(this.echofly.powerCounters).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Hammer Smythe vs Armageddon Cloak', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['lamindra'],
                    hand: ['armageddon-cloak']
                },
                player2: {
                    inPlay: ['hammer-smythe', 'echofly']
                }
            });
        });

        it('grants no power counters when destruction is replaced by Armageddon Cloak', function () {
            this.player1.playUpgrade(this.armageddonCloak, this.lamindra);
            this.player1.endTurn();
            this.player2.clickPrompt('geistoid');
            this.player2.reap(this.hammerSmythe);
            this.player2.clickCard(this.lamindra);
            expect(this.armageddonCloak.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.hammerSmythe.powerCounters).toBe(0);
            expect(this.echofly.powerCounters).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
