module.exports = function()
{
	//My list of creeps
	return {
		'harvester': [Game.MOVE, Game.MOVE, Game.CARRY, Game.WORK],
		'builder': [Game.WORK,Game.WORK,Game.WORK,Game.CARRY,Game.MOVE],
		'repairer': [Game.WORK,Game.WORK,Game.WORK,Game.CARRY,Game.MOVE],
		'guard': [Game.TOUGH, Game.MOVE, Game.ATTACK,Game.ATTACK],
		'archer': [Game.MOVE, Game.RANGED_ATTACK, Game.RANGED_ATTACK],
		'healer': [Game.MOVE, Game.MOVE, Game.HEAL, Game.HEAL],
		'miner': [Game.MOVE, Game.WORK, Game.WORK, Game.WORK],
		'miner_helper': [Game.MOVE, Game.MOVE, Game.CARRY]
	};
};