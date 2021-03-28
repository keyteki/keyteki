describe('Ambassador Liu', function () {
    describe("Ambassador Liu's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['ambassador-liu'],
                    hand: ['shooler', 'lamindra', 'medic-ingram']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });
        });

        it('should steal 1A if discarded Dis', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
        });

        it('should steal 1A if discarded Shadows', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
        });

        it('should not do anything if discarded staralliance', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.medicIngram);
            expect(this.medicIngram.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Ambassador Liu's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['ambassador-liu'],
                    hand: ['dextre', 'bumblebird', 'medic-ingram']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });
        });

        it('should gain 2A if discarded Logos', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(6);
        });

        it('should gain 2A if discarded Untamed', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.bumblebird);
            expect(this.bumblebird.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(6);
        });
    });

    describe("Ambassador Liu's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['ambassador-liu', 'senator-shrix'],
                    hand: ['bulwark', 'gargantodon', 'medic-ingram']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll']
                }
            });
        });

        it('should capture 3A if discarded Saurian', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.gargantodon);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.gargantodon);
            expect(this.gargantodon.location).toBe('discard');
            expect(this.ambassadorLiu.amber).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should capture 3A if discarded Sanctum', function () {
            this.player1.useAction(this.ambassadorLiu);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.gargantodon);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.location).toBe('discard');
            expect(this.ambassadorLiu.amber).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });
    });
});
