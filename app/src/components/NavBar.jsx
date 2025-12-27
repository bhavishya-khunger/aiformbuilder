import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { RiGeminiFill } from "react-icons/ri";
import { useUser } from "../context/UserContext";

const NavBar = () => {
    const [stars, setStars] = useState(0);

    useEffect(() => {
        const fetchStars = async () => {
            const cached = localStorage.getItem('github_stars');
            const lastFetch = localStorage.getItem('github_stars_time');
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            if (cached && lastFetch && now - parseInt(lastFetch) < ONE_DAY) {
                setStars(parseInt(cached));
                return;
            }

            const res = await fetch('https://api.github.com/repos/bhavishya-khunger/ai-form-gen').then((res) => res.json());
            setStars(res.stargazers_count);
            localStorage.setItem('github_stars', res.stargazers_count);
            localStorage.setItem('github_stars_time', now.toString());
        };
        fetchStars();
    }, [])

    return (
        <nav className="sticky top-0 z-50 w-full bg-black text-white border-b border-white/10 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <a href="/" className="group flex items-center gap-2">
                    <RiGeminiFill size={30} />
                    <span className="text-3xl font-serif tracking-tight transition-opacity group-hover:opacity-80">
                        <span className="italic">Formify</span>AI
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <a
                        href="https://github.com/bhavishya-khunger/ai-form-gen"
                        target="_blank"
                        rel="noreferrer"
                        className="relative overflow-hidden group flex items-center gap-3 px-4 py-2 border border-white/10 rounded-md transition-all duration-300 "
                    >
                        {/* Shine layer */}
                        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-linear-to-r from-transparent via-white/12 to-transparent" />

                        {/* Content */}
                        <FaGithub className="relative z-10 text-lg" />
                        <div className="relative z-10 flex items-center font-mono gap-2 text-sm tracking-tighter">
                            <span>Star on Github</span>
                            <span className="text-white/40 group-hover:text-white/80 transition-colors">
                                {stars}
                            </span>
                        </div>
                    </a>

                    <a
                        href="/login"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-black font-semibold text-sm transition-all duration-300 hover:bg-white/90 active:scale-90"
                    >
                        Get started
                        <FiArrowUpRight className="text-lg" />
                    </a>
                </div>

                {/* Mobile - Clean Icons */}
                <div className="flex md:hidden items-center gap-3">
                    <a href="https://github.com/bhavishya-khunger/ai-form-gen" className="p-2 text-white/60 hover:text-white">
                        <FaGithub size={22} />
                    </a>
                    <a href="/login" className="p-2 bg-white text-black rounded-lg">
                        <FiArrowUpRight size={20} />
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;