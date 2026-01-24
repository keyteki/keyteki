describe('Badger', function () {
    describe("Badger's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['badger', 'shorty', 'culf-the-quiet', 'rant-and-rive'],
                    inPlay: ['foozle', 'martian-propagandist']
                },
                player2: {
                    inPlay: ['troll', 'flaxia', 'silvertooth']
                }
            });
        });

        it('should deal 3 damage to enemy creature after playing Brobnar creature on play', function () {
            this.player1.play(this.badger);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            this.player1.play(this.shorty);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).not.toBeAbleToSelect(this.shorty);
            expect(this.player1).not.toBeAbleToSelect(this.foozle);
            expect(this.player1).not.toBeAbleToSelect(this.badger);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not trigger for action cards', function () {
            this.player1.play(this.badger);
            this.player1.clickCard(this.troll);
            this.player1.play(this.rantAndRive);
            expect(this.player1).isReadyToTakeAction();
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.flaxia.tokens.damage).toBeUndefined();
        });

        it('should trigger multiple times for multiple Brobnar creatures', function () {
            this.player1.play(this.badger);
            this.player1.clickCard(this.troll);
            this.player1.play(this.shorty);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(6);

            this.player1.play(this.culfTheQuiet);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should trigger after reaping', function () {
            this.player1.moveCard(this.badger, 'play area');
            this.badger.ready();
            this.player1.reap(this.badger);
            this.player1.play(this.shorty);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not trigger if effect changes house before resolving', function () {
            this.martianPropagandist.enhancements = ['brobnar'];
            this.player1.reap(this.martianPropagandist);
            // Propagandist immediately changes Badger's house to Mars before resolving Badger's after play ability
            this.player1.playCreature(this.badger);
            expect(this.badger.hasHouse('mars')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
