fdescribe('Deusillus', function() {
    integration(function() {
        describe('Deusillus\'s Ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 2,
                        house: 'saurian',
                        inPlay: ['senator-shrix'],
                        hand: ['deusillus', 'deusillus-2']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['troll', 'narp', 'zorg']
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
            });

            it('and prevent playing if part 1 is not in player\'s hand', function() {
                this.player1.moveCard(this.deusillus, 'discard');
                this.player1.moveCard(this.deusillus2, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.deusillus.location).toBe('discard');
                expect(this.deusillus2.location).toBe('deck');
            });
            
            it('and play if part 1 is in player\'s hand', function() {
                this.player1.moveCard(this.deusillus2, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
                //expect(this.deusillus.location).toBe('discard');
                //expect(this.deusillus2.location).toBe('deck');
            });

            it('and play if part 2 is in player\'s hand', function() {
                this.player1.moveCard(this.deusillus, 'deck');
                this.player1.play(this.wildWormhole);
                expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
                //expect(this.deusillus.location).toBe('discard');
                //expect(this.deusillus2.location).toBe('deck');
            });
        });
    });
});
