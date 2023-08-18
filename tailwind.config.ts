import type { Config } from "tailwindcss";
import daisyUi from "daisyui";

export default <Partial<Config>>{
	content: ["docs/content/**/*.md"],
	plugins: [daisyUi],
};
