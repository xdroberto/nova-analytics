import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Nova Analytics",
  version: packageJson.version,
  copyright: `© ${currentYear} Nova Analytics`,
  meta: {
    title: "Nova Analytics — See your data become light",
    description:
      "Nova Analytics turns raw numbers into decisions your whole team can read. Real-time dashboards, self-hosted and private — your data never leaves your infrastructure.",
  },
};
