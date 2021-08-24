import { DaprClient } from "@roadwork/dapr-js-sdk/http";

const daprHost = "127.0.0.1";
const daprPort = "3500";

export const daprClient = new DaprClient(daprHost, daprPort);
