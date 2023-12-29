import MainHero from "@/components/MainHero";

export default function About() {
	return (
		<MainHero>
			<div className="max-w-md my-6">
				<h1 className="text-5xl font-bold mb-6">About Us</h1>
				<div className="space-y-3 text-left">
					<p>
						Zyma is a simple attendance tracker for anyone to use, built
						specifically for high school club or program managers.
					</p>
					<p>
						It was originally built in the{" "}
						<a className="link" href="https://codeforcause.devpost.com">
							12-hour CodeForCause Hackathon 2023
						</a>{" "}
						(where we won{" "}
						<a
							className="link"
							href="https://devpost.com/software/deca-attendance"
						>
							first place overall
						</a>
						), designed originally for the BASIS Silicon Valley DECA team. It
						has since then been generalized for anyone to use freely.
					</p>
					<p>
						The name "Zyma" was come up by{" "}
						<a
							className="link"
							href="https://github.com/EvanZhouDev/codeforcause-hackathon/commits?author=ThatXliner"
						>
							Bryan
						</a>{" "}
						(<a href="https://github.com/ThatXliner">ThatXliner</a>), one the
						original coders of this project. The idea was that the Chinese for
						"here?" (as in "are you here?") is 在吗, which can be romanized to
						"zaì mā" using pinyin. "Zai ma" (removing accents) can be re-written
						to the cooler-looking but roughly phonetically equivalent "Zyma."
					</p>
				</div>
				<p className="my-4 text-left">
					We hope you enjoy using it as much as we had enjoyed making it :)!
				</p>
				<a className="btn btn-primary w-full" href="/">
					Home
				</a>
			</div>
		</MainHero>
	);
}
