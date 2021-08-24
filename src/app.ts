import express from "express";
import { validateOrReject } from "class-validator";
import { Mail } from "./mail";
import { daprClient } from "./dapr";
import { TemplateId } from "./template-id";
import { templates } from "./templates";
import { snooze } from "./utils";
import { mailGenerator } from "./mail-generator";
import { render } from "micromustache";
import config from "config";

export const app = express();

const appName: number = config.get("app.name");
const defaultFromMailAddress: number = config.get("app.defaultFromMailAddress");
const relaySnoozeMs: number = config.get("app.relaySnoozeMs");

app.use(express.json({ type: "application/json" }));

app.post("/mail", async (req, res) => {
  try {
    const tpl = req.body.templateId;
    const template = templates[tpl as TemplateId];
    const variables = Object.assign({ appName }, req.body.variables);

    if (
      variables &&
      !(variables instanceof Object && variables.length === undefined)
    )
      return res
        .status(400)
        .send({ message: `Variables must be a dictionary.` });

    if (!template)
      return res
        .status(400)
        .send({ message: `Unrecognized template: ${tpl ?? "null"}` });

    const body = render(mailGenerator.generate(template), variables);
    const subject = render(template.subject, variables);

    const mail = new Mail(
      req.body.to,
      req.body.from ?? defaultFromMailAddress,
      subject,
      body
    );

    await validateOrReject(mail);
    await daprClient.binding.send("rabbitmq-binding", "create", mail);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

app.post("/rabbitmq-binding", async (req, res) => {
  try {
    const mail = req.body;

    console.log(`Snoozing for ${relaySnoozeMs}ms...`);
    await snooze(relaySnoozeMs); // Throttling
    console.log("Relaying...");
    await daprClient.binding.send("smtp-binding", "create", mail.body, {
      emailTo: mail.to,
      emailFrom: mail.from,
      subject: mail.subject
    });
    console.log("Relayed.");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});
