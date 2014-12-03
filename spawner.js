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

		if(Game.spawns.Spawn1.spawning == null && Memory.spawnQue.length > 0)
		{
			var spawn = Memory.spawnQue[0];
			if(typeof spawn == "string")
			{
				spawn = { type: spawn, memory: { } };
			}

			if(this.canSpawn(spawn.type))
			{
				this.spawn(spawn.type, spawn.memory);
				Memory.spawnQue.shift();
			}
		}
	},

	spawn: function(role, memory)
	{
		var roles = require('roles')();

		if(roles[role] == undefined)
		{
			console.log(role + ' is not a valid role');
			console.log(roles[role]);
			return;
		}

		if(!this.canSpawn(Game.spawns.Spawn1, role))
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

		Game.spawns.Spawn1.createCreep(roles[role], name, memory);
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
		var role = require('roles')()[role];

		var total = 0;
		for(var index in role)
		{
			var part = role[index];
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

	killAll: function()
	{
		for(var i in Game.creeps)
			Game.creeps[i].suicide();
	}
}