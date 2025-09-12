import { useEffect } from "react";

const THEMES = {
	lichess: "bg-lichess-gradient",
	wood: "bg-wood-gradient",
	grass: "bg-grass-gradient",
	brick: "bg-brick-gradient",
};

const ThemeSelector = ({ theme, setTheme }) => {
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return (
		<div className="grid grid-cols-4 gap-[1cqmin] w-fit">
			{Object.keys(THEMES).map((t) => {
				const color = THEMES[t];
				const highlight =
					theme == t
						? "outline outline-[0.4cqmin] md:outline-[0.2cqmin] outline-white"
						: "";
				return (
					<div
						key={t}
						className={`size-[4cqmin] md:size-[3cqmin] rounded-[0.65cqmin] md:rounded-[0.4cqmin] ${color} ${highlight}`}
						onMouseDown={() => setTheme(t)}
					></div>
				);
			})}
		</div>
	);
};

export default ThemeSelector;
