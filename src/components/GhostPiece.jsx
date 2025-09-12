import Piece from "./Piece";

const GhostPiece = ({ piece }) => {
	if (!piece) return null;

	return (
		<div
			className="absolute z-200 pointer-events-none w-[11cqmin] h-[11cqmin] -translate-1/2"
			style={{ top: `${piece.y}px`, left: `${piece.x}px` }}
		>
			<Piece piece={piece.piece} />
		</div>
	);
};

export default GhostPiece;
