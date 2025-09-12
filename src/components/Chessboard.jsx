import { useCallback, useEffect, useState } from "react";
import { MoveNode } from "../utils/pgnParser";
import ArrowButton from "./ArrowButton";
import FlipButton from "./FlipButton";
import Square from "./Square";
import ThemeSelector from "./ThemeSelector";

const Chessboard = ({
	game,
	updateGame,
	dragged,
	setDragged,
	theme,
	setTheme,
	moveTree,
	currentNode,
	onMoveSelect,
}) => {
	const [selected, setSelected] = useState("");
	const [valid, setValid] = useState([]);
	const [lastMove, setLastMove] = useState({
		from: currentNode?.lan?.slice(0, 2),
		to: currentNode?.lan?.slice(2, 4),
	});
	const [checkSquare, setCheckSquare] = useState(null);
	const [hasLeft, setHasLeft] = useState(false);
	const [clickCount, setClickCount] = useState(0);
	const [flipped, setFlipped] = useState(false);

	const toAlgebraic = (row, col) => {
		const file = String.fromCharCode("a".charCodeAt(0) + col);
		const rank = 8 - row;
		return `${file}${rank}`;
	};

	const getSquare = useCallback(
		(e) => {
			const rect = document
				.getElementById("board")
				.getBoundingClientRect();
			const sqSize = rect.width / 8;
			let col = Math.floor((e.clientX - rect.left) / sqSize);
			let row = Math.floor((e.clientY - rect.top) / sqSize);
			if (flipped) {
				col = 7 - col;
				row = 7 - row;
			}
			const file = String.fromCharCode("a".charCodeAt(0) + col);
			const rank = 8 - row;
			return `${file}${rank}`;
		},
		[flipped]
	);

	const addMove = useCallback(() => {
		let children = currentNode.children;
		let history = game.history({ verbose: true });
		let prev = history[history.length - 1];
		let lans = children.map((child) => child.lan);
		let childIdx = lans.indexOf(prev.lan);
		if (childIdx == -1) {
			const newNode = new MoveNode(
				prev.san,
				prev.lan,
				currentNode,
				game.moveNumber() - (game.turn() == "w" ? 1 : 0),
				game.fen(),
				game.turn()
			);
			if (children.length == 0) {
				console.log("test");
				children.push(newNode);
			} else {
				children.splice(currentNode.mainIdx + 1, 0, newNode);
				currentNode.mainIdx++;
			}
			onMoveSelect(children[currentNode.mainIdx]);
		} else {
			currentNode.mainIdx = childIdx;
			onMoveSelect(children[childIdx]);
		}
	}, [currentNode, game, onMoveSelect]);

	const makeMove = useCallback(
		(square) => {
			game.move({ from: selected, to: square, promotion: "q" });
			if (currentNode) addMove();
			updateGame(game);
			const check = game.isCheck()
				? game.findPiece({ type: "k", color: game.turn() })[0]
				: null;
			setCheckSquare(check);
			setLastMove({ from: selected, to: square });
		},
		[addMove, currentNode, game, selected, updateGame]
	);

	const handleSquareClick = useCallback(
		(square, isDown) => {
			setClickCount((prev) => prev + 1);
			const piece = game.get(square);
			const sameColor = piece?.color === game.turn();
			const isValid = valid?.includes(square);
			const sameSquare = selected === square;
			if (sameSquare && !hasLeft && clickCount <= 2) {
				return;
			} else if (isValid) {
				makeMove(square);
			} else if (sameColor && !sameSquare && isDown) {
				const moves = game.moves({ square: square, verbose: true });
				setSelected(square);
				setValid(moves.map((m) => m.to));
				setClickCount(1);
				return;
			}
			setSelected("");
			setValid([]);
			setClickCount(0);
		},
		[clickCount, game, hasLeft, makeMove, selected, valid]
	);

	const handleUndo = useCallback(
		(isFlipped) => {
			if (!currentNode || !moveTree) return;
			if (!isFlipped && currentNode.children.length > 0)
				onMoveSelect(currentNode.children[currentNode.mainIdx]);
			else if (isFlipped && currentNode.parent)
				onMoveSelect(currentNode.parent);
		},
		[currentNode, moveTree, onMoveSelect]
	);

	const handleMouseDown = useCallback(
		(e) => {
			e.preventDefault();
			setHasLeft(false);
			const square = getSquare(e);
			if (!square) return null;
			const piece = game.get(square);
			if (piece && piece.color === game.turn()) {
				setDragged({
					piece: piece,
					square: square,
					x: e.clientX,
					y: e.clientY,
				});
			}
			handleSquareClick(square, true);
		},
		[game, getSquare, handleSquareClick, setDragged]
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (dragged) {
				setDragged({
					piece: dragged.piece,
					square: dragged.square,
					x: e.clientX,
					y: e.clientY,
				});
				const square = getSquare(e);
				if (square !== selected) {
					setHasLeft(true);
				}
			}
		},
		[dragged, getSquare, selected, setDragged]
	);

	const handleMouseUp = useCallback(
		(e) => {
			if (dragged) {
				const square = getSquare(e);
				if (square) {
					handleSquareClick(square, false);
				}
			}
			setHasLeft(false);
			setDragged(null);
		},
		[dragged, getSquare, handleSquareClick, setDragged]
	);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key == "ArrowRight") handleUndo(false);
			else if (e.key == "ArrowLeft") handleUndo(true);
		};
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseDown, handleMouseMove, handleMouseUp, handleUndo]);

	return (
		<>
			<div
				id="board"
				className="aspect-square grid grid-cols-8 grid-rows-8 overflow-clip w-[88cqmin] rounded-[0.3cqmin]"
			>
				{game.board().map((row, rowIndex) =>
					row.map((_, colIndex) => {
						let square = toAlgebraic(rowIndex, colIndex);
						if (flipped) {
							square = toAlgebraic(7 - rowIndex, 7 - colIndex);
						}
						const piece = game.get(square);
						return (
							<Square
								key={square}
								flipped={flipped}
								square={square}
								piece={piece}
								isLight={(rowIndex + colIndex) % 2 == 0}
								isSelected={square == selected}
								isLastMove={
									square == lastMove?.from ||
									square == lastMove?.to
								}
								isCheck={square == checkSquare}
								isMove={!piece && valid.includes(square)}
								isCapture={piece && valid.includes(square)}
								isHidden={square == dragged?.square}
							/>
						);
					})
				)}
			</div>
			<div className="flex w-[88cqmin] mt-[2cqh] md:mt-[1cqh]">
				<div className="flex-1/4">
					<ThemeSelector theme={theme} setTheme={setTheme} />
				</div>
				<div className="flex-1/2 flex justify-center">
					<div className="grid grid-cols-2 gap-[1cqmin] w-fit">
						<ArrowButton
							isFlipped={true}
							doUndo={handleUndo}
						></ArrowButton>
						<ArrowButton
							isFlipped={false}
							doUndo={handleUndo}
						></ArrowButton>
					</div>
				</div>
				<div className="flex-1/4 flex justify-end w-max">
					<FlipButton flipped={flipped} setFlipped={setFlipped} />
				</div>
			</div>
		</>
	);
};

export default Chessboard;
