"use client";

import { useEffect } from "react";

type PrintOnLoadProps = {
  enabled: boolean;
};

export function PrintOnLoad({ enabled }: PrintOnLoadProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handle = window.setTimeout(() => {
      window.print();
    }, 250);

    return () => {
      window.clearTimeout(handle);
    };
  }, [enabled]);

  return null;
}
