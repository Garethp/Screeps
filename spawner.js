module.exports =
{
	initSpawnQue: function()
	{
		if(Memory.spawnQue == undefined)
			Memory.spawnQue = [ ];
	},

	addToQue: function(creep, unshift)
	{
		this.initSpawnQue();

		if(unshift != undefined && unshift === true)
			Memory.spawnQue.unshift(creep);
		else
			Memory.spawnQue.push(creep);
	},

	spawnNextInQue: function()
	{
		this.initSpawnQue();

		if(!Memory.spawnQue.length) 
			return;

		var spawns = Game.getRoom('1-1').find(Game.MY_SPAWNS, {
			filter: function(spawn)
			{
				return spawn.spawning === undefined || spawn.spawning === null;
			}
		});

		if(!spawns.length) 
			return;

		var role = Memory.spawnQue[0];

		if(typeof role == "string")
		{
			role = { type: role, memory: { } };
		}

		var me = this;
		var toSpawnAt = spawns.filter(function(spawn)
		{
			return me.canSpawn(spawn, role.type);
		});

		if(! toSpawnAt.length) 
			return;

		toSpawnAt = toSpawnAt[0];

		this.spawn(role.type, role.memory, toSpawnAt);

		Memory.spawnQue.shift();
	},

	spawn: function(role, memory, spawnPoint)
	{
		if(!spawnPoint)
			spawnPoint = Game.spawns.Spawn1;

		var manager = require('roleManager');

		if(!manager.roleExists(role))
		{
			return;
		}

		if(!this.canSpawn(spawnPoint, role))
		{
			return;
		}

		if(memory == undefined)
			memory = { };

		memory['role'] = role;

		var nameCount = 0;
		var name = null;
		while(name == null)
		{
			nameCount++;
			var tryName = role + nameCount;
			if(Game.creeps[tryName] == undefined)
				name = tryName;
		}

		console.log('Spawning ' + role);
		spawnPoint.createCreep(manager.getRoleBodyParts(role), name, memory);
	},

	canSpawn: function(spawnPoint, role)
	{
		if(typeof spawnPoint == "string" && role == undefined)
		{
			role = spawnPoint;
			spawnPoint = Game.spawns.Spawn1;
		}

		return spawnPoint.energy >= this.spawnCost(role)
			&& (spawnPoint.spawning == null
				|| spawnPoint.spawning == undefined);
	},

	spawnCost: function(role)
	{
		var manager = require('roleManager');
		var parts = manager.getRoleBodyParts(role);

		var total = 0;
		for(var index in parts)
		{
			var part = parts[index];
			switch(part)
			{
				case Game.MOVE:
					total += 50
					break;

				case Game.WORK:
					total += 20
					break;

				case Game.CARRY:
					total += 50
					break;

				case Game.ATTACK:
					total += 100
					break;

				case Game.RANGED_ATTACK:
					total += 150
					break;

				case Game.HEAL:
					total += 200
					break;

				case Game.TOUGH:
					total += 5
					break;
			}
		}

		return total;
	},

	killAll: function(role)
	{
		for(var i in Game.creeps) {
			if(role == undefined || Game.creeps[i].memory.role == role)
				Game.creeps[i].suicide();
		}
	}
}