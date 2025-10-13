import { useEffect } from "react";

type ShortcutKey = "Ctrl" | "Alt" | "Shift" | "Meta" | string;

export function useShortcut(
  keys: ShortcutKey[],
  onRun: () => void,
  condition: () => boolean = () => true
) {
  useEffect(() => {
    if (!condition()) return;

    const listener = (ev: KeyboardEvent) => {
      const hasCtrlOrMeta = keys.includes("Ctrl") && (ev.ctrlKey || ev.metaKey);
      const hasAlt = keys.includes("Alt") ? ev.altKey : true;
      const hasShift = keys.includes("Shift") ? ev.shiftKey : true;
      const hasMetaOnly = keys.includes("Meta") ? ev.metaKey : true;

      const mainKey = keys.find(
        (k) => !["Ctrl", "Alt", "Shift", "Meta"].includes(k)
      );

      const keyMatch =
        !mainKey ||
        ev.code.toLowerCase() === `key${mainKey.toLowerCase()}` ||
        ev.code.toLowerCase() === mainKey.toLowerCase();

      if (hasCtrlOrMeta && hasAlt && hasShift && hasMetaOnly && keyMatch) {
        ev.preventDefault();
        onRun();
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [keys.join("+"), onRun]);
}
