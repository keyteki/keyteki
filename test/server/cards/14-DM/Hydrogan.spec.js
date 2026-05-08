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

    describe('Hydrogan with non-creature cards under it', function () {
        it('does not put back an animated artifact whose lasting effect ended after being placed under', function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['hydrogan', 'hydrogan2', 'animating-force'],
                    inPlay: ['dominator-bauble']
                },
                player2: {}
            });

            this.player1.playUpgrade(this.animatingForce, this.dominatorBauble);
            this.player1.clickPrompt('Right');
            expect(this.dominatorBauble.type).toBe('creature');

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.play(this.hydrogan);
            expect(this.hydrogan.childCards).toContain(this.dominatorBauble);
            expect(this.dominatorBauble.type).toBe('artifact');

            this.hydrogan.ready();
            this.player1.reap(this.hydrogan);
            expect(this.player1).not.toBeAbleToSelect(this.dominatorBauble);
            expect(this.dominatorBauble.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not put back a token creature whose underlying card is an action', function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'prospector',
                    deck: ['wild-wormhole'],
                    hand: ['hydrogan', 'hydrogan2'],
                    inPlay: ['prospector:wild-wormhole']
                },
                player2: {}
            });

            const wildWormhole = this.player1.player.creaturesInPlay[0];
            expect(wildWormhole.type).toBe('creature');

            this.player1.play(this.hydrogan);
            expect(this.hydrogan.childCards).toContain(wildWormhole);
            expect(wildWormhole.type).toBe('action');

            this.hydrogan.ready();
            this.player1.reap(this.hydrogan);
            expect(this.player1).not.toBeAbleToSelect(wildWormhole);
            expect(wildWormhole.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not put back a token creature whose underlying card is an artifact', function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'prospector',
                    deck: ['library-of-babble'],
                    hand: ['hydrogan', 'hydrogan2'],
                    inPlay: ['prospector:library-of-babble']
                },
                player2: {}
            });

            const libraryOfBabble = this.player1.player.creaturesInPlay[0];
            expect(libraryOfBabble.type).toBe('creature');

            this.player1.play(this.hydrogan);
            expect(this.hydrogan.childCards).toContain(libraryOfBabble);
            expect(libraryOfBabble.type).toBe('artifact');

            this.hydrogan.ready();
            this.player1.reap(this.hydrogan);
            expect(this.player1).not.toBeAbleToSelect(libraryOfBabble);
            expect(libraryOfBabble.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not put back a token creature whose underlying card is an upgrade', function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'prospector',
                    deck: ['rocket-boots'],
                    hand: ['hydrogan', 'hydrogan2'],
                    inPlay: ['prospector:rocket-boots']
                },
                player2: {}
            });

            const rocketBoots = this.player1.player.creaturesInPlay[0];
            expect(rocketBoots.type).toBe('creature');

            this.player1.play(this.hydrogan);
            expect(this.hydrogan.childCards).toContain(rocketBoots);
            expect(rocketBoots.type).toBe('upgrade');

            this.hydrogan.ready();
            this.player1.reap(this.hydrogan);
            expect(this.player1).not.toBeAbleToSelect(rocketBoots);
            expect(rocketBoots.location).toBe('under');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
