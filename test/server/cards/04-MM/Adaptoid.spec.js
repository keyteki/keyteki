describe('Adaptoid', function () {
    describe("Adaptoid's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    inPlay: ['adaptoid'],
                    hand: [
                        'archimedes',
                        'data-forge',
                        'hologrammophone',
                        'backup-copy',
                        'dimension-door'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'code-monkey', 'brain-eater'],
                    hand: ['whistling-darts']
                }
            });

            this.archimedes.cardData.enhancements = ['draw'];
        });

        it('after playing a card without bonus icon, should not prompt for effect', function () {
            this.player1.play(this.dimensionDoor);
            expect(this.adaptoid.getKeywordValue('assault')).toBe(0);
            expect(this.adaptoid.armor).toBe(0);
            this.player1.fightWith(this.adaptoid, this.lamindra);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('after playing an action card with bonus icon, should be prompted for options', function () {
            this.player1.play(this.dataForge);
            expect(this.player1).toHavePrompt('Select one');
            this.player1.clickPrompt('+2 armor');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(0);
            expect(this.adaptoid.armor).toBe(2);
            this.player1.fightWith(this.adaptoid, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('after playing an upgrade card with bonus icon, should be prompted for options', function () {
            this.player1.playUpgrade(this.backupCopy, this.adaptoid);
            expect(this.player1).toHavePrompt('Select one');
            this.player1.clickPrompt('Assault 2');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(2);
            expect(this.adaptoid.armor).toBe(0);
            this.player1.fightWith(this.adaptoid, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('after playing a creature card with bonus icon, should be prompted for options', function () {
            this.player1.play(this.archimedes);
            expect(this.player1).toHavePrompt('Select one');
            this.player1.clickPrompt('Fight: Steal 1 amber');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(0);
            expect(this.adaptoid.armor).toBe(0);
            this.player1.fightWith(this.adaptoid, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('armor effects should stack', function () {
            this.player1.play(this.archimedes);
            this.player1.clickPrompt('+2 armor');
            this.player1.play(this.hologrammophone);
            this.player1.clickPrompt('+2 armor');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(0);
            expect(this.adaptoid.armor).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('assault effects should stack', function () {
            this.player1.play(this.archimedes);
            this.player1.clickPrompt('Assault 2');
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('Assault 2');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(4);
            expect(this.adaptoid.armor).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('fight effects should stack', function () {
            this.player1.play(this.archimedes);
            this.player1.clickPrompt('Fight: Steal 1 amber');
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('Fight: Steal 1 amber');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(0);
            expect(this.adaptoid.armor).toBe(0);
            this.player1.fightWith(this.adaptoid, this.lamindra);
            this.player1.clickCard(this.adaptoid);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('different effects should stack', function () {
            this.player1.play(this.archimedes);
            this.player1.clickPrompt('Fight: Steal 1 amber');
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('+2 armor');
            this.player1.play(this.hologrammophone);
            this.player1.clickPrompt('+2 armor');
            this.player1.playUpgrade(this.backupCopy, this.adaptoid);
            this.player1.clickPrompt('Assault 2');
            expect(this.adaptoid.getKeywordValue('assault')).toBe(2);
            expect(this.adaptoid.armor).toBe(4);
            this.player1.fightWith(this.adaptoid, this.brainEater);
            expect(this.brainEater.location).toBe('discard');
            expect(this.adaptoid.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should last for one turn only', function () {
            this.player1.play(this.archimedes);
            this.player1.clickPrompt('Fight: Steal 1 amber');
            this.player1.play(this.dataForge);
            this.player1.clickPrompt('+2 armor');
            this.player1.play(this.hologrammophone);
            this.player1.clickPrompt('+2 armor');
            this.player1.playUpgrade(this.backupCopy, this.adaptoid);
            this.player1.clickPrompt('Assault 2');

            expect(this.adaptoid.getKeywordValue('assault')).toBe(2);
            expect(this.adaptoid.armor).toBe(4);

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            expect(this.adaptoid.getKeywordValue('assault')).toBe(0);
            expect(this.adaptoid.armor).toBe(0);
            this.player1.fightWith(this.adaptoid, this.lamindra);
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should not trigger during opponent's turn", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.whistlingDarts);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
