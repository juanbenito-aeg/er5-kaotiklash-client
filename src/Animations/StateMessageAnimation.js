import Animation from './Animation.js';
import { AnimationTypeID } from '../Game/constants.js';

export default class StateMessageAnimation extends Animation {
    #stateMessage;
    #phisics;

    constructor(stateMessage, phisics) {
        super();
        this.#stateMessage = stateMessage;
        this.#phisics = phisics;
    }
    
    static create(stateMessage, phisics) {
        return new StateMessageAnimation(stateMessage, phisics);
    }

    execute(stateMessage) {
    type = stateMessage.getAnimationType();

        switch (type) {
            case AnimationTypeID.DAMAGE:
                damageAnimation(stateMessage);
                break;

            case AnimationTypeID.EFFECT:
                effectAnimation(stateMessage);
                break;
                
            case AnimationTypeID.HEAL:
                healAnimation(stateMessage);
                break;
                    
            case AnimationTypeID.ATTACK:
                attackAnimation(stateMessage);
                break;

            case AnimationTypeID.PARRY:
                parryAnimation(stateMessage);
                break;
                
            case AnimationTypeID.CRIT:
                critAnimation(stateMessage);
                break;

            case AnimationTypeID.FUMBLE:
                fumbleAnimation(stateMessage);
                break;

            case AnimationTypeID.BROKEN:
                brokenAnimation(stateMessage);
                break;

            case AnimationTypeID.DEATH:
                deathAnimation(stateMessage);
                break;

            case AnimationTypeID.BOOST:
                boostAnimation(stateMessage);
                break;

            case AnimationTypeID.DEBUFF:
                debuffAnimation(stateMessage);
                break;

            default:
                console.error('Unknown animation type:', type);
        }
    }

    attackAnimation(stateMessage) {
        
    }

    damageAnimation(stateMessage) {
        
    }

    healAnimation(stateMessage) {
        
    }

    effectAnimation(stateMessage) {
        
    }

    parryAnimation(stateMessage) {
        
    }

    critAnimation(stateMessage) {
        
    }

    fumbleAnimation(stateMessage) {
        
    }

    brokenAnimation(stateMessage) {
        
    }

    deathAnimation(stateMessage) {
        
    }

    boostAnimation(stateMessage) {
        
    }

    debuffAnimation(stateMessage) {
        
    }
}