describe('Animating Force', function () {
    describe("Animating Force's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['animating-force'],
                    inPlay: ['dominator-bauble', 'charette']
                },
                player2: {
                    hand: ['wipe-clear'],
                    inPlay: ['cpo-zytar', 'library-of-babble']
                }
            });
        });

        it('takes control of enemy artifact and turns it into a creature', function () {
            this.player1.clickCard(this.animatingForce);
            this.player1.clickPrompt('Play this upgrade');
            expect(this.player1).toBeAbleToSelect(this.dominatorBauble);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.animatingForce.parent).toBe(this.libraryOfBabble);
            expect(this.animatingForce.location).toBe('play area');
            this.player1.clickPrompt('Right');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.reap(this.libraryOfBabble);
            expect(this.player1.amber).toBe(2);
            expect(this.libraryOfBabble.power).toBe(4);
            expect(this.libraryOfBabble.neighbors[0]).toBe(this.charette);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('takes control of friendly artifact and turns it into a creature', function () {
            this.player1.playUpgrade(this.animatingForce, this.dominatorBauble);
            expect(this.animatingForce.parent).toBe(this.dominatorBauble);
            expect(this.dominatorBauble.location).toBe('play area');
            expect(this.dominatorBauble.power).toBe(4);
            expect(this.dominatorBauble.neighbors[0]).toBe(this.charette);
            this.player1.clickPrompt('Right');
            this.player1.useAction(this.dominatorBauble);
            this.player1.clickCard(this.charette);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('is unaffected when removing the upgrade', function () {
            this.player1.playUpgrade(this.animatingForce, this.dominatorBauble);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.wipeClear);
            expect(this.animatingForce.location).toBe('discard');
            expect(this.dominatorBauble.location).toBe('play area');
            expect(this.dominatorBauble.power).toBe(4);
            expect(this.dominatorBauble.neighbors[0]).toBe(this.charette);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can gain an amber on scrap', function () {
            this.player1.clickCard(this.animatingForce);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
