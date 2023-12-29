import { HeartIcon, InfoIcon, MarkGithubIcon } from "@primer/octicons-react";
import Logo from "./Logo";

export default function MainHero({ children, padding = 6 }) {
	return (
		<div className="hero min-h-screen bg-secondary flex flex-col justify-center">
			<div
				className={`hero-content text-center bg-base-100 p-${padding} rounded-xl border border-base-200 login-page-box`}
			>
				<div className="max-w-md flex flex-col items-center py-6">
					<h1 className="text-5xl font-bold">
						<Logo size={250} />
					</h1>
					<p className="text-2xl font-bold opacity-40">Simply Here.</p>
					{children}
				</div>
			</div>
			<div className="text-md mt-8">
				<span>Zyma is a free and open source attendance tracker.</span>
			</div>
			<div className="text-md mt-3 -mb-3">
				<a
					className="hover:text-primary transition-all"
					href="https://github.com/EvanZhouDev/zyma"
				>
					<MarkGithubIcon className="mr-1" />
					GitHub
				</a>
				<span className="mx-2">|</span>
				<a className="hover:text-primary transition-all" href="/about">
					<InfoIcon className="mr-1" />
					About
				</a>
				<span className="mx-2">|</span>
				<a
					className="hover:text-primary transition-all"
					href="https://github.com/EvanZhouDev/zyma"
				>
					<HeartIcon className="mr-1" />
					Support
				</a>
			</div>
		</div>
	);
}
