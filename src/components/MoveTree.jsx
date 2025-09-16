import MoveCell from "./MoveCell";
import PgnUploader from "./PgnUploader";

const MoveTree = ({
	moveTrees,
	treeIdx,
	changeTreeIdx,
	currentNode,
	onMoveSelect,
	onPgnLoad,
}) => {
	let moveTree = moveTrees[treeIdx];
	if (!moveTree || moveTree.children.length === 0)
		return <PgnUploader onPgnLoad={onPgnLoad} />;
	return (
		<div
			className="w-full flex flex-col"
			style={{ containerType: "inline-size" }}
		>
			<div className="mb-4">
				<select
					id="chapter-selector"
					name="chapter-selector"
					value={treeIdx}
					onChange={(e) => changeTreeIdx(parseInt(e.target.value))}
					className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
				>
					{moveTrees.map((_, index) => (
						<option key={index} value={index}>
							Chapter {index + 1}
						</option>
					))}
				</select>
			</div>
			<div className="relative">
				<MoveCell
					parent={moveTree}
					siblings={moveTree.children}
					onMoveSelect={onMoveSelect}
					currentNode={currentNode}
				/>
			</div>
		</div>
	);
};

export default MoveTree;
