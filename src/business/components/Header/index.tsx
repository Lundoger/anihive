import Logo from "@/shared/components/Logo";
import NavUser from "./components/NavUser";
import Navigation from "./components/Navigation";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="custom-container flex h-[72px] items-center justify-between gap-x-5">
        <Logo />
        <Navigation />
        <div className="flex items-center gap-4">
          <NavUser />
        </div>
      </div>
    </header>
  );
}
