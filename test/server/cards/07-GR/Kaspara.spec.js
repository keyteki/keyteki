describe('Kaspara', function () {
    describe("Kaspara's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'geistoid',
                    hand: ['shadys'],
                    inPlay: ['kaspara', 'echofly']
                },
                player2: {
                    amber: 2,
                    inPlay: ['thing-from-the-deep', 'echofly']
                }
            });
            this.echofly2 = this.player2.player.creaturesInPlay[1];
        });

        it('sets its power at the combined amber total', function () {
            expect(this.kaspara.power).toBe(5);
            this.player1.reap(this.kaspara);
            expect(this.kaspara.power).toBe(6);
        });

        it('gives friendly geistoid creatures a play effect', function () {
            this.player1.playCreature(this.shadys);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('gives friendly geistoid creatures a destroyed effect', function () {
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            this.player1.fightWith(this.kaspara, this.echofly2);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });

        it('does not give play effects from the archive', function () {
            this.player1.moveCard(this.kaspara, 'archives');
            this.player1.playCreature(this.shadys);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });
    });
});
