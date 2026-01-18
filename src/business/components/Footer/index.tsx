import Logo from "@/shared/components/Logo";

export default function Footer() {
	return (
		<footer className="xs:mb-[72px] md:mb-0 mb-[56px] py-3">
			<div className="custom-container flex flex-col gap-2">
				<div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3 py-3">
					<div className="flex flex-col gap-3">
						<div className="pointer-events-none flex items-center gap-1 select-none">
							<Logo size="default" className="" variant="transparent" />
							<p className="text-2xl font-bold">
								Ani<span className="text-primary-accent-light/90">Hive</span>
							</p>
						</div>
						<p className="text-sm opacity-50">Your ultimate anime tracking platform with comprehensive content discovery and personalized recommendations.</p>
						{/* <div className="flex items-center gap-2">
						</div> */}
					</div>
				</div>
				<div className="h-px bg-white/20 w-full" />
				<div className="flex justify-between items-center gap-x-5 gap-y-3 flex-wrap py-3">
					<div className="flex flex-col gap-2">
						<div className="text-sm opacity-50">
							<p className="inline-flex items-center gap-1">© 2025 — 2026 <span>•</span> AniHive.</p> <span className="whitespace-nowrap">All rights reserved.</span>
						</div>
					</div>
					<p className="text-sm opacity-50">Powered by Jikan API</p>
				</div>
			</div>
		</footer>
	);
}
