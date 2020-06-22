describe('Etaromme', function () {
    describe("Etaromme's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['etaromme'],
                    hand: ['shooler']
                },
                player2: {
                    amber: 3,
                    inPlay: []
                }
            });
        });

        it('should destroy itself when it is the only creature in play', function () {
            this.player1.reap(this.etaromme);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.etaromme);

            this.player1.clickCard(this.etaromme);

            expect(this.etaromme.location).toBe('discard');
        });

        it('should select only creatures of Dis house', function () {
            this.player1.playCreature(this.shooler);
            this.player1.reap(this.etaromme);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.etaromme);
            expect(this.player1).toBeAbleToSelect(this.shooler);

            this.player1.clickCard(this.shooler);

            expect(this.shooler.location).toBe('discard');
            expect(this.etaromme.location).toBe('play area');
        });
    });

    describe("Etaromme's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['etaromme', 'archimedes', 'helper-bot', 'troll'],
                    hand: ['shooler']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should be able to destroy all Logo creatures', function () {
            this.player1.reap(this.etaromme);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.etaromme);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.archimedes);

            expect(this.archimedes.location).toBe('discard');
        });
    });

    describe("Etaromme's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['etaromme', 'dextre', 'krump', 'troll'],
                    hand: ['shooler']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra', 'shadow-self']
                }
            });
        });

        it('should be able to destroy all Brobnar and Shadows creatures', function () {
            this.player1.reap(this.etaromme);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            expect(this.player1).not.toBeAbleToSelect(this.etaromme);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);

            this.player1.clickCard(this.shadowSelf);

            expect(this.shadowSelf.location).toBe('discard');
        });
    });

    describe("Etaromme's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['archimedes', 'troll'],
                    hand: ['experimental-therapy']
                },
                player2: {
                    amber: 3,
                    inPlay: ['etaromme', 'lamindra', 'krump']
                }
            });
        });

        it('should consider house modifiers', function () {
            this.player1.playUpgrade(this.experimentalTherapy, this.archimedes);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.etaromme);

            expect(this.player2).toHavePrompt('Choose a creature');
            expect(this.player2).toBeAbleToSelect(this.archimedes);
            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.etaromme);
            expect(this.player2).not.toBeAbleToSelect(this.lamindra);

            this.player2.clickCard(this.archimedes);

            expect(this.archimedes.location).toBe('discard');
        });
    });
});
