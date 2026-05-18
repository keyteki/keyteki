describe('Spartasaur', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['spartasaur', 'dextre', 'troll', 'legatus-raptor', 'rhetor-gallim']
                },
                player2: {
                    inPlay: ['bad-penny', 'brain-eater']
                }
            });
        });

        describe('and fighting', function () {
            beforeEach(function () {
                this.player1.fightWith(this.spartasaur, this.badPenny);
            });

            it('should gain 2 amber', function () {
                expect(this.player1.amber).toBe(2);
            });
        });

        describe('and another friendly creature is destroyed', function () {
            beforeEach(function () {
                this.player1.fightWith(this.rhetorGallim, this.brainEater);
                this.player1.clickCard(this.spartasaur);
                this.player1.clickCard(this.dextre);
            });

            it('should destroy each non dinosaur creature', function () {
                expect(this.badPenny.location).toBe('hand');
                expect(this.troll.location).toBe('discard');
                expect(this.legatusRaptor.location).toBe('play area');
            });
        });
    });

    describe('with Tya-Arhĭ Esquire making tokens', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grunt',
                    inPlay: [
                        'spartasaur',
                        'legatus-raptor',
                        'tya-arhĭ-esquire',
                        'troll',
                        'rhetor-gallim'
                    ]
                },
                player2: {
                    inPlay: ['brain-eater']
                }
            });
        });

        it('should self-limit the chain of destructions', function () {
            // Wave 0: Rhetor Gallim is destroyed
            this.player1.fightWith(this.rhetorGallim, this.brainEater);
            expect(this.player1).toHavePrompt('Grunt');
            this.player1.clickPrompt('Right');
            expect(this.rhetorGallim.location).toBe('discard');
            expect(this.tyaArhĭEsquire.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(5);
            expect(this.player1).toHavePrompt(
                'Any reactions to Rhetor Gallim being destroyed or Rhetor Gallim being destroyed?'
            );
            expect(this.player1).toHavePromptButton('Autoresolve');

            // Wave 1: Spartasaur destroys Esquire and Troll
            this.player1.clickCard(this.spartasaur);
            expect(this.player1).toHavePrompt(
                'Any interrupts to Troll being destroyed or Tya-Arhĭ, Esquire being destroyed?'
            );
            expect(this.player1).toHavePromptButton('Autoresolve');
            this.player1.clickCard(this.tyaArhĭEsquire);
            expect(this.player1).toHavePrompt('Grunt');
            this.player1.clickPrompt('Right');
            expect(this.player1).toHavePrompt('Grunt');
            this.player1.clickPrompt('Right');
            expect(this.tyaArhĭEsquire.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.brainEater.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);

            // Wave 2: Spartasaur destroys new tokens
            expect(this.player1).toHavePrompt('Select a card to affect');
            expect(this.player1).toHavePromptButton('Autoresolve');
            this.player1.clickCard(this.troll);
            expect(this.spartasaur.location).toBe('play area');
            expect(this.legatusRaptor.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player2.player.creaturesInPlay.length).toBe(0);

            // Wave 3: Spartasaur destroys nothing so it ends here
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('and an enemy non-Dinosaur creature taken under friendly control is destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['spartasaur', 'legatus-raptor', 'troll'],
                    hand: ['enlist-numeri', 'saury-about-that']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it("should trigger Spartasaur's reaction", function () {
            this.bumpsy.amber = 1;
            this.player1.play(this.enlistNumeri);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Left');
            expect(this.bumpsy.controller).toBe(this.player1.player);

            this.player1.play(this.sauryAboutThat);
            this.player1.clickCard(this.bumpsy);

            // Bumpsy was controlled by player1 when destroyed, so Spartasaur reacts
            // and destroys Troll
            expect(this.bumpsy.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.spartasaur.location).toBe('play area');
            expect(this.legatusRaptor.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('and a friendly non-Dinosaur creature taken under enemy control is destroyed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['spartasaur', 'legatus-raptor', 'troll'],
                    hand: ['exile', 'saury-about-that']
                },
                player2: {
                    inPlay: ['brain-eater']
                }
            });
        });

        it("should not trigger Spartasaur's reaction", function () {
            this.player1.play(this.exile);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this.troll.controller).toBe(this.player2.player);

            this.player1.play(this.sauryAboutThat);
            this.player1.clickCard(this.troll);

            // Troll was controlled by player2 when destroyed, so Spartasaur does not
            // react and Brain Eater remains in play
            expect(this.troll.location).toBe('discard');
            expect(this.brainEater.location).toBe('play area');
            expect(this.spartasaur.location).toBe('play area');
            expect(this.legatusRaptor.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with a warded creature and simultaneous friendly deaths', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['spartasaur', 'bestiarii-urso', 'troll', 'crunch', 'badger'],
                    hand: ['crushing-charge']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should queue a separate reaction per simultaneous death and destroy the warded creature on the second wave', function () {
            this.troll.ward();

            // Crushing Charge destroys each creature with power 4 or less:
            // Crunch (power 2) and Badger (power 2) die simultaneously. Troll
            // (power 8) is unaffected. This queues two Spartasaur reactions.
            this.player1.play(this.crushingCharge);
            expect(this.crunch.location).toBe('discard');
            expect(this.badger.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.warded).toBe(true);

            // Resolve the two queued Spartasaur reactions.
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Autoresolve');
            this.player1.clickPrompt('Autoresolve');

            // Wave 1 of destruction: Troll is the only non-Dinosaur left. Its ward
            // absorbs the destruction, so it stays in play but unwarded.
            // Wave 2 of destruction: Troll is no longer warded and is destroyed.
            expect(this.troll.warded).toBe(false);
            expect(this.troll.location).toBe('discard');

            // Troll's death queues a third Spartasaur reaction, but no
            // non-Dinosaurs remain, so the chain terminates.
            expect(this.spartasaur.location).toBe('play area');
            expect(this.bestiariiUrso.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
