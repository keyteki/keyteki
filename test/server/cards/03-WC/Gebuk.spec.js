describe('Gebuk', function () {
    describe('when destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bad-penny', 'gebuk', 'umbra'],
                    hand: ['regrowth', 'niffle-ape', 'bear-flute', 'niffle-kong']
                },
                player2: {
                    inPlay: ['valdr', 'troll', 'nexus']
                }
            });
        });

        describe('and the top card of the deck is an action', function () {
            beforeEach(function () {
                this.player1.moveCard(this.regrowth, 'deck');

                this.player1.fightWith(this.gebuk, this.troll);
            });

            it('should discard the top card of the deck', function () {
                expect(this.player1.discard).toContain(this.regrowth);
            });

            it('should not put anything into the battle line', function () {
                expect(this.player1.inPlay.length).toBe(2);
            });
        });

        describe('and the top card of the deck is an artifact', function () {
            beforeEach(function () {
                this.player1.moveCard(this.bearFlute, 'deck');

                this.player1.fightWith(this.gebuk, this.troll);
            });

            it('should discard the top card of the deck', function () {
                expect(this.player1.discard).toContain(this.bearFlute);
            });

            it('should not put anything into the battle line', function () {
                expect(this.player1.inPlay.length).toBe(2);
            });
        });

        describe('and the top card of the deck is a creature', function () {
            beforeEach(function () {
                this.player1.moveCard(this.niffleApe, 'deck');

                this.player1.fightWith(this.gebuk, this.troll);
            });

            it('should put that creature into play in the same position as gebuk was, exhausted', function () {
                expect(this.player1.inPlay.length).toBe(3);
                expect(this.player1.inPlay[1]).toBe(this.niffleApe);
                expect(this.player1.inPlay[1].exhausted).toBe(true);
            });
        });

        describe('and the top card of the deck is half of a gigantic creature', function () {
            beforeEach(function () {
                this.player1.moveCard(this.niffleKong, 'deck');

                this.player1.fightWith(this.gebuk, this.troll);
            });

            it('should discard the top card of the deck', function () {
                expect(this.player1.discard).toContain(this.niffleKong);
            });

            it('should not put anything into the battle line', function () {
                expect(this.player1.inPlay.length).toBe(2);
            });
        });
    });
});
