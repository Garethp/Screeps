module.exports = function(creeps)
{
	var roleManager = require('roleManager');
	var roles = { };

	//For each creep, check if they have a role. If they do, load and run it
	for(var name in creeps)
	{
		var creep = creeps[name];
		if(creep.spawning || creep.memory.role == undefined || (creep.memory.active !== undefined && !creep.memory.active))
			continue;

		var role = creep.memory.role;

		if(roleManager.roleExists(role))
			role = roleManager.getRole(role);

		var role = Object.create(role);
		role.setCreep(creep);
		try { role.run(); } catch(e) { };
	}
};