describe('Arbiter Vyynx', function () {
    describe("Arbiter Vyynx's reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['arbiter-vyynx', 'john-smyth', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('does not allow targeting friendly Mars creatures', function () {
            this.player1.reap(this.arbiterVyynx);
            expect(this.player1).not.toBeAbleToSelect(this.arbiterVyynx);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys a friendly non-Mars creature and takes control of an enemy creature', function () {
            this.player1.reap(this.arbiterVyynx);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose an enemy creature');
            expect(this.player1).not.toBeAbleToSelect(this.arbiterVyynx);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Arbiter Vyynx with Bad Penny', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['arbiter-vyynx', 'bad-penny']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('still takes control after Bad Penny returns to hand', function () {
            this.player1.reap(this.arbiterVyynx);
            this.player1.clickCard(this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose an enemy creature');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Arbiter Vyynx with no other friendly non-Mars creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['arbiter-vyynx', 'john-smyth']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('cannot resolve and does not take control', function () {
            this.player1.reap(this.arbiterVyynx);
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Arbiter Vyynx with no enemy creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['arbiter-vyynx', 'urchin']
                },
                player2: {}
            });
        });

        it('still requires destroying a friendly non-Mars creature', function () {
            this.player1.reap(this.arbiterVyynx);
            expect(this.player1).toHavePrompt('Choose a friendly non-Mars creature');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Arbiter Vyynx with non-Mars house', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['arbiter-vyynx', 'batdrone']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.arbiterVyynx.printedHouse = 'logos';
        });

        it('can target itself when it is not Mars and still takes control of an enemy creature', function () {
            this.player1.reap(this.arbiterVyynx);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.arbiterVyynx);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.arbiterVyynx);
            expect(this.arbiterVyynx.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose an enemy creature');
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
