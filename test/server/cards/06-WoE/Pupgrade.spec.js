describe('Pupgrade', function () {
    describe("Pupgrade's creature ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['pupgrade'],
                    inPlay: ['helmsman-spears', 'pelf', 'bumpsy']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['hypnobeam']
                }
            });
        });

        it('should grant abilities', function () {
            this.player1.playUpgrade(this.pupgrade, this.helmsmanSpears);
            expect(this.helmsmanSpears.power).toBe(5);
            this.player1.fightWith(this.helmsmanSpears, this.troll);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[2].name).toBe('Pupgrade');
            this.player1.reap(this.pupgrade);
        });

        it("works on opponent's turn", function () {
            this.player1.playUpgrade(this.pupgrade, this.helmsmanSpears);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.helmsmanSpears);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[2].name).toBe('Pupgrade');
            expect(this.pupgrade.exhausted).toBe(false);
        });

        it("works in opponent's battleline", function () {
            this.player1.playUpgrade(this.pupgrade, this.helmsmanSpears);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.helmsmanSpears);
            this.player2.clickPrompt('Right');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            this.player1.fightWith(this.bumpsy, this.helmsmanSpears);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player2.player.creaturesInPlay.length).toBe(2);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.controller.name).toBe('player2');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player2.player.creaturesInPlay[1].name).toBe('Pupgrade');
            expect(this.pupgrade.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
