describe('Hydrogan', function () {
    describe("Hydrogan's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hydrogan', 'hydrogan2'],
                    inPlay: ['troll', 'snufflegator']
                },
                player2: {
                    inPlay: ['urchin', 'bumpsy', 'pen-pal']
                }
            });
        });

        it('places each other creature under Hydrogan', function () {
            this.player1.play(this.hydrogan);
            expect(this.hydrogan.childCards).toContain(this.troll);
            expect(this.hydrogan.childCards).toContain(this.snufflegator);
            expect(this.hydrogan.childCards).toContain(this.urchin);
            expect(this.hydrogan.childCards).toContain(this.bumpsy);
            expect(this.hydrogan.childCards).toContain(this.penPal);
            expect(this.hydrogan.childCards).not.toContain(this.hydrogan2);
            expect(this.hydrogan.childCards.length).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hydrogan's after-reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hydrogan', 'hydrogan2']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
            this.player1.play(this.hydrogan);
            this.hydrogan.ready();
        });

        it('puts a creature from under Hydrogan into play under your control', function () {
            this.player1.reap(this.hydrogan);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hydrogan's after-fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hydrogan', 'hydrogan2']
                },
                player2: {
                    house: 'shadows',
                    hand: ['bumpsy'],
                    inPlay: ['urchin']
                }
            });
            this.player1.play(this.hydrogan);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.bumpsy);
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.hydrogan.ready();
        });

        it('puts a creature from under Hydrogan into play under your control', function () {
            this.player1.fightWith(this.hydrogan, this.bumpsy);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hydrogan's destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hydrogan', 'hydrogan2']
                },
                player2: {
                    inPlay: ['urchin', 'bumpsy', 'troll'],
                    hand: ['regrettable-meteor']
                }
            });
            this.player1.play(this.hydrogan);
        });

        it('purges each card under Hydrogan when destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.regrettableMeteor);
            expect(this.hydrogan.location).toBe('discard');
            expect(this.urchin.location).toBe('purged');
            expect(this.bumpsy.location).toBe('purged');
            expect(this.troll.location).toBe('purged');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
// TODO: make sure hydrogan handles artifacts and token creatures correctly
