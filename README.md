# Root's Best AntiNuke

A native Root App security monitor for community administrators.

## MVP status

This first milestone monitors documented community role events and writes structured security records to the Root server log. It detects bursts of role changes for review.

**It does not automatically ban members, delete channels, or change permissions.** The current public role-event reference does not establish actor identity on those payloads. Until Root exposes verified actor attribution or an audit-log endpoint, this app will not guess who caused a change or take punitive action.

## Features in this milestone
- Role created, deleted, edited, and moved event monitoring
- Configurable burst window and threshold
- Structured security logs
- Conservative permission posture
- Trusted-user configuration reserved for actor-aware enforcement

## Platform

This is a Root App, not a Discord bot or Railway service. Root hosts the app server per community and provides per-community persistent storage.

## Setup

1. Open the app in the Root Developer Portal.
2. Confirm the app ID in the manifest matches the ID assigned by Root.
3. Use the current Root starter project and follow Root's server project guide.
4. For local testing, put a DEV_TOKEN from the Root Developer Portal in server/.env. Never commit that token.
5. Build and test in a private test community before publishing.

## Next milestone

Add a Root App dashboard for event history, configuration, trusted administrators, and a human-confirmed lockdown workflow. Actor-aware enforcement must wait until Root documents a reliable event actor or audit-log API.

## Official docs
- https://docs.rootapp.com/docs/app-docs/get-started/app-overview/
- https://docs.rootapp.com/docs/app-docs/develop/server/server-project-overview/
- https://docs.rootapp.com/docs/app-docs/develop/server/community-api/get-started/
- https://docs.rootapp.com/docs/bot-api-reference/enumerations/CommunityRoleEvent/