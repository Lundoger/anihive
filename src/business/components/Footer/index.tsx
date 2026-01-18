import { AppLink } from "@/shared/components/Link";
import Logo from "@/shared/components/Logo";
import { FOOTER_NAVIGATION_MENU_ITEMS } from "@/business/constants/navigation";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
	const t = await getTranslations("main.footer");

	return (
		<footer className="xs:mb-[72px] md:mb-0 mb-[56px] md:py-8 md:px-4 py-3">
			<div className="custom-container flex flex-col gap-2">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-3 py-3">
					<div className="flex flex-col gap-3">
						<div className="pointer-events-none flex items-center gap-1 select-none">
							<Logo size="default" className="size-14 p-0" variant="transparent" />
							<p className="text-3xl font-bold">Ani<span className="text-primary-accent-light">Hive</span></p>
						</div>
						<p className="opacity-50 max-w-[550px]">{t("description")}</p>
						{/* <div className="flex items-center gap-2">
						</div> */}
					</div>
					<div className="md:col-span-3 flex md:justify-around flex-col md:flex-row gap-5">
						{FOOTER_NAVIGATION_MENU_ITEMS.map((section) => (
							<div key={section.id} className="flex flex-col gap-3">
								<h4 className="text-lg font-bold">{t(section.titleKey)}</h4>
								<ul className="flex flex-col gap-2">
									{section.links.map((link) => (
										<li key={link.id}>
											<AppLink href={link.href}>{t(link.titleKey)}</AppLink>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className="h-px bg-white/20 w-full" />
				<div className="flex justify-between items-center gap-x-5 gap-y-3 flex-wrap py-3">
					<div className="flex flex-col gap-2">
						<p className="text-sm opacity-50">{t("copyright")}</p>
					</div>
					<p className="text-sm opacity-50">{t("poweredBy")}</p>
				</div>
			</div>
		</footer>
	);
}
