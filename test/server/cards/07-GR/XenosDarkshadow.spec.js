describe('Xenos Darkshadow', function () {
    describe("Xenos Darkshadow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['xenos-darkshadow', 'storm-surge'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['kelifi-dragon', 'thing-from-the-deep', 'troll']
                }
            });
            this.player1.chains = 36;
        });

        it('cannot live if you have an empty discard', function () {
            this.player1.player.discard = [];
            this.player1.playCreature(this.xenosDarkshadow);
            expect(this.xenosDarkshadow.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('has power equal to the discard length', function () {
            this.player1.playCreature(this.xenosDarkshadow);
            expect(this.xenosDarkshadow.power).toBe(9);
        });

        it('has armor equal to the discard length', function () {
            this.player1.playCreature(this.xenosDarkshadow);
            expect(this.xenosDarkshadow.armor).toBe(9);
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.playCreature(this.xenosDarkshadow);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('unfathomable');
            });

            it('has assault equal to the discard length', function () {
                this.player1.fightWith(this.xenosDarkshadow, this.thingFromTheDeep);
                expect(this.thingFromTheDeep.tokens.damage).toBe(18);
            });

            it('has hazardous equal to the discard length', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('unfathomable');
                this.player2.fightWith(this.thingFromTheDeep, this.xenosDarkshadow);
                expect(this.thingFromTheDeep.tokens.damage).toBe(18);
            });

            it('has splash-attack equal to the discard length', function () {
                this.player1.fightWith(this.xenosDarkshadow, this.thingFromTheDeep);
                expect(this.kelifiDragon.tokens.damage).toBe(9);
                expect(this.troll.location).toBe('discard');
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.xenosDarkshadow, this.thingFromTheDeep);
                expect(this.xenosDarkshadow.location).toBe('discard');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.stormSurge);
                this.player1.fightWith(this.xenosDarkshadow, this.thingFromTheDeep);
                expect(this.xenosDarkshadow.location).toBe('archives');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
