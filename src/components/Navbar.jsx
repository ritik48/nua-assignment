import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="border border-[#cccbcb]">
            <div className="flex py-2 mx-auto max-w-6xl justify-between items-center">
                <div className="text-sm font-semibold">Home</div>
                <div className="text-sm flex items-center gap-4">
                    <Link
                        className="bg-black hover:opacity-50 transition-all duration-300 text-white px-4 py-1.5 rounded-md"
                        to={"/"}
                    >
                        Login
                    </Link>
                    <Link
                        className="border-black hover:bg-black hover:text-white transition-all duration-300 border px-4 py-1.5 rounded-md"
                        to={"/"}
                    >
                        Signup
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export { Navbar };
