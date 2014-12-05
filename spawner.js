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

		if(Memory.spawnQue.length == 0)
			return;

		var role = Memory.spawnQue[0];
		var spawnCost = this.spawnCost(role);

		if(typeof role == "string")
		{
			role = { type: role, memory: { } };
		}

		var toSpawnAt = Game.getRoom('1-1').find(Game.MY_SPAWNS, {
			filter: function(spawn)
			{
				return spawn.energy > spawnCost
					&& spawn.spawning == null;
			}
		});

		if(toSpawnAt.length > 0)
			toSpawnAt = toSpawnAt[0];
		else
			toSpawnAt = false;

		if(toSpawnAt)
		{
			this.spawn(role.type, role.memory, toSpawnAt);
			Memory.spawnQue.shift();
		}
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

		spawnPoint.createCreep(manager.getRoleBodyParts(role), name, memory);
	},

	canSpawn: function(spawnPoint, role)
	{
		if(typeof spawnPoint == "string" && role == undefined)
		{
			role = spawnPoint;
			spawnPoint = Game.spawns.Spawn1;
		}

		return spawnPoint.energy >= this.spawnCost(role);
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