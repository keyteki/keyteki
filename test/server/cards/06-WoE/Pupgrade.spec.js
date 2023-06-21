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
                    inPlay: ['gub', 'headhunter']
                }
            });
        });

        it('should grant abilities', function () {
            this.player1.playUpgrade(this.pupgrade, this.helmsmanSpears);
            expect(this.helmsmanSpears.power).toBe(5);
            this.player1.fightWith(this.helmsmanSpears, this.headhunter);
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
            this.player2.fightWith(this.headhunter, this.helmsmanSpears);
            expect(this.helmsmanSpears.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[2].name).toBe('Pupgrade');
            expect(this.pupgrade.exhausted).toBe(false);
        });

        it("works in opponent's battleline", function () {
            this.player1.playUpgrade(this.pupgrade, this.gub);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.gub.power).toBe(4);
            this.player2.fightWith(this.gub, this.bumpsy);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.player.creaturesInPlay.length).toBe(2);
            expect(this.gub.location).toBe('discard');
            expect(this.pupgrade.location).toBe('play area');
            expect(this.pupgrade.controller.name).toBe('player2');
            expect(this.pupgrade.type).toBe('creature');
            expect(this.player2.player.creaturesInPlay[1].name).toBe('Pupgrade');
            expect(this.pupgrade.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
