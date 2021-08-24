import { Content } from "mailgen";
import { TemplateId } from "./template-id";

export const templates: Record<TemplateId, Content & { subject: string }> = {
  [TemplateId.AccountActivation]: {
    subject: "Activate Your {{appName}} Account",
    body: {
      name: "{{name}}",
      intro:
        "We are happy to have you and wish to inform you that your {{appName}} account is ready but pending activation on your end, which is just a button-click away.",
      action: {
        instructions: "To complete your registration, please click here:",
        button: {
          color: "#22BC66",
          text: "Activate my identity",
          link: "{{actionUri}}"
        }
      },
      outro: "Need help? Got Questions? Reply to this email. We'd love to help."
    }
  },
  [TemplateId.Welcome]: {
    subject: "Welcome to {{appName}}!",
    body: {
      name: "{{name}}",
      intro: "Welcome to {{appName}}! We're very excited to have you on board.",
      action: {
        instructions: "To get started, please click here to login:",
        button: {
          color: "#22BC66",
          text: "Sign in to {{appName}}",
          link: "{{actionUri}}"
        }
      },
      outro: "Need help? Got Questions? Reply to this email. We'd love to help."
    }
  }
};
