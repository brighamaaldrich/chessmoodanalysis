import MoveCell from "./MoveCell";
import PgnUploader from "./PgnUploader";

const MoveTree = ({ moveTree, currentNode, onMoveSelect, onPgnLoad }) => {
	if (!moveTree) return <PgnUploader onPgnLoad={onPgnLoad} />;
	return (
		<div className="w-full flex" style={{ containerType: "inline-size" }}>
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
