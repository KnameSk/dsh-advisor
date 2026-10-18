/** Advisor Settings browser half: one Settings navigation section. */
import { createPanel } from "./AdvisorPanel.js";
import { en } from "./locale/en.js";

/**
 * Dictionary namespace owned by this plugin.
 *
 * The core owns the canonical English dictionary only. Other languages are
 * contributed by separate locale add-ons registering against this same
 * namespace — for Japanese, `dsh-advisor-locale-ja` — so the core neither ships
 * nor arbitrates a translation it does not own.
 */
export const NS = "settings.advisor";

/** Required Client services. */
export const inject = ["slots", "locale", "configForms", "remote"];

/**
 * Mount the Advisor Settings section.
 *
 * The page reads and writes the `dsh-advisor` entry through DSH's own config
 * forms, so the profile patch stays the single source of truth and no separate
 * settings store or web server is involved.
 */
export function apply(ctx) {
  // The DSH module loader hands the browser module table to this factory as
  // `require`; a plain host may expose React globally instead. Reading an
  // undeclared property off the Cordis context throws, so React is never taken
  // from `ctx`.
  const React = resolveReact();
  if (!React) throw new Error("dsh-advisor: the Harness browser module table did not provide React.");
  const t = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { en }), "dsh-advisor: english dictionary");

  // The section renders this component; the panel builds on first materialization.
  let Panel;
  const AdvisorPanel = () => {
    Panel ??= createPanel(React, t, ctx);
    return React.createElement(Panel, null);
  };
  AdvisorPanel.displayName = "AdvisorSettingsSection";

  ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({
    id: "advisor",
    label: () => t("title"),
    locale: NS,
    name: "settings.section",
    order: 40,
  }, AdvisorPanel)), "dsh-advisor: settings section");
}

/** Resolve React from the module table first, then from a host-provided global. */
function resolveReact() {
  try {
    if (typeof require === "function") {
      const loaded = require("react");
      if (loaded) return loaded;
    }
  } catch {
    // A host without a usable module table falls through to the global.
  }
  return globalThis.React;
}
