describe('Praefectus Ludo', function () {
    describe("Praefectus Ludo's gained Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['praefectus-ludo', 'crassosaurus']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('moves all amber from a destroyed friendly creature to the common supply', function () {
            this.crassosaurus.amber = 3;
            this.player1.fightWith(this.crassosaurus, this.troll);
            expect(this.crassosaurus.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not remove amber from Praefectus Ludo when it dies', function () {
            this.praefectusLudo.amber = 2;
            this.player1.fightWith(this.praefectusLudo, this.troll);
            expect(this.praefectusLudo.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with two Praefectus Ludos in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['praefectus-ludo', 'praefectus-ludo']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.firstLudo = this.player1.player.creaturesInPlay[0];
            this.secondLudo = this.player1.player.creaturesInPlay[1];
        });

        it('removes amber from a dying Ludo via the other Ludo', function () {
            this.firstLudo.amber = 2;
            this.player1.fightWith(this.firstLudo, this.troll);
            expect(this.firstLudo.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
