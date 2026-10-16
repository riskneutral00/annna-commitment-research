# Subscription-backed and cloud operation

Status: investigation. Owner: Matt. Official documentation checked 2026-10-16; no integration, commercial approval or runtime tested.

## Question

Which supported model-access route lets annnä keep coordinating commitments while the user's phone is off or offline? Product intent belongs to [PRD.md](../PRD.md); provider direction and qualification boundaries belong to [model/SPEC.md](../model/SPEC.md), Supply & routing.

Matt wants a bring-your-own-subscription offering and a differently priced annnä-supplied offering. He named his own subscriptions as a possibility. This does not establish that personal-plan usage may be pooled or resold to serve customers. Prices, entitlement, limits and the commercial arrangement remain open.

## Current official evidence

- [ChatGPT plan usage](https://developers.openai.com/siwc/token-sharing-open-source) is distinct from identity-only sign-in. The documented route covers eligible requests from open-source/local apps; paid or remotely hosted apps are directed to an interest process. It grants no access to ChatGPT conversation history.
- [Self-hosted VMs](https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms) are documented for open-source apps using the same user's authorized registration, with a distinct VM host identity and credential-refresh handling. This is evidence against a universal claim that subscription use requires the user's device to remain on. It is not proof of commercial eligibility for annnä.
- [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations) require streaming and nonstored requests and do not support the Responses API background parameter on this route. A persistent worker on a VM is a different mechanism from that API parameter. Tool, context and renewal limitations must be qualified.
- [Website sign-in](https://developers.openai.com/siwc/website) is a limited commercial trial and covers identity; model-plan permission is separate.
- [MCP Events](https://developers.openai.com/plugins/build/mcp-events) lets supported ChatGPT Work/cloud surfaces subscribe to a server's events and respond under the user's instructions. The integration needs durable subscriptions, authenticated access and webhook delivery. It is a candidate to compare, not annnä's selected runtime.
- [Codex Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments) run coding tasks while the computer sleeps. That fact alone does not establish a production commitment-coordination service.

## Working distinction

An always-available service can receive a request, check saved availability and permissions, apply allowed conditions, record an outcome and notify the owner later. Simple auto-accept conditions may use deterministic code; interpretation or judgement may use a model. This is a planning explanation, not an implemented architecture. Phone-off operation does not imply every event requires a model call.

## Blocked On

| Gap | Blocker | Resolver |
| --- | --- | --- |
| Commercial subscription route | Public docs do not establish annnä's eligibility or approval | Product owner and provider's documented registration process |
| Annnä-supplied funding | Personal subscriptions serving customers, billing and permitted account arrangements not established | Product owner and provider agreement |
| Offline execution | Host, durable event processing, retries, quota exhaustion, revocation and recovery unqualified | Deployment/harness/model planning against the existing scenarios |
| Pricing | No amounts or approved funding fallback selected | Matt after provider and operating-cost evidence |

Next evidence: qualify an allowed route with a device-off scenario, including duplicate requests, revoked permission, unavailable models and exhausted allowance. No background use of a different paid account may be inferred from the user's desired price split.
