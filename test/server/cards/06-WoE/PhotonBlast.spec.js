describe('Photon Blast', function () {
    describe("Photon Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    token: 'grumpus',
                    inPlay: ['batdrone', 'helmsman-spears'],
                    hand: ['photon-blast']
                },
                player2: {
                    inPlay: ['urchin', 'hunting-witch', 'troll', 'bumpsy', 'dust-pixie']
                }
            });
        });

        it('should do 2 damage with 1 splash', function () {
            this.player1.play(this.photonBlast);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.bumpsy.tokens.damage).toBe(1);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.urchin.tokens.damage).toBe(undefined);
            expect(this.urchin.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('should make one token if something is killed', function () {
            this.player1.play(this.photonBlast);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Right');
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
        });

        it('should make one token if two enemy creatures are killed', function () {
            this.player1.play(this.photonBlast);
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickPrompt('Right');
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
        });

        it('should make one token if something is killed by splash', function () {
            this.player1.play(this.photonBlast);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Right');
            expect(this.bumpsy.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
        });
    });
});
