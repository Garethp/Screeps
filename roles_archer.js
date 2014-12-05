var proto = require('role_prototype');

var archer = {
	parts: [
		[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE],
		[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE],
		[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
		[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
	],

	/**
	 * Here we want Archer to automatically scale to however many extensions we have
	 * @returns {Array}
	 */
	getParts: function()
	{
		var _= require('lodash');

		var partsAllowed = Game.getRoom('1-1').find(Game.MY_STRUCTURES, {
			filter: function(structure)
			{
				return (structure.structureType == Game.STRUCTURE_EXTENSION && structure.energy >= 200);
			}
		}).length;
		partsAllowed += 5;

		var modulo = partsAllowed % 2;
		partsAllowed -= modulo;
		partsAllowed /= 2;

		if(partsAllowed > 5)
			partsAllowed = 5;

		var parts = [ ];
		for(var i = 0; i < partsAllowed; i++) {
			parts.unshift(Game.RANGED_ATTACK);
			parts.push(Game.MOVE);
		}

		return parts;
	},

	action: function()
	{
		var creep = this.creep;

		var target = this.rangedAttack();

		//If there's not a target near by, let's go search for a target if need be
		if(target === null)
		{
			target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
			if (target)
			{
				creep.moveTo(target);
				return;
			}
		} else if (this.kite(target)) return;

		this.rest();
	}
};

module.exports = archer;