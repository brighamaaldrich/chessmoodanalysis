import { useState } from "react";

const MoveCell = ({ parent, siblings, onMoveSelect, currentNode }) => {
	const [sibIndex, setSibIndex] = useState(parent.mainIdx);
	const node = siblings[sibIndex];
	if (!node) return null;
	const leftVisible = sibIndex > 0 ? "visible" : "invisible";
	const rightVisible =
		sibIndex < siblings.length - 1 ? "visible" : "invisible";
	const left = node.turn === "w" ? "56cqw" : "12cqw";
	const top = `${node.moveNumber * 12 - 12}cqw`;
	const style = { top: top, left: left };
	let border = "border-r border-b";
	if (node.turn !== "w") border += " border-l";
	if (node.moveNumber === 1) border += " border-t";
	const bg =
		currentNode === node
			? "bg-board-dark"
			: "hover:bg-board-light hover:text-bkg";
	const textHover = currentNode === node ? "" : "group-hover:text-bkg";

	const changeSib = (e, dir) => {
		e.stopPropagation();
		parent.mainIdx = sibIndex + dir;
		onMoveSelect(siblings[sibIndex + dir]);
		setSibIndex((prev) => prev + dir);
	};

	const numStyle = { top: top };
	const numBorder = node.moveNumber === 1 ? "border-t" : "";
	const moveNum = (
		<div
			style={numStyle}
			className={`flex items-center justify-center absolute left-0 w-[12cqw] h-[12cqw] bg-bkg text-white text-[4cqw] border-l border-b border-white ${numBorder}`}
		>
			{node.moveNumber}.
		</div>
	);

	return (
		<div>
			{node.turn == "b" && moveNum}
			<div
				style={style}
				className={`${bg} absolute flex items-center justify-between h-[12cqw] w-[44cqw] px-[2.5cqw] ${border} border-white group`}
				onClick={() => onMoveSelect(node)}
			>
				<button
					className={`flex-1/5 text-bkg text-[2cqw] bg-white p-[1cqw] rounded-[2cqw] hover:bg-bkg hover:text-white ${leftVisible}`}
					onClick={(e) => changeSib(e, -1)}
				>
					{siblings[sibIndex - 1]?.move}
				</button>
				<button
					className={`flex-3/5 text-white text-center text-[5cqw] ${textHover}`}
				>
					{node.move}
				</button>
				<button
					className={`flex-1/5 text-bkg text-[2cqw] bg-white p-[1cqw] rounded-[2cqw] hover:bg-bkg hover:text-white ${rightVisible}`}
					onClick={(e) => changeSib(e, 1)}
				>
					{siblings[sibIndex + 1]?.move}
				</button>
			</div>
			<MoveCell
				key={node.children}
				parent={node}
				siblings={node.children}
				onMoveSelect={onMoveSelect}
				currentNode={currentNode}
			/>
		</div>
	);
};

export default MoveCell;
