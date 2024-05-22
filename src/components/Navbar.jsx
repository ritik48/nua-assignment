import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="border border-[#cccbcb]">
            <div className="flex py-3 mx-auto max-w-6xl justify-between items-center">
                <div className="text-sm font-semibold">NUA</div>
                <div className="text-sm flex items-center gap-4">
                </div>
            </div>
        </nav>
    );
}

export { Navbar };
