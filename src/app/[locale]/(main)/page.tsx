import { setRequestLocale } from "next-intl/server";
import HomePage from "@/business/pages/HomePage";

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<HomePage />
		</>
	);
}
