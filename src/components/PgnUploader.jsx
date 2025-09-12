import { useCallback, useState } from "react";

const PgnUploader = ({ onPgnLoad }) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleFileRead = useCallback(
		(file) => {
			setIsLoading(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				const pgnContent = e.target.result;
				onPgnLoad(pgnContent);
				setIsLoading(false);
			};
			reader.onerror = () => {
				console.error("Error reading file");
				setIsLoading(false);
			};
			reader.readAsText(file);
		},
		[onPgnLoad]
	);

	const handleFileSelect = useCallback(
		(e) => {
			const file = e.target.files[0];
			if (
				(file && file.type === "text/plain") ||
				file.name.toLowerCase().endsWith(".pgn")
			) {
				handleFileRead(file);
			}
		},
		[handleFileRead]
	);

	const handleDragOver = useCallback((e) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback(
		(e) => {
			e.preventDefault();
			setIsDragOver(false);

			const files = Array.from(e.dataTransfer.files);
			const pgnFile = files.find(
				(file) =>
					file.type === "text/plain" ||
					file.name.toLowerCase().endsWith(".pgn")
			);

			if (pgnFile) {
				handleFileRead(pgnFile);
			}
		},
		[handleFileRead]
	);

	return (
		<div className="p-4 h-full w-full flex flex-col">
			<div
				className={`flex-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
					isDragOver
						? "border-board-dark bg-board-dark/10"
						: "border-gray-600 hover:border-gray-500"
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{isLoading ? (
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-board-dark mx-auto mb-2"></div>
						<p className="text-gray-300">Loading PGN...</p>
					</div>
				) : (
					<>
						<svg
							className="w-12 h-12 text-gray-300 mb-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>

						<p className="text-gray-300 text-center mb-4">
							Drag and drop a PGN file here, or
						</p>

						<label className="cursor-pointer bg-board-dark hover:bg-board-light text-white hover:text-board-dark px-4 py-2 rounded-lg transition-colors">
							Choose File
							<input
								type="file"
								accept=".pgn,.txt,text/plain"
								onChange={handleFileSelect}
								className="hidden"
							/>
						</label>

						<p className="text-gray-400 text-sm mt-2 text-center">
							Supports .pgn and .txt files
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default PgnUploader;
