var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var roleMiner = require('role.miner');
var roleWallRepairer = require('role.wallRepairer');
var roleLongDistanceBuilderUpgrader = require('role.longDistanceBuilderUpgrader');
require('prototype.creep');

module.exports.loop = function () {
  const FSP_PERCENTAGE_TO_REPAIR = 0.3;

  const E54N59 = {};
  E54N59.harvesterCount = 0;
  E54N59.upgraderCount = 0;
  E54N59.attackerCount = 0;
  E54N59.builderCount = 0;
  E54N59.repairerCount = 0;

  var harvesterCount = 0;
  var upgraderCount = 0;
  var builderCount = 0;
  var repairerCount = 0;
  var wallRepairerCount = 0;
  var minerCount = 0;
  var longDistanceBuilderUpgraderCount = 0;
  var claimerCount = 0;
  var countMineSource0 = 0;
  var countMineSource1 = 0;
  var countHarvestSource0 = 0;
  var countHarvestSource1 = 0;
  var builderContainerNotFound = true;
  var room = "E53N59";
  var energyAvailable = Game.rooms[room].energyAvailable;
  var energyCapacity = Game.rooms[room].energyCapacityAvailable;
  var numberConstructionSites = Game.rooms[room].find(FIND_MY_CONSTRUCTION_SITES).length;
  var harvesterTicksToLive = 0;

  var lowestStructureToRepair = Game.rooms['E53N59'].find(FIND_STRUCTURES, {
    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER
  }).sort(function (a, b) {
    return a.hits - b.hits;
  });

  var findInvaders = Game.rooms['E53N59'].find(FIND_HOSTILE_CREEPS, {
    filter: (s) => s.owner.username == 'Invader'
  })
  if (findInvaders.length) {
    Game.notify("OUR FORCES ARE UNDER ATTACK!")
    console.log("OUR FORCES ARE UNDER ATTACK");
  }


  var hitsPercentage = lowestStructureToRepair[0].hits / lowestStructureToRepair[0].hitsMax;

  // const tombstones = creep.room.find(FIND_TOMBSTONES);
  // if (tombstones.length > 0) {
  //   console.log("FIND TOMBSTONES");
  //   for (let tombstone in tombstones) {
  //     let closestCreep = tombstone.findClosestByPath(FIND_MY_CREEPS);

  //     let returnWithdraw = closestCreep.withdraw(tombstone, RESOURCE_ENERGY);
  //     console.log('returnWithdraw', returnWithdraw);
  //     if (returnWithdraw == ERR_NOT_IN_RANGE) {
  //       closestCreep.moveTo(tombstone);
  //     }
  //   }
  //   return;
  // }

  var mineSource = 0;
  // when sources regenerate
  // recalc where creeps should mine
  // make a find on the source, taking the closest creeps
  // change the source of them
  // change the source on the others as well
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];

    // if (findInvaders.length) {
    //   var exit = creep.room.findExitTo("E54N59");
    //   creep.moveTo(creep.pos.findClosestByPath(exit));
    //   creep.memory.underAttack = true;
    //   creep.say("RUN FOR YOUR LIVES!");
    //   continue;
    // } else if (creep.room.name != "E53N59" && creep.memory.underAttack == true) {
    //   var exit = creep.room.findExitTo("E53N59");
    //   creep.moveTo(creep.pos.findClosestByPath(exit));
    //   continue;
    // } else if (creep.room.name == "E53N59" && creep.memory.underAttack == true) {
    //   creep.memory.underAttack = false;
    //   continue;
    // }

    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);

      if (creep.memory.home == 'E54N59') {
        // console.log(JSON.stringify(creep.name));
        E54N59.harvesterCount++;
      } else {
        harvesterCount++;

        if (creep.ticksToLive < harvesterTicksToLive || harvesterTicksToLive == 0) {
          harvesterTicksToLive = creep.ticksToLive;
        }

        if (creep.memory.mineSource == 0) {
          countHarvestSource0++;
        }
        if (creep.memory.mineSource == 1) {
          countHarvestSource1++;
        }
      }
    }
    if (creep.memory.role == 'attacker') {
      E54N59.attackerCount++;
      hostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
      let attackReturn = creep.attack(hostileCreep);
      console.log("attackReturn", attackReturn);
    }
    if (creep.memory.role == 'miner') {
      roleMiner.run(creep);
      minerCount++;
    }
    if (creep.memory.role == 'repairer') {
      roleRepairer.run(creep);
      if (creep.memory.home == 'E54N59') {
        E54N59.repairerCount++;
        continue;
      }
      repairerCount++;
    }
    if (creep.memory.role == 'wallRepairer') {
      roleWallRepairer.run(creep);
      wallRepairerCount++;
    }
    if (creep.memory.role == 'upgrader') {

      roleUpgrader.run(creep);
      if (creep.memory.home == 'E54N59') {
        E54N59.upgraderCount++;
        continue;
      }
      upgraderCount++;

      if (creep.memory.mineSource == 0) {
        countMineSource0++;
      }
      if (creep.memory.mineSource == 1) {
        countMineSource1++;
      }
    }

    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
      if (creep.memory.home == 'E54N59') {
        E54N59.builderCount++;
        continue;
      }
      builderCount++;
    }

    if (creep.memory.role == 'claimer') {
      roleClaimer.run(creep);
      claimerCount++;
    }

    if (creep.memory.role == 'longDistanceBuilderUpgrader') {
      roleLongDistanceBuilderUpgrader.run(creep);
      longDistanceBuilderUpgraderCount++;
    }
  }

  sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
  // console.log(JSON.stringify(sources,undefined,2));

  console.log(
    "E53N59",
    "E: " + energyAvailable + "/" + energyCapacity,
    "H: " + harvesterCount + " (" + countHarvestSource0 + "/" + countHarvestSource1 + ") (" + harvesterTicksToLive + ")",
    "U: " + upgraderCount + " (" + countMineSource0 + "/" + countMineSource1 + ")",
    "B: " + builderCount,
    "R: " + repairerCount,
    "WP: " + wallRepairerCount,
    "LDBU: " + longDistanceBuilderUpgraderCount,
    "Controller: (" + Game.spawns['Spawn1'].room.controller.progress + "/" + Game.spawns['Spawn1'].room.controller.progressTotal + ")",
    "Sources: (energy/ticks)",
    "(" + sources[0].energy + "/" + (sources[0].ticksToRegeneration ? sources[0].ticksToRegeneration : 300) + ")",
    "(" + sources[1].energy + "/" + (sources[1].ticksToRegeneration ? sources[1].ticksToRegeneration : 300) + ")",
  );
  console.log(
    "E54N59",
    "E: " + Game.rooms["E54N59"].energyAvailable + "/" + Game.rooms["E54N59"].energyCapacityAvailable,
    "H: " + E54N59.harvesterCount,
    "U: " + E54N59.upgraderCount,
    "B: " + E54N59.builderCount,
    "R: " + E54N59.repairerCount
  );

  if (findInvaders.length == 0) {
    if (Game.spawns['Spawn1'].energy > 199 && Game.spawns['Spawn1'].room.controller.ticksToDowngrade < 300) {
      Game.notify("Controller almost downgrading!");
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'upgrader' + Game.time, { memory: { role: 'upgrader' } });
    }

    if (energyAvailable > 299 && harvesterCount < 1) {
      Game.notify("We don't have any Harvester!");
      Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'harvester' + Game.time, {
        memory: {
          role: 'harvester',
          mineSource: 1
        }
      });
    }

    if (Game.rooms['E54N59'].energyAvailable > 299) {
      console.log("SPAWN CREEP AT E54N59");



      E54N59.lowestStructureToRepair = Game.rooms['E54N59'].find(FIND_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_CONTROLLER
      }).sort(function (a, b) {
        return a.hits - b.hits;
      });

      E54N59.findInvaders = Game.rooms['E54N59'].find(FIND_HOSTILE_CREEPS, {
        filter: (s) => s.owner.username == 'Invader'
      })
      if (E54N59.findInvaders.length) {
        Game.notify("OUR FORCES ARE UNDER ATTACK!")
        console.log("OUR FORCES ARE UNDER ATTACK");
      }


      E54N59.hitsPercentage = E54N59.lowestStructureToRepair[0].hits / E54N59.lowestStructureToRepair[0].hitsMax;

      E54N59.role = '';
      E54N59.parts = [WORK, WORK, CARRY, MOVE];
      E54N59.memory = {
        target: 'E54N59',
        home: 'E54N59',
        mineSource: 0
      }

      E54N59.hostileCreeps = Game.rooms['E54N59'].find(FIND_HOSTILE_CREEPS);

      if (E54N59.harvesterCount < 2) {
        E54N59.role = 'harvester';
      } else if (E54N59.upgraderCount < 8) {
        E54N59.role = 'upgrader';
      } else if (E54N59.hostileCreeps.length > 0 && E54N59.attackerCount == 0) {
        E54N59.role = 'attacker';
        E54N59.parts = [ATTACK, MOVE];
      } else if (E54N59.builderCount < 1 && Game.rooms['E54N59'].energyAvailable > 699) {
        E54N59.role = 'builder';
        E54N59.parts.push(WORK, WORK, WORK, MOVE, MOVE);
      } else if (
        E54N59.repairerCount < 1 &&
        E54N59.hitsPercentage <= FSP_PERCENTAGE_TO_REPAIR &&
        Game.rooms['E54N59'].energyAvailable > 499
      ) {
        E54N59.parts.push(MOVE, MOVE, CARRY, CARRY);
        E54N59.role = 'repairer';
      }


      console.log("E54N59.role", E54N59.role);
      if (E54N59.role != '') {

        E54N59.memory.role = E54N59.role;
        var returnSpawn = Game.spawns['Spawn2'].spawnCreep(E54N59.parts, E54N59.role + Game.time, { memory: E54N59.memory });
        console.log(JSON.stringify(E54N59));
        console.log("Return Spawn: " + returnSpawn);
      }
    }

    if (energyAvailable > 849) {
      console.log("SPAWN CREEP AT E53N59");
      var parts = [
        WORK, WORK, WORK, WORK, WORK,
        CARRY,
        MOVE, MOVE, MOVE
      ];
      var memory = {
        working: false,
        source: builderContainerNotFound ? 0 : 1,
        mineSource: (countHarvestSource0 >= countHarvestSource1) ? 1 : 0,
        home: "E53N59"
      };

      var role = '';
      // var wallsToRepair = false;
      // console.log('harvesterCount', harvesterCount);
      if (
        harvesterCount < 2 ||
        (harvesterCount == 2 && harvesterTicksToLive < 200)
      ) {
        role = 'harvester';
      }
      else if (
        repairerCount < 1 &&
        hitsPercentage <= FSP_PERCENTAGE_TO_REPAIR
      ) {
        parts.push(MOVE, CARRY, CARRY);
        role = 'repairer';
      }
      else if (builderCount < 2 && numberConstructionSites > 0) {
        role = 'builder';
      }
      // else if (wallRepairerCount == 0) {
      //     role = 'wallRepairer';
      // }
      else if (upgraderCount < 4) {
        if (!(countMineSource1 >= countMineSource0)) {
          parts.push(MOVE, CARRY, CARRY);
        }
        // else {
        role = 'upgrader';
      }
      else if (
        longDistanceBuilderUpgraderCount < 2
      ) {
        parts.push(MOVE, CARRY, CARRY);
        role = 'longDistanceBuilderUpgrader';
        memory.target = "E52N59";
      }

      memory.role = role;

      // console.log('memory', JSON.stringify(memory));
      // console.log('parts', JSON.stringify(parts));

      if (role != '') {
        let returnSpawn = Game.spawns['Spawn1'].spawnCreep(parts, role + Game.time, {
          memory: memory
        });

        console.log('Return Spawn: ', returnSpawn);
      }
      // else {
      //     Game.spawns['Spawn1'].createCreep(
      //         [CLAIM, WORK, CARRY, MOVE],
      //         undefined,
      //         {
      //             role: 'claimer',
      //             target: "E54N59"
      //         }
      //     );
      // }
    }
  } else {
    var towers = Game.rooms["E53N59"].find(
      FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    towers.forEach(tower => tower.attack(findInvaders[0]));
  }

  // for (let spawnName in Game.spawns) {
  //   console.log("Spawn Name:", JSON.stringify(Game.spawns[spawnName].name));
  //   console.log("Spawn Room Name:", JSON.stringify(Game.spawns[spawnName].room.name));
  //   console.log("Spawn Room Creeps:", JSON.stringify(Game.spawns[spawnName].room.find(FIND_MY_CREEPS)));
  // }

  // console.log(JSON.stringify(Game.spawns['Spawn1'].room.controller,undefined,2));
}