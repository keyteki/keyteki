describe('Memrox the Red', function () {
    describe("Memrox the Red's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: [
                        'memrox-the-red',
                        'uxlyx-the-zookeeper',
                        'prof-garwynne',
                        'project-zyx'
                    ],
                    archives: ['pelf']
                },
                player2: {
                    amber: 5,
                    inPlay: ['bumpsy', 'troll']
                }
            });
        });

        it('should not let opponent cards leave their archives', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.archives.length).toBe(2);
            expect(this.bumpsy.location).toBe('archives');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.clickPrompt('Yes');
            expect(this.pelf.location).toBe('hand');
            expect(this.bumpsy.location).toBe('archives');
            this.player1.fightWith(this.memroxTheRed, this.troll);
            expect(this.memroxTheRed.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.clickPrompt('Yes');
            expect(this.bumpsy.location).toBe('hand');
        });

        it('should not return opponent cards to hand', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.bumpsy);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('No');
            this.player1.reap(this.profGarwynne);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player2.archives.length).toBe(0);
            expect(this.player1.archives.length).toBe(2);
        });

        it('should not play opponent cards from archive', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.bumpsy);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('No');
            this.player1.reap(this.projectZyx);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player2.archives.length).toBe(0);
            expect(this.player1.archives.length).toBe(2);
            expect(this.player2.amber).toBe(5);
        });

        it('should gain amber for each card in their archives', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.archives.length).toBe(2);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.amber).toBe(2);
            this.player1.useAction(this.memroxTheRed);
            expect(this.player1.amber).toBe(4);
        });
    });

    describe("Memrox the Red prevents discarding and purging opponent's archived cards", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['memrox-the-red', 'uxlyx-the-zookeeper'],
                    hand: ['gone-pear-shaped', 'destructive-analysis']
                },
                player2: {
                    inPlay: ['bumpsy', 'troll']
                }
            });
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.bumpsy.owner).toBe(this.player2.player);
            expect(this.bumpsy.controller).toBe(this.player1.player);
        });

        it("does not let Destructive Analysis purge opponent's archived card", function () {
            this.player1.play(this.destructiveAnalysis);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.player.purged).not.toContain(this.bumpsy);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it("does not let Gone Pear Shaped discard opponent's archived card", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.clickPrompt('No');
            this.player1.play(this.gonePearShaped);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.player.discard).not.toContain(this.bumpsy);
        });
    });
});
