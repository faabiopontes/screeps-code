var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var signText = "I just learned how to do this! Have mercy!";

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('🚧 upgrading');
        }

        if (!creep.memory.upgrading) {
            // const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            // if (target) {
            //     if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(target);
            //     }
            // } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[creep.memory.mineSource]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.mineSource], { visualizePathStyle: { stroke: '#900' } });
                }
                // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#900' } });
                // }
            // }
        }
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#900' } });
            }
        }
        if(creep.room.controller.sign.text != signText) {
            if(creep.signController(creep.room.controller, signText) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;