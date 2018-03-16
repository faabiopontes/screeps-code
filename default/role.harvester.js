var roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
    Game.spawns['Spawn1'].memory.harvesterTicksToLive = creep.ticksToLive;
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
        var closestSource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#090' } });
        }
    }
    else {
      var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN
          ) && structure.energy < structure.energyCapacity;
        }
      });
        //   console.log(JSON.stringify(targets));
    //   sort(function(a,b) {
    //     if(a.structureType == 'spawn') {
    //         return 1;
    //     } return 0;
    //   });
      if (targets != null) {
        if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets, { visualizePathStyle: { stroke: '#090' } });
        }
      } else {
          creep.moveTo(Game.spawns["Spawn1"]);
      }
    }
  }
};

module.exports = roleHarvester;