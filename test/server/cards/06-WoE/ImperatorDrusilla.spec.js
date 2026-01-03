describe('Imperator Drusilla', function () {
    describe("Imperator Drusilla's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['imperator-drusilla'],
                    inPlay: ['aquilia-lone-hero', 'orator-hissaro']
                },
                player2: {
                    inPlay: ['umbra', 'murkens', 'bumpsy']
                }
            });
        });

        it('destroys a friendly creature on play', function () {
            this.player1.playCreature(this.imperatorDrusilla);
            expect(this.player1).toBeAbleToSelect(this.aquiliaLoneHero);
            expect(this.player1).toBeAbleToSelect(this.oratorHissaro);
            expect(this.player1).not.toBeAbleToSelect(this.imperatorDrusilla);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.oratorHissaro);
            expect(this.oratorHissaro.location).toBe('discard');
            expect(this.aquiliaLoneHero.location).toBe('play area');
            expect(this.imperatorDrusilla.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('gets splash-attack 4 when there are more enemies', function () {
            this.player1.playCreature(this.imperatorDrusilla);
            this.player1.clickCard(this.oratorHissaro);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            this.player1.fightWith(this.imperatorDrusilla, this.murkens);
            expect(this.murkens.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.tokens.damage).toBe(4);
        });

        it('gets no splash-attack when there are not more enemies', function () {
            this.player1.playCreature(this.imperatorDrusilla);
            this.player1.clickCard(this.oratorHissaro);
            this.player1.endTurn();

            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.murkens, this.imperatorDrusilla);
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            this.player1.fightWith(this.imperatorDrusilla, this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.tokens.damage).toBe(undefined);
        });
    });
});
