var roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
    creep.say("H");
    if (creep.memory.target && creep.room.name != creep.memory.target) {
      // find exit to target room
      var exit = creep.room.findExitTo(creep.memory.target);
      // move to exit
      creep.moveTo(creep.pos.findClosestByPath(exit), { visualizePathStyle: { stroke: '#FFF' } });
      return;
    }
    if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
      creep.memory.harvesting = false;
      creep.say('🔄 filling');
    }
    if (!creep.memory.harvesting && creep.carry.energy == 0) {
      creep.memory.harvesting = true;
      creep.say('🚧 harvesting');
    }
    if (creep.memory.harvesting) {
      //var sources = creep.room.find(FIND_SOURCES);
      const droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
      if (droppedResource) {
        if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedResource);
        }
        return;
      }
      var closestSource = creep.room.find(FIND_SOURCES);
      closestSource = closestSource[creep.memory.mineSource];
      returnHarvest = creep.harvest(closestSource);
      if (returnHarvest == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#090' } });
      } else if (returnHarvest == ERR_NOT_ENOUGH_RESOURCES || returnHarvest == ERR_NO_PATH) {
        // sourceActive = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        // check if we can use id on the return
        // save id on the memory of the creep instead
        creep.memory.mineSource = (creep.memory.mineSource == 1) ? 0 : 1;
      }

    }
    else {
      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) => {
          return (
            s.structureType == STRUCTURE_EXTENSION ||
            s.structureType == STRUCTURE_SPAWN ||
            s.structureType == STRUCTURE_TOWER
            // || s.structureType == STRUCTURE_CONTAINER
          ) && s.energy < s.energyCapacity;
        }
      });
      //   console.log(JSON.stringify(target));
      //   sort(function(a,b) {
      //     if(a.structureType == 'spawn') {
      //         return 1;
      //     } return 0;
      //   });
      // console.log(JSON.stringify(creep.name));
      // console.log("target: ",JSON.stringify(target,undefined,2));
      if (target != null) {
        // console.log("A");
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // console.log("C");
          var result = creep.moveTo(target, { visualizePathStyle: { stroke: '#090' } });
          //   console.log(result);
        }
      } else {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (s) => {
            return (
              s.structureType == STRUCTURE_CONTAINER ||
              s.structureType == STRUCTURE_STORAGE
            ) && s.energy < s.energyCapacity;
          }
        });

        if (target != null) {
          if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // console.log("C");
            var result = creep.moveTo(target, { visualizePathStyle: { stroke: '#090' } });
            //   console.log(result);
          }
        }
        // if the creep can't find spawns, extensions
        // or storages and containers
        // it becomes a longDistanceBuilderUpgrader
        else {
          creep.memory.role = 'longDistanceBuilderUpgrader';
          creep.memory.target = 'E54N59';
        }
        // when we don't have anywhere to put our energy
        // we can act as upgraders
        // if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#900' } });
        // }
      }
    }
  }
};

module.exports = roleHarvester;