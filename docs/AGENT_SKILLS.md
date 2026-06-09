# Agent Skills Inventory

Last updated: 2026-06-09

This file tracks the Codex skills and related design references used for this website repo, so a fresh machine can be brought close to the same agent setup after pulling the project.

## Project-Scoped Skills

These are the repo-specific design skills currently used with this project. The `.agents/` directory is gitignored, so this list is the portable source of truth.

| Skill | Purpose | Source |
| --- | --- | --- |
| `emil-design-eng` | UI polish, component feel, animation judgment, and product-design craft. | `emilkowalski/skill` |
| `impeccable` | Frontend design, redesign, UX audit, polish, accessibility, responsive behavior, and visual hierarchy. | Local/project skill |

## Global Skills To Install

These were installed into `~/.agents/skills` with `npx skills`. Run these on another machine, then restart Codex.

```powershell
npx -y skills add nexu-io/open-design@ui-ux-pro-max -g -y
npx -y skills add patricio0312rev/skills@framer-motion-animator -g -y
npx -y skills add leonxlnx/taste-skill@design-taste-frontend -g -y
npx -y skills add vercel-labs/json-render@react-three-fiber -g -y
```

| Skill | Why it is useful here |
| --- | --- |
| `ui-ux-pro-max` | Catalog metadata only in the installed Open Design copy. Treat as a discovery pointer unless the full upstream bundle is installed. |
| `framer-motion-animator` | Framer Motion animation patterns for React UI. |
| `design-taste-frontend` | High-taste frontend design guidance and visual refinement. |
| `react-three-fiber` | Installed skill is json-render/R3F guidance. Deferred for this site until a real product-relevant 3D notebook scene is planned. |

## Available Environment Skills

These are available in the current Codex environment or through installed plugins. They are not project dependencies.

| Skill | Use |
| --- | --- |
| `imagegen` | Generate or edit bitmap visual assets. |
| `openai-docs` | Check current official OpenAI product and API docs. |
| `plugin-creator` | Build local Codex plugins. |
| `skill-creator` | Create or update Codex skills. |
| `skill-installer` | Install skills from curated lists or GitHub repos. |
| `find-skills` | Search the open skills ecosystem. |
| `hatch-pet` | Create and validate Codex pet spritesheets. |
| `browser:control-in-app-browser` | Open, inspect, screenshot, and QA local web targets. |
| `documents:documents` | Create and edit Word or Google Docs-style files. |
| `presentations:Presentations` | Create and edit slide decks. |
| `spreadsheets:Spreadsheets` | Create, edit, and analyze spreadsheets. |
| `atlassian-rovo:*` | Jira and Confluence workflows when the Atlassian plugin is configured. |

## Visual Reference Repos

These are not Codex skills, but they are useful implementation references for this site.

| Reference | Use |
| --- | --- |
| `https://github.com/collidingScopes/liquid-logo` | WebGL/GLSL liquid-metal logo animation reference. Useful for logo motion studies, shader ideas, and export workflows. |
| `https://github.com/dashersw/liquid-glass-js` | Vanilla JavaScript/WebGL glass-effect reference. Useful for refraction, blur, masking, and liquid-glass UI experiments. |

## Notes

- Review third-party skills before use; installed skills run with full agent permissions.
- Prefer the repo's existing frontend patterns before importing code from reference repositories.
- Treat the visual reference repos as inspiration or source material to adapt deliberately, not as drop-in project dependencies.
- Liquid Glass on the web is an approximation using web primitives such as `backdrop-filter`, layered borders, highlights, and solid fallbacks. It is not an official Apple web material.
- Current material-motion pass uses native CSS and existing `motion/react`; it does not add React Three Fiber dependencies.
- Current cinematic-notebook pass uses Anime.js for the homepage SVG/timeline scene.
- Future test tracks: React Three Fiber for a real 3D notebook/device scene, Rive for an authored 2D state-machine object, and Jitter or dotLottie for a non-interactive exported brand loop.
