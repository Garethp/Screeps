/**
 * This is where we spawn all of our creeps. Eventually, we'll make it support more than one spawner
 * @type {{spawn: spawn, canSpawn: canSpawn, spawnCost: spawnCost}}
 */
module.exports =
{
	/**
	 * Spawn a creep by a role if we have enough energy
	 * @param role
	 */
	spawn: function(role)
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

		var nameCount = 0;
		var name = null;
		while(name == null)
		{
			nameCount++;
			var tryName = role + nameCount;
			if(Game.creeps[tryName] == undefined)
				name = tryName;
		}

		Game.spawns.Spawn1.createCreep(roles[role], name, { role: role });
	},

	/**
	 * Check if we have the energy to spawn a role
	 *
	 * @param spawnPoint
	 * @param role
	 * @returns {boolean}
	 */
	canSpawn: function(spawnPoint, role)
	{
		if(typeof spawnPoint == "string" && role == undefined)
		{
			role = spawnPoint;
			spawnPoint = Game.spawns.Spawn1;
		}

		return spawnPoint.energy >= this.spawnCost(role);
	},

	/**
	 * Calculate the cost for spawning a role
	 *
	 * @param role
	 * @returns {number}
	 */
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
	}
}