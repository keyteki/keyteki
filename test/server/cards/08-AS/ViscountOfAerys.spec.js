describe('Viscount of Aerys', function () {
    describe("Viscount of Aerys's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'skyborn',
                    hand: ['viscount-of-aerys', 'bosun-creen'],
                    inPlay: ['charette']
                },
                player2: {
                    inPlay: ['dust-pixie', 'hunting-witch'],
                    hand: ['mushroom-man']
                }
            });
        });

        it('should do nothing if yellow key is unforged', function () {
            this.player1.playCreature(this.viscountOfAerys);
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.huntingWitch.stunned).toBe(false);
            expect(this.charette.stunned).toBe(false);
            expect(this.viscountOfAerys.stunned).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.mushroomMan);
            expect(this.mushroomMan.stunned).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should stun enemy creatures on play if yellow key is unforged', function () {
            this.player1.player.keys = { yellow: true, blue: false, red: false };
            this.player1.playCreature(this.viscountOfAerys);
            expect(this.dustPixie.stunned).toBe(true);
            expect(this.huntingWitch.stunned).toBe(true);
            expect(this.charette.stunned).toBe(false);
            expect(this.viscountOfAerys.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should cause enemy creatures to enter plan stunned when yellow key is forged', function () {
            this.player1.playCreature(this.viscountOfAerys);
            this.player1.player.keys = { yellow: true, blue: false, red: false };
            this.player1.playCreature(this.bosunCreen);
            expect(this.bosunCreen.stunned).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.mushroomMan);
            expect(this.mushroomMan.stunned).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
