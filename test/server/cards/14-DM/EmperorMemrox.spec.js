describe('Emperor Memrox', function () {
    describe("Emperor Memrox's reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['emperor-memrox'],
                    hand: ['urchin', 'troll']
                },
                player2: {
                    archives: ['krump', 'bumpsy']
                }
            });
        });

        it('archives a card on reap and gains 1 amber per archived card', function () {
            this.player1.reap(this.emperorMemrox);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.krump.location).toBe('archives');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains 1 reap + 2 amber for the two archived cards', function () {
            this.player1.moveCard(this.troll, 'archives');
            this.player1.reap(this.emperorMemrox);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains only the reap amber when no cards are in hand to archive', function () {
            for (const card of this.player1.player.hand.slice()) {
                this.player1.moveCard(card, 'discard');
            }
            this.player1.reap(this.emperorMemrox);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('still gains 1 amber per archived card when no cards are in hand to archive', function () {
            this.player1.moveCard(this.troll, 'archives');
            for (const card of this.player1.player.hand.slice()) {
                this.player1.moveCard(card, 'discard');
            }
            expect(this.player1.player.archives.length).toBe(1);
            this.player1.reap(this.emperorMemrox);
            // 1 reap amber + 1 amber for the card already in archives
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Emperor Memrox's invulnerable in center", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['emperor-memrox']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('is invulnerable while alone in the battleline (in center)', function () {
            expect(this.emperorMemrox.isInCenter()).toBe(true);
            expect(this.emperorMemrox.hasKeyword('invulnerable')).toBe(true);
            this.player1.fightWith(this.emperorMemrox, this.troll);
            expect(this.emperorMemrox.location).toBe('play area');
            expect(this.emperorMemrox.damage).toBe(0);
            expect(this.troll.damage).toBe(this.emperorMemrox.power);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Emperor Memrox not in the center', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['emperor-memrox', 'urchin']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('is not invulnerable when not in the center of an even battleline', function () {
            expect(this.emperorMemrox.isInCenter()).toBe(false);
            expect(this.emperorMemrox.hasKeyword('invulnerable')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
