describe('Deusillus', function() {
    integration(function() {
        describe('Deusillus\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 2,
                        house: 'saurian',
                        inPlay: ['senator-shrix'],
                        hand: ['deusillus', 'deusillus-2', 'regrettable-meteor']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['troll', 'narp', 'zorg', 'collector-worm']
                    }
                });
            });

            it('should not be able to play with just part 1', function() {
                this.player1.moveCard(this.deusillus2, 'discard');
                this.player1.clickCard(this.deusillus);
                expect(this.player1).not.toHavePromptButton('Play this creature');
            });

            it('should not be able to play with just part 2', function() {
                this.player1.moveCard(this.deusillus, 'discard');
                this.player1.clickCard(this.deusillus2);
                expect(this.player1).not.toHavePromptButton('Play this creature');
            });

            it('should be able to play with path 1', function() {
                this.player1.clickCard(this.deusillus);
                expect(this.player1).toHavePromptButton('Play this creature');
            });

            it('should be able to play with part 2', function() {
                this.player1.clickCard(this.deusillus2);
                expect(this.player1).toHavePromptButton('Play this creature');
            });

            it('should play starting with part 1', function() {
                this.player1.play(this.deusillus);
                expect(this.player1).toBeAbleToSelect(this.narp);
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                this.player1.clickCard(this.narp);
                expect(this.narp.tokens.damage).toBe(4);
                expect(this.deusillus.amber).toBe(5);
                expect(this.deusillus.location).toBe('play area');
                expect(this.deusillus.playedParts).toContain(this.deusillus2);
            });

            it('should play starting with part 2', function() {
                this.player1.play(this.deusillus2);
                expect(this.player1).toBeAbleToSelect(this.narp);
                expect(this.player1).toBeAbleToSelect(this.zorg);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                this.player1.clickCard(this.narp);
                expect(this.narp.tokens.damage).toBe(4);
                expect(this.deusillus2.amber).toBe(5);
                expect(this.deusillus2.location).toBe('play area');
                expect(this.deusillus2.playedParts).toContain(this.deusillus);
            });

            it('should move both cards to discard after destroyed', function() {
                this.player1.play(this.deusillus);
                this.player1.clickCard(this.narp);
                this.player1.play(this.regrettableMeteor);
                expect(this.deusillus.location).toBe('discard');
                expect(this.deusillus2.location).toBe('discard');
                expect(this.player1.discard).toContain(this.deusillus);
                expect(this.player1.discard).toContain(this.deusillus2);
            });

            it('should be able to reap with the creature', function() {
                this.player1.play(this.deusillus);
                this.player1.clickCard(this.narp);
                this.deusillus.exhausted = false;
                this.player1.reap(this.deusillus);
                expect(this.deusillus.amber).toBe(4);
                expect(this.narp.tokens.damage).toBe(6);
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.zorg.tokens.damage).toBe(2);
            });

            it('should be able to fight with the creature', function() {
                this.player1.play(this.deusillus2);
                this.player1.clickCard(this.narp);
                this.deusillus2.exhausted = false;
                this.player1.fightWith(this.deusillus2, this.zorg);
                expect(this.deusillus2.tokens.damage).toBe(7);
                expect(this.zorg.location).toBe('discard');
                expect(this.deusillus2.amber).toBe(4);
                expect(this.narp.tokens.damage).toBe(6);
                expect(this.troll.tokens.damage).toBe(2);
            });

            it('should be archived completely', function() {
                this.collectorWorm.tokens.ward = 1;

                this.player1.play(this.deusillus);
                this.player1.clickCard(this.narp);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');

                this.player2.fightWith(this.collectorWorm, this.deusillus);
                expect(this.collectorWorm.tokens.ward).toBeUndefined();
                expect(this.deusillus.location).toBe('archives');
                expect(this.deusillus2.location).toBe('archives');
                expect(this.player2.archives).toContain(this.deusillus);
                expect(this.player2.archives).toContain(this.deusillus2);
            });
        });

        describe('Deusillus\'s Ability should interact with Wild Wormhole ', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 2,
                        house: 'logos',
                        inPlay: ['senator-shrix'],
                        hand: ['deusillus', 'deusillus-2', 'wild-wormhole']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['troll', 'narp', 'zorg']
                    }
                });
            });

            it('and prevent playing if part 2 is not in player\'s hand', function() {
                this.player1.moveCard(this.deusillus, 'deck');
                this.player1.moveCard(this.deusillus2, 'discard');
                this.player1.play(this.wildWormhole);
                expect(this.deusillus.location).toBe('deck');
                expect(this.deusillus2.location).toBe('discard');
                expect(this.player1).not.toHavePrompt('Which flank do you want to place this creature on?');
            });

            it('and prevent playing if part 1 is not in player\'s hand', function() {
                this.player1.moveCard(this.deusillus, 'discard');
                this.player1.moveCard(this.deusillus2, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.deusillus.location).toBe('discard');
                expect(this.deusillus2.location).toBe('deck');
                expect(this.player1).not.toHavePrompt('Which flank do you want to place this creature on?');
            });

            it('and prevent playing even if part 2 is in player\'s hand', function() {
                this.player1.moveCard(this.deusillus, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.deusillus.location).toBe('deck');
                expect(this.deusillus2.location).toBe('hand');
                expect(this.player1).not.toHavePrompt('Which flank do you want to place this creature on?');
            });

            it('and prevent playing even if part 1 is in player\'s hand', function() {
                this.player1.moveCard(this.deusillus2, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.deusillus.location).toBe('hand');
                expect(this.deusillus2.location).toBe('deck');
                expect(this.player1).not.toHavePrompt('Which flank do you want to place this creature on?');
            });
        });
    });
});
