import { Chess } from "chess.js";

export class MoveNode {
	constructor(move, lan, parent, moveNumber, fen, turn) {
		this.move = move;
		this.lan = lan;
		this.parent = parent;
		this.children = [];
		this.moveNumber = moveNumber;
		this.fen = fen;
		this.turn = turn;
		this.mainIdx = 0;
	}

	toString(depth = 0) {
		let treeString = "";
		let indent = " ".repeat(depth * 4);
		treeString += `${indent}${this.moveNumber}. ${this.move}\n`;
		for (const child of this.children) {
			treeString += child.toString(depth + 1);
		}
		return treeString;
	}
}

function tokenize(pgn) {
	pgn = pgn.replace(/\[.*?\]\s*/gs, " ");
	pgn = pgn.replace(/\{.*?\}\s*/gs, " ");
	let regex = /\(|\)|\d+\.\.\.|\d+\.|[^\s()]+/g;
	return pgn.match(regex) || [];
}

function parseMoves(
	tokens,
	game,
	parent = new MoveNode("start", null, null, null, game.fen(), game.turn()),
	moveNum = 1
) {
	let node = parent;
	while (tokens.length) {
		let tok = tokens.shift();
		if (tok === "*" || tok === "1-0" || tok === "0-1" || tok === "1/2-1/2")
			return parent;
		else if (tok === "(") {
			let branch = node.parent;
			let gameCopy = new Chess(branch.fen);
			parseMoves(tokens, gameCopy, branch, moveNum);
		} else if (tok === ")") return;
		else if (/^\d+\.+$/.test(tok)) moveNum = parseInt(tok);
		else {
			if (game.move(tok)) {
				let history = game.history({ verbose: true });
				let lan = history[history.length - 1].lan;
				let child = new MoveNode(
					tok,
					lan,
					node,
					moveNum,
					game.fen(),
					game.turn()
				);
				node.children.push(child);
				node = child;
			}
		}
	}
	return parent;
}

function parseSinglePGN(pgn) {
	let tokens = tokenize(pgn);
	let game = new Chess();
	let tree = parseMoves(tokens, game);
	return tree;
}

export function parsePGN(pgn) {
	let pgnParts = pgn.split("\n\n");
	if (pgnParts[pgnParts.length - 1].trim() === "") pgnParts.pop();
	let trees = [];
	for (let i = 0; i < pgnParts.length - 1; i += 2) {
		pgn = pgnParts.slice(i, i + 2).join("\n\n");
		trees.push(parseSinglePGN(pgn));
	}
	return trees;
}
