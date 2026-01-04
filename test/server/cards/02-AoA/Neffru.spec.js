describe('Neffru', function () {
    describe("Neffru's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: [
                        'ancient-yurk',
                        'neffru',
                        'ember-imp',
                        'harbinger-of-doom',
                        'obsidian-forge',
                        'daughter'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['doc-bookton', 'brain-eater', 'dysania', 'helper-bot', 'dodger'],
                    hand: ['harland-mindlock']
                }
            });
        });

        it('should cause the controller of a destroyed creature (opponent) to gain an amber', function () {
            this.player1.fightWith(this.ancientYurk, this.docBookton);
            expect(this.docBookton.location).toBe('discard');
            expect(this.ancientYurk.tokens.damage).toBe(5);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });

        it('should cause the controller of a destroyed creature (self) to gain an amber', function () {
            this.player1.fightWith(this.emberImp, this.docBookton);
            expect(this.emberImp.location).toBe('discard');
            expect(this.docBookton.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should not cause anyone to gain an amber when Neffru attacks and they both die', function () {
            this.player1.fightWith(this.neffru, this.dysania);
            expect(this.neffru.location).toBe('discard');
            expect(this.dysania.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not cause anyone to gain an amber when Neffru is attacked and they both die', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.dysania, this.neffru);
            expect(this.neffru.location).toBe('discard');
            expect(this.dysania.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should cause the owner of a destroyed creature to gain an amber when Neffru attacks and kills it', function () {
            this.player1.fightWith(this.neffru, this.helperBot);
            expect(this.neffru.location).toBe('play area');
            expect(this.helperBot.location).toBe('discard');
            expect(this.neffru.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });

        it('should cause the owner of a creature that changed controller and dies in a fight to gain an aember', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.harlandMindlock);
            this.player2.clickCard(this.daughter);
            this.player2.clickPrompt('Right');
            this.player2.fightWith(this.daughter, this.neffru);
            expect(this.neffru.location).toBe('play area');
            expect(this.daughter.location).toBe('discard');
            expect(this.neffru.tokens.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it("should not cause Neffru's owner to gain an amber when Neffru is destroyed", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.fightWith(this.brainEater, this.neffru);
            expect(this.neffru.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not trigger on a board wipe', function () {
            this.player1.useAction(this.obsidianForge);
            this.player1.clickCard(this.harbingerOfDoom);
            this.player1.clickPrompt('Done');
            expect(this.neffru.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should not trigger on a board wipe with harbinger', function () {
            this.neffru.ward();
            this.player1.useAction(this.obsidianForge);
            this.player1.clickCard(this.neffru);
            this.player1.clickCard(this.harbingerOfDoom);
            this.player1.clickPrompt('Done');
            expect(this.neffru.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should happen before a fight effect', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.dodger, this.emberImp);
            expect(this.player2).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });

        it('should not trigger if creature is warded', function () {
            this.helperBot.ward();
            this.player1.fightWith(this.neffru, this.helperBot);
            expect(this.neffru.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.neffru.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });
    });
});
