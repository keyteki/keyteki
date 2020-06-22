describe('Sample Collection', function () {
    describe("Sample Collection's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['batdrone'],
                    hand: ['sample-collection', 'phase-shift', 'labwork', 'wild-wormhole']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'hebe-the-huge', 'tantadlin']
                }
            });
            this.player1.play(this.phaseShift);
            this.player1.play(this.labwork);
            this.player1.clickCard(this.wildWormhole);
        });

        it('should do nothing when the opponent has 0 keys', function () {
            this.player2.player.keys = { red: false, blue: false, yellow: false };
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.play(this.sampleCollection);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt to choose a creature and archive it when the opponent has 1 key', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.play(this.sampleCollection);
            expect(this.player1).toHavePrompt('Sample Collection');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.hebeTheHuge);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt to choose two creatures and archive them sequentially when the opponent has 2 keys', function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.play(this.sampleCollection);
            expect(this.player1).toHavePrompt('Sample Collection');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.hebeTheHuge);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            expect(this.player1).toHavePrompt('Sample Collection');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.hebeTheHuge);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.archives).toContain(this.bumpsy);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should return creatures to the opponents hand when you pick up your archives', function () {
            this.player2.player.keys = { red: true, blue: true, yellow: false };
            this.player1.play(this.sampleCollection);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.bumpsy);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt('Access Archives');
            this.player1.clickPrompt('Yes');
            expect(this.bumpsy.location).toBe('hand');
            expect(this.player2.hand).toContain(this.bumpsy);
            expect(this.troll.location).toBe('hand');
            expect(this.player2.hand).toContain(this.troll);
            expect(this.wildWormhole.location).toBe('hand');
            expect(this.player1.hand).toContain(this.wildWormhole);
        });
    });
    describe("Sample Collection's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['sample-collection'],
                    inPlay: ['batdrone']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'hebe-the-huge', 'tantadlin']
                }
            });
        });
        it('should return creatures to the opponents hand when removed from archives by tantadlin', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.play(this.sampleCollection);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            expect(this.troll.location).toBe('archives');
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.tantadlin, this.batdrone);
            expect(this.player2.hand).toContain(this.troll);
        });
    });
});
