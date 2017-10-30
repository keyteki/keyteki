const AbilityResolver = require('../../../server/game/gamesteps/abilityresolver.js');

describe('AbilityResolver', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getPlayers', 'markActionAsTaken', 'popAbilityContext', 'pushAbilityContext', 'raiseEvent', 'reportError', 'raiseInitiateAbilityEvent']);
        this.game.raiseEvent.and.callFake((name, params, handler) => {
            if(handler) {
                handler(params);
            }
        });
        this.ability = jasmine.createSpyObj('ability', ['isAction', 'isCardAbility', 'isPlayableEventAbility', 'resolveCosts', 'payCosts', 'resolveTargets', 'executeHandler']);
        this.ability.isCardAbility.and.returnValue(true);
        this.source = { source: 1 };
        this.player = { player: 1 };
        this.game.getPlayers.and.returnValue([this.player]);
        this.context = { foo: 'bar', player: this.player, source: this.source, ability: this.ability };
        this.resolver = new AbilityResolver(this.game, this.context);
    });

    describe('continue()', function() {
        describe('when the ability is an action', function() {
            beforeEach(function() {
                this.ability.isAction.and.returnValue(true);
                this.resolver.continue();
            });

            it('should mark that an action is being taken', function() {
                expect(this.game.markActionAsTaken).toHaveBeenCalled();
            });
        });

        describe('when all costs can be paid', function() {
            beforeEach(function() {
                this.targetResult = { resolved: true, name: 'foo', value: 'foo', costsFirst: false };
                this.ability.resolveTargets.and.returnValue([this.targetResult]);
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.resolver.continue();
            });

            it('should pay the costs', function() {
                expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
            });

            it('should execute the handler', function() {
                expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
            });

            it('should not raise the onCardPlayed event', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onCardPlayed', jasmine.any(Object));
            });
        });

        describe('when the ability is a card ability', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isPlayableEventAbility.and.returnValue(true);
                this.ability.isCardAbility.and.returnValue(true);
                this.resolver.continue();
            });

            it('should raise the InitiateAbility event', function() {
                expect(this.game.raiseInitiateAbilityEvent).toHaveBeenCalledWith({ player: this.player, source: this.source, resolver: jasmine.any(Object), targets: [] });
            });
        });

        describe('when the ability is not a card ability', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isPlayableEventAbility.and.returnValue(true);
                this.ability.isCardAbility.and.returnValue(false);
                this.resolver.continue();
            });

            it('should not raise the onCardAbilityInitiated event', function() {
                expect(this.game.raiseEvent).not.toHaveBeenCalledWith('onCardAbilityInitiated', jasmine.any(Object), jasmine.any(Function));
            });
        });
        /*
        describe('when the ability is an event being played', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: true }]);
                this.ability.isPlayableEventAbility.and.returnValue(true);
                this.resolver.continue();
            });

            it('should raise the onCardPlayed event', function() {
                expect(this.game.raiseEvent).toHaveBeenCalledWith('onCardPlayed', jasmine.any(Object));
            });
        });
        */
        describe('when not all costs can be paid', function() {
            beforeEach(function() {
                this.ability.resolveCosts.and.returnValue([{ resolved: true, value: true }, { resolved: true, value: false }]);
                this.resolver.continue();
            });

            it('should not pay the costs', function() {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });
        });

        describe('when a cost cannot be immediately resolved', function() {
            beforeEach(function() {
                this.canPayResult = { resolved: false };
                this.ability.resolveCosts.and.returnValue([this.canPayResult]);
                this.resolver.continue();
            });

            it('should not pay the costs', function() {
                expect(this.ability.payCosts).not.toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the costs have resolved', function() {
                beforeEach(function() {
                    this.canPayResult.resolved = true;
                });

                describe('and the cost could be paid', function() {
                    beforeEach(function() {
                        this.canPayResult.value = true;
                        this.resolver.continue();
                    });

                    it('should pay the costs', function() {
                        expect(this.ability.payCosts).toHaveBeenCalledWith(this.context);
                    });

                    it('should execute the handler', function() {
                        expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                    });
                });

                describe('and the cost could not be paid', function() {
                    beforeEach(function() {
                        this.canPayResult.value = false;
                        this.resolver.continue();
                    });

                    it('should not pay the costs', function() {
                        expect(this.ability.payCosts).not.toHaveBeenCalled();
                    });

                    it('should not execute the handler', function() {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when there are targets that need to be resolved', function() {
            beforeEach(function() {
                this.targetResult = { resolved: false, name: 'foo', value: null, costsFirst: true };
                this.ability.resolveTargets.and.returnValue([this.targetResult]);
                this.resolver.continue();
            });

            it('should pay the costs', function() {
                expect(this.ability.payCosts).toHaveBeenCalled();
            });

            it('should not execute the handler', function() {
                expect(this.ability.executeHandler).not.toHaveBeenCalled();
            });

            describe('when the targets have resolved', function() {
                beforeEach(function() {
                    this.targetResult.resolved = true;
                });

                describe('and the targets were chosen', function() {
                    beforeEach(function() {
                        this.target = { foo: 'bar' };
                        this.targetResult.value = this.target;
                    });

                    describe('and the target name is arbitrary', function() {
                        beforeEach(function() {
                            this.targetResult.name = 'foo';
                            this.resolver.continue();
                        });

                        it('should add the target to context.targets', function() {
                            expect(this.context.targets.foo).toBe(this.target);
                        });

                        it('should not add the target directly to context', function() {
                            expect(this.context.target).toBeUndefined();
                        });

                        it('should execute the handler', function() {
                            expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                        });
                    });

                    describe('and the target name is "target"', function() {
                        beforeEach(function() {
                            this.targetResult.name = 'target';
                            this.resolver.continue();
                        });

                        it('should add the target to context.targets', function() {
                            expect(this.context.targets.target).toBe(this.target);
                        });

                        it('should add the target directly to context', function() {
                            expect(this.context.target).toBe(this.target);
                        });

                        it('should execute the handler', function() {
                            expect(this.ability.executeHandler).toHaveBeenCalledWith(this.context);
                        });
                    });
                });

                describe('and the targets were not chosen', function() {
                    beforeEach(function() {
                        this.targetResult.value = null;
                        this.resolver.continue();
                    });

                    it('should not execute the handler', function() {
                        expect(this.ability.executeHandler).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when an exception occurs', function() {
            beforeEach(function() {
                this.error = new Error('something bad');
                this.ability.resolveCosts.and.callFake(() => {
                    throw this.error;
                });
            });

            it('should not propogate the error', function() {
                expect(() => this.resolver.continue()).not.toThrow();
            });

            it('should return true to complete the resolver pipeline', function() {
                expect(this.resolver.continue()).toBe(true);
            });

            it('should report the error', function() {
                this.resolver.continue();
                expect(this.game.reportError).toHaveBeenCalledWith(jasmine.any(Error));
            });

            describe('when the current ability context is for this ability', function() {
                beforeEach(function() {
                    this.game.currentAbilityContext = { source: 'card', card: this.context.source };
                });

                it('should pop the current context', function() {
                    this.resolver.continue();
                    expect(this.game.popAbilityContext).toHaveBeenCalled();
                });
            });
        });
    });
});
