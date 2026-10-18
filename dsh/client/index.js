/** Advisor Settings browser half: one Settings navigation section. */
import { createPanel } from "./AdvisorPanel.js";
import { en } from "./locale/en.js";
import { ja } from "./locale/ja.js";

/** Dictionary namespace owned by this plugin. */
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
  // The module loader hands the browser module table to factories through
  // `require`; other hosts inject React themselves.
  const React = ctx.React ?? (typeof require === "function" ? require("react") : globalThis.React);
  if (!React) throw new Error("dsh-advisor: the Harness browser module table did not provide React.");
  const t = ctx.locale.bind(NS);
  ctx.effect(() => ctx.locale.register(NS, { en, ja }), "dsh-advisor: dictionaries");

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
