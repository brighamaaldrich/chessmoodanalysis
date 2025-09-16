import { Chess } from "chess.js";
import { useCallback, useState } from "react";
import Chessboard from "./components/Chessboard";
import GhostPiece from "./components/GhostPiece";
import MoveTree from "./components/MoveTree";
import { MoveNode, parsePGN } from "./utils/pgnParser";

const App = () => {
	const [flipped, setFlipped] = useState(false);
	const [game, setGame] = useState(new Chess());
	const [dragged, setDragged] = useState(null);
	const [boardKey, setBoardKey] = useState(0);
	const [treeKey, setTreeKey] = useState(0);
	const [theme, setTheme] = useState("lichess");
	const [moveTrees, setMoveTrees] = useState([
		new MoveNode("start", null, null, null, game.fen(), game.turn()),
	]);
	const [treeIdx, setTreeIdx] = useState(0);
	const [currentNode, setCurrentNode] = useState(moveTrees[treeIdx]);

	const updateGame = (newGame) => {
		setGame(newGame);
		setTreeKey((prev) => prev + 1);
	};

	const changeTreeIdx = (i) => {
		setTreeIdx(i);
		handleMoveSelect(moveTrees[i]);
	};

	const handlePgnLoad = useCallback((pgnContent) => {
		try {
			const trees = parsePGN(pgnContent);
			setMoveTrees(trees);
			setCurrentNode(trees);
			const newGame = new Chess();
			setGame(newGame);
			setBoardKey((prev) => prev + 1);
		} catch (error) {
			console.error("Failed to parse PGN:", error);
			alert("Failed to parse PGN file. Please check the file format.");
		}
	}, []);

	const handleMoveSelect = useCallback((node) => {
		if (node && node.fen) {
			const newGame = new Chess(node.fen);
			setGame(newGame);
			setCurrentNode(node);
			setBoardKey((prev) => prev + 1);
		}
	}, []);

	const handleTreeNavigate = useCallback(
		(direction) => {
			if (!currentNode || !moveTrees[treeIdx]) return;
			let targetNode = null;
			if (direction === "start") {
				targetNode = moveTrees[treeIdx];
			} else if (direction === "end") {
				let current = moveTrees[treeIdx];
				while (current.children.length > 0) {
					current = current.children[0];
				}
				targetNode = current;
			}
			if (targetNode) handleMoveSelect(targetNode);
		},
		[currentNode, moveTrees, treeIdx, handleMoveSelect]
	);

	return (
		<div className="w-full min-h-screen bg-bkg flex flex-col md:flex-row overflow-hidden">
			<div
				className="h-dvw md:h-screen w-full md:w-2/3 flex flex-col items-center justify-center"
				style={{ containerType: "size" }}
			>
				<GhostPiece piece={dragged} />
				<Chessboard
					key={boardKey}
					game={game}
					updateGame={updateGame}
					dragged={dragged}
					setDragged={setDragged}
					theme={theme}
					setTheme={setTheme}
					moveTree={moveTrees[treeIdx]}
					currentNode={currentNode}
					onMoveSelect={handleMoveSelect}
					flipped={flipped}
					setFlipped={setFlipped}
				/>
			</div>
			<div className="h-screen md:h-screen w-full md:w-1/3 flex flex-col items-center inset-shadow-panel md:mt-0 overflow-scroll p-8">
				<MoveTree
					key={treeKey}
					moveTrees={moveTrees}
					treeIdx={treeIdx}
					changeTreeIdx={changeTreeIdx}
					currentNode={currentNode}
					onMoveSelect={handleMoveSelect}
					onNavigate={handleTreeNavigate}
					onPgnLoad={handlePgnLoad}
				/>
			</div>
		</div>
	);
};

export default App;
