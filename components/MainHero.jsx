import { MarkGithubIcon, InfoIcon, HeartIcon } from "@primer/octicons-react"
import Image from "next/image";

export default function MainHero({ children, padding = 6 }) {
    return (
        <div className="hero min-h-screen bg-neutral flex flex-col justify-center">
            <div className={`hero-content text-center bg-base-100 p-${padding} rounded-xl border border-base-300 login-page-box`}>
                <div className="max-w-md flex flex-col items-center py-6">
                    <h1 className="text-5xl font-bold">
                        <Image
                            src="/zyma.svg"
                            width={250}
                            height={1200}
                            alt="Zyma Logo"
                        />
                    </h1>
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
                <a
                    className="hover:text-primary transition-all"
                    href="https://github.com/EvanZhouDev/zyma"
                >
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
    )
}