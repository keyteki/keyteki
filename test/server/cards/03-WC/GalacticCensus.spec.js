describe('Galactic Census', function () {
    describe("Galactic Census's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    hand: ['galactic-census', 'virtuous-works', 'chuff-ape'],
                    inPlay: ['sequis', 'mindwarper', 'blypyp']
                },
                player2: {
                    inPlay: ['zorg']
                }
            });
        });

        it('should not reward any amber when there is creatures from less than 3 houses in play', function () {
            this.player1.play(this.galacticCensus);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Galactic Census' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'staralliance',
                    hand: ['galactic-census', 'virtuous-works', 'spyyyder'],
                    inPlay: ['sequis']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone']
                }
            });
        });
        it('should reward 1 amber when there are 3 houses worth of creatures in play', function () {
            this.player1.play(this.galacticCensus);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Galactic Census' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'staralliance',
                    hand: ['galactic-census', 'virtuous-works'],
                    inPlay: ['sequis', 'spyyyder']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone']
                }
            });
        });
        it('should reward 1 amber when there are 4 houses worth of creatures in play', function () {
            this.player1.play(this.galacticCensus);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Galactic Census' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'staralliance',
                    hand: ['galactic-census', 'virtuous-works'],
                    inPlay: ['sequis', 'lieutenant-khrkhar', 'knuckles-bolton']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone', 'lifeward']
                }
            });
        });
        it('should reward 2 amber when there are 5 houses worth of creatures in play', function () {
            this.player1.play(this.galacticCensus);
            expect(this.player1.amber).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
    describe("Galactic Census' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'staralliance',
                    hand: ['galactic-census', 'virtuous-works'],
                    inPlay: ['sequis', 'lieutenant-khrkhar', 'knuckles-bolton']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone', 'rustgnawer']
                }
            });
        });
        it('should reward 3 amber when there are 6+ houses worth of creatures in play', function () {
            this.player1.play(this.galacticCensus);
            expect(this.player1.amber).toBe(7);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
