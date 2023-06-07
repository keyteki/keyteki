describe('Blorb Hive', function () {
    describe("Blorb Hive's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    token: 'blorb',
                    house: 'mars',
                    inPlay: ['blorb-hive', 'pelf'],
                    deck: [
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad',
                        'toad'
                    ]
                },
                player2: {
                    hand: ['sneklifter'],
                    token: 'b0-t',
                    inPlay: ['umbra'],
                    deck: ['bad-penny', 'bad-penny']
                }
            });
        });

        it('should destroy a friendly creature to create two blorbs', function () {
            this.player1.useAction(this.blorbHive, true);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Left');
            expect(this.pelf.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.player.creaturesInPlay[0].name).toBe('Blorb');
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Blorb');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should forge a key if there are at least 10 blorbs', function () {
            // Start with 7 blorbs.
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.makeTokenCreature();
            this.player1.useAction(this.blorbHive, true);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');

            // Only 9, no key yet.
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            this.player1.useAction(this.blorbHive, true);
            this.player1.clickCard(this.player1.player.creaturesInPlay[0]);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.blorbHive.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not let opponent make blorbs with no blorb token', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.sneklifter, true);
            this.player2.clickCard(this.blorbHive);
            this.player2.useAction(this.blorbHive, true);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).toBeAbleToSelect(this.sneklifter);
            expect(this.player2).not.toBeAbleToSelect(this.pelf);
            this.player2.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
