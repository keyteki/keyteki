describe('Pingle Who Annoys', function () {
    describe("Pingle Who Annoys's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['nexus', 'urchin']
                },
                player2: {
                    amber: 1,
                    inPlay: ['pingle-who-annoys'],
                    hand: ['alaka']
                }
            });
        });

        it('should deal 1 damage to enemy creature when it enters play', function () {
            this.player1.play(this.nexus);
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.damage).toBe(1);
        });

        it('should not deal 1 damage to own creature when it enters play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.alaka);
            expect(this.alaka.location).toBe('play area');
            expect(this.alaka.damage).toBe(0);
        });

        it('should prompt the player whether to trigger Urchin or Pingle first', function () {
            this.player1.play(this.urchin);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.pingleWhoAnnoys);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });

    describe('Pingle Who Annoys and Watch your step', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'warrior',
                    inPlay: ['pingle-who-annoys'],
                    hand: ['watch-your-step']
                },
                player2: {
                    amber: 1,
                    hand: ['alaka', 'flaxia']
                }
            });

            this.player1.play(this.watchYourStep);
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
        });

        it('should not deal 1 damage to own tokens', function () {
            this.player2.clickPrompt('brobnar');
            this.player2.clickPrompt('Left');
            this.player2.clickPrompt('Left');
            expect(this.player1.inPlay[0].name).toBe('Warrior');
            expect(this.player1.inPlay[0].damage).toBe(0);
            expect(this.player1.inPlay[1].name).toBe('Warrior');
            expect(this.player1.inPlay[1].damage).toBe(0);
        });
    });

    describe('Pingle Who Annoys and Amberlution', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['bigtwig', 'æmberlution']
                },
                player2: {
                    amber: 1,
                    hand: ['alaka', 'pingle-who-annoys', 'flaxia']
                }
            });
        });

        it('should not deal 1 damage to own tokens', function () {
            this.player1.play(this.æmberlution);
            expect(this.player1).toBeAbleToSelect(this.bigtwig);
            expect(this.player1).toBeAbleToSelect(this.alaka);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.pingleWhoAnnoys);
            this.player1.clickCard(this.pingleWhoAnnoys);
            this.player1.clickCard(this.alaka);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.flaxia);
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.bigtwig);
            expect(this.bigtwig.location).toBe('play area');
            expect(this.pingleWhoAnnoys.location).toBe('play area');
            expect(this.alaka.location).toBe('play area');
            expect(this.flaxia.location).toBe('play area');
            expect(this.bigtwig.damage).toBe(1);
            expect(this.alaka.damage).toBe(0);
            expect(this.flaxia.damage).toBe(0);
        });
    });
});
