// Create creep with builder role
Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role:'builder'});

// Create Big Foot
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],undefined, { memory: { role: 'upgrader' } } );

// Create upgrader when Controller almost downgrading
if(Game.spawns['Spawn1'].energy > 200 && Game.getObjectById("59f1a11082100e1594f37b35").ticksToDowngrade < 300) {
    Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role:'upgrader'});
}

/*
TODO
- Group creep dinamically
- See code of th_pion for calling creeps role automatically
- Create logic for get energy from container
- Create array of sources and put them in the memory of the creep

*/
