describe('Mender', function () {
    describe("Mender's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['mender'],
                    inPlay: ['chronophage', 'flaxia', 'batdrone'],
                    discard: ['poke', 'full-moon']
                },
                player2: {
                    hand: ['kerwollop', 'kerwollop'],
                    inPlay: ['thing-from-the-deep', 'away-team'],
                    discard: ['crushing-deep']
                }
            });
            this.kerwollop2 = this.player2.hand[1];
            this.chronophage.tokens.damage = 2;
            this.flaxia.tokens.damage = 2;
            this.batdrone.tokens.damage = 1;
            this.thingFromTheDeep.tokens.damage = 10;
            this.awayTeam.tokens.damage = 3;
        });

        it('purges a card from a discard on play', function () {
            this.player1.playCreature(this.mender);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).toBeAbleToSelect(this.crushingDeep);
            expect(this.player1).not.toBeAbleToSelect(this.chronophage);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.awayTeam);
            this.player1.clickCard(this.crushingDeep);
            expect(this.crushingDeep.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('heals and wards all robot creatures on play', function () {
            this.player1.playCreature(this.mender);
            this.player1.clickCard(this.crushingDeep);
            expect(this.mender.tokens.damage).toBe(undefined);
            expect(this.mender.warded).toBe(true);
            expect(this.chronophage.tokens.damage).toBe(undefined);
            expect(this.chronophage.warded).toBe(true);
            expect(this.flaxia.tokens.damage).toBe(2);
            expect(this.flaxia.warded).toBe(false);
            expect(this.batdrone.tokens.damage).toBe(undefined);
            expect(this.batdrone.warded).toBe(true);
            expect(this.thingFromTheDeep.tokens.damage).toBe(10);
            expect(this.thingFromTheDeep.warded).toBe(false);
            expect(this.awayTeam.tokens.damage).toBe(undefined);
            expect(this.awayTeam.warded).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('also works on reap', function () {
            this.player1.playCreature(this.mender);
            this.player1.clickCard(this.poke);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.kerwollop);
            this.player2.play(this.kerwollop2);
            this.player2.endTurn();
            this.player1.clickPrompt('geistoid');
            this.player1.reap(this.mender);
            this.player1.clickCard(this.crushingDeep);
            expect(this.crushingDeep.location).toBe('purged');
            expect(this.mender.tokens.damage).toBe(undefined);
            expect(this.mender.warded).toBe(true);
            expect(this.chronophage.tokens.damage).toBe(undefined);
            expect(this.chronophage.warded).toBe(true);
            expect(this.flaxia.location).toBe('discard');
            expect(this.batdrone.tokens.damage).toBe(undefined);
            expect(this.batdrone.warded).toBe(true);
            expect(this.thingFromTheDeep.tokens.damage).toBe(12);
            expect(this.thingFromTheDeep.warded).toBe(false);
            expect(this.awayTeam.tokens.damage).toBe(undefined);
            expect(this.awayTeam.warded).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
