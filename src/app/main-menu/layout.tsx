
import { ThemeSwitcher } from "../../components/layout/ThemeSwitcher";
import { Header } from "../../components/header/header";
import { Sidenav } from "../../components/sidenav/sidenav";

export default function MainMenuLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen w-full bg-[#F6F4FF] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50"
        // style={{
        //     backgroundImage: "url('/assets/img/stars.jpg')",
        //     backgroundSize: "100% auto",
        //     backgroundRepeat: "no-repeat",
        //     backgroundPosition: "center",
        // }}
        >
            {/* Top bar */}
            <Header />

            {/* Sidenav */}
            <Sidenav />

            {/* Mobile Theme */}
            <div className="md:hidden">
                <ThemeSwitcher />
            </div>

            {/* Main */}
            {children}

        </div>
    );
}
