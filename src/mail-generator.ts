import config from "config";
import Mailgen from "mailgen";

const appConfig: Record<string, string> = config.get("app");

export const mailGenerator = new Mailgen({
  theme: "salted",
  product: {
    name: appConfig.name,
    link: appConfig.homepageUri,
    logo: appConfig.logoUri
  }
});
