describe('Ardent Hero', function () {
    describe("Ardent Hero's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    inPlay: [
                        'ancient-bear',
                        'tantadlin',
                        'cephaloist',
                        'pismire',
                        'dark-faerie',
                        'bramble-lynx'
                    ],
                    hand: ['sacro-beast', 'dino-beast', 'lupo-the-scarred']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ardent-hero']
                }
            });

            this.sacroBeast.cardData.enhancements = ['damage'];
        });

        it('should not take damage from creature with power equal to 5', function () {
            this.player1.fightWith(this.ancientBear, this.ardentHero);
            expect(this.ancientBear.tokens.damage).toBe(4);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should not take damage from creature with power >= 5', function () {
            this.player1.fightWith(this.tantadlin, this.ardentHero);
            expect(this.tantadlin.tokens.damage).toBe(4);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should not take damage from mutant creatures', function () {
            this.player1.fightWith(this.pismire, this.ardentHero);
            expect(this.pismire.location).toBe('discard');
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should take damage from non-mutant, < 5 power creatures', function () {
            this.player1.fightWith(this.brambleLynx, this.ardentHero);
            expect(this.brambleLynx.location).toBe('play area');
            expect(this.brambleLynx.tokens.damage).toBeUndefined();
            expect(this.ardentHero.tokens.damage).toBe(3);
        });

        it('should take damage from bonus icon of creatures', function () {
            this.player1.play(this.sacroBeast);
            this.player1.clickCard(this.ardentHero);
            expect(this.ardentHero.tokens.damage).toBe(1);
        });

        it('should not take damage from play effect of >5 power creature', function () {
            this.player1.play(this.lupoTheScarred);
            this.player1.clickCard(this.ardentHero);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should not take damage from play effect of mutant creature', function () {
            this.player1.play(this.dinoBeast);
            this.player1.clickCard(this.dinoBeast);
            this.player1.clickCard(this.ardentHero);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should not take damage when fighting against a >=5 creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.fightWith(this.ardentHero, this.ancientBear);
            expect(this.ancientBear.tokens.damage).toBe(4);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should take damage when fighting against a <5 creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.fightWith(this.ardentHero, this.brambleLynx);
            expect(this.brambleLynx.location).toBe('discard');
            expect(this.ardentHero.tokens.damage).toBe(3);
        });
    });

    describe("Ardent Hero's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    inPlay: ['rock-hurling-giant', 'cowfyne', 'bingle-bangbang', 'mogghunter'],
                    hand: ['first-blood']
                },
                player2: {
                    amber: 4,
                    inPlay: ['ardent-hero', 'champion-anaphiel', 'shooler', 'borr-nit']
                }
            });
        });

        it('should take damage from action cards', function () {
            this.player1.play(this.firstBlood);
            this.player1.clickCard(this.ardentHero);
            this.player1.clickCard(this.ardentHero);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.shooler);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickCard(this.championAnaphiel);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.ardentHero.tokens.damage).toBe(2);
            expect(this.championAnaphiel.tokens.damage).toBe(2);
            expect(this.shooler.tokens.damage).toBe(3);
        });

        it('should not take damage from effect of >5 power creature', function () {
            this.player1.clickCard(this.firstBlood);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toBeAbleToSelect(this.rockHurlingGiant);
            this.player1.clickCard(this.rockHurlingGiant);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.ardentHero);
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
        });

        it('should not take before fight damage from >5 power creature', function () {
            this.player1.fightWith(this.cowfyne, this.championAnaphiel);
            expect(this.cowfyne.location).toBe('discard');
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
            expect(this.championAnaphiel.tokens.damage).toBe(4);
            expect(this.shooler.tokens.damage).toBe(2);
        });

        it('should take before fight damage from <5 power creature', function () {
            this.player1.fightWith(this.bingleBangbang, this.championAnaphiel);
            expect(this.bingleBangbang.location).toBe('discard');
            expect(this.ardentHero.location).toBe('discard');
            expect(this.championAnaphiel.tokens.damage).toBe(1);
            expect(this.shooler.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not take fight effect damage from >5 power creature', function () {
            this.player1.fightWith(this.mogghunter, this.borrNit);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.ardentHero);
            expect(this.borrNit.location).toBe('discard');
            expect(this.ardentHero.location).toBe('play area');
            expect(this.ardentHero.tokens.damage).toBeUndefined();
            expect(this.mogghunter.tokens.damage).toBe(3);
        });
    });
});
