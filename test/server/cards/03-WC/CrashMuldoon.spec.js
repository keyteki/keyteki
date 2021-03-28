describe('Crash Muldoon', function () {
    describe("Crash Muldoon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['crash-muldoon']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });
        it('should enter play ready', function () {
            this.player1.play(this.crashMuldoon);
            this.player1.reap(this.crashMuldoon);
            expect(this.player1.amber).toBe(1);
        });
    });
    describe("Crash Muldoon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['mother', 'crash-muldoon', 'lieutenant-khrkhar']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });
        it('action ability should let you use a neighboring non-star-alliance creature', function () {
            this.player1.clickCard(this.crashMuldoon);
            this.player1.clickPrompt("Use this card's action ability");
            expect(this.player1).toHavePrompt('Crash Muldoon');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.mother);
            this.player1.clickPrompt('Reap with this Creature');
            expect(this.player1.amber).toBe(1);
        });
    });
    describe("Crash Muldoon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['crash-muldoon', 'lieutenant-khrkhar']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });
        it('action ability should not let you use a neighboring star-alliance creature', function () {
            this.player1.clickCard(this.crashMuldoon);
            this.player1.clickPrompt("Use this card's action ability");
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
