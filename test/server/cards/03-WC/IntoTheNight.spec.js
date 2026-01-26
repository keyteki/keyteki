describe('Into the Night', function () {
    describe("Into the Night's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 't3r-35a', 'tantadlin'],
                    hand: ['into-the-night']
                },
                player2: {
                    inPlay: ['krump'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });

        it('prevent own non-shadows creatures from fighting until the start of their next turn', function () {
            this.player1.play(this.intoTheNight);
            this.player1.clickCard(this.t3r35a);
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
        });

        it('prevent enemy non-shadows creatures from fighting until the start of their next turn', function () {
            this.player1.play(this.intoTheNight);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
        });
    });

    describe("Into the Night's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin'],
                    hand: ['into-the-night']
                },
                player2: {
                    inPlay: ['krump', 'bad-penny'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });

        it('allow own shadows creatures to fight', function () {
            this.player1.play(this.intoTheNight);
            this.player1.fightWith(this.aVinda, this.badPenny);
            expect(this.aVinda.damage).toBe(1);
        });

        it('allow opponent shadows creatures to fight', function () {
            this.player1.play(this.intoTheNight);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.badPenny, this.aVinda);
            expect(this.aVinda.damage).toBe(1);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'shadows',
                    hand: ['into-the-night'],
                    inPlay: ['tachyon-manifold', 'dodger']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['teliga']
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'shadows');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should not affect opponent's next turn", function () {
            this.player1.play(this.intoTheNight);
            this.player1.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.teliga, this.dodger);
            expect(this.dodger.damage).toBe(3);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
