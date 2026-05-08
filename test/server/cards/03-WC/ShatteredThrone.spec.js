describe('Shattered Throne', function () {
    describe('Shattered Throne Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'brobnar',
                    inPlay: [
                        'brammo',
                        'shorty',
                        'ganger-chieftain',
                        'foozle',
                        'groke',
                        'culf-the-quiet',
                        'shattered-throne'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth', 'gamgee', 'krump', 'troll']
                }
            });
        });

        it('should capture an amber after fight and survive', function () {
            this.player1.fightWith(this.brammo, this.silvertooth);
            expect(this.brammo.amber).toBe(1);
            expect(this.silvertooth.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should capture an amber after fighting an elusive', function () {
            this.player1.fightWith(this.brammo, this.gamgee);
            expect(this.brammo.amber).toBe(1);
            expect(this.gamgee.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
        });

        it('should capture an amber after killing by assault', function () {
            this.player1.fightWith(this.shorty, this.gamgee);
            expect(this.shorty.amber).toBe(1);
            expect(this.gamgee.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
        });

        it('should also be applicable for opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.gamgee, this.culfTheQuiet);
            expect(this.gamgee.amber).toBe(1);
            expect(this.culfTheQuiet.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
        });

        describe('when there is a fight ability, it should be simultaneous', function () {
            beforeEach(function () {
                this.player2.amber = 1;
                this.player1.fightWith(this.groke, this.gamgee);
                expect(this.player1).toBeAbleToSelect(this.shatteredThrone);
                expect(this.player1).toBeAbleToSelect(this.groke);
            });

            it('should allow selecting Shattered Throne first', function () {
                this.player1.clickCard(this.shatteredThrone);
                expect(this.groke.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
            });

            it('should allow selecting Shattered Throne second', function () {
                this.player1.clickCard(this.groke);
                expect(this.groke.amber).toBe(0);
                expect(this.player2.amber).toBe(0);
            });
        });
    });

    describe('Shattered Throne Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'saurian',
                    hand: ['praefectus-ludo'],
                    inPlay: ['crassosaurus', 'odoac-the-patrician']
                },
                player2: {
                    amber: 3,
                    inPlay: ['silvertooth', 'gamgee', 'krump', 'troll', 'shattered-throne']
                }
            });
        });

        it('should not capture amber after fight if it does not survive', function () {
            this.player1.play(this.praefectusLudo);
            this.player1.fightWith(this.odoacThePatrician, this.troll);
            expect(this.odoacThePatrician.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });
});
