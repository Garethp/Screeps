var proto = require('role_prototype');

var archer = function()
{

};

archer.parts = [
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE],
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE],
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
	[Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.RANGED_ATTACK, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE, Game.MOVE],
];
/**
 * Here we want Archer to automatically scale to however many extensions we have
 * @returns {Array}
 */
archer.getParts = function()
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

	var parts = [ ];
	for(var i = 0; i < partsAllowed; i++) {
		parts.unshift(Game.RANGED_ATTACK);
		parts.push(Game.MOVE);
	}

	return parts;
};

archer.prototype = Object.create(proto.prototype);
archer.prototype.performAction = function()
{
	var creep = this.creep;

	var target = this.fightMethods.rangedAttack(creep);

	//If there's not a target near by, let's go search for a target if need be
	if(target === null)
	{
		target = creep.pos.findNearest(Game.HOSTILE_CREEPS);
		if (target)
		{
			creep.moveTo(target);
			return;
		}
	} else if (this.fightMethods.kite(creep, target)) return;

	this.fightMethods.rest(creep);
};

module.exports = archer;