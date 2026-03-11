import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          backgroundColor: "#f7f2ea",
          padding: "68px",
          color: "#1f1716",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-80px",
            top: "-120px",
            height: "320px",
            width: "320px",
            borderRadius: "999px",
            backgroundColor: "rgba(122, 27, 38, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-60px",
            bottom: "-80px",
            height: "280px",
            width: "280px",
            borderRadius: "999px",
            backgroundColor: "rgba(141, 106, 45, 0.12)",
          }}
        />
        <div
          style={{
            position: "relative",
            fontSize: 22,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          Interdisciplinary Journal of Ideas
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: "0.24em",
            }}
          >
            F.U.C.K
          </div>
          <div
            style={{
              paddingLeft: "18px",
              fontSize: 76,
              lineHeight: 0.95,
              color: "#5f5550",
            }}
          >
            Journal
          </div>
          <div style={{ fontSize: 32, lineHeight: 1.35, maxWidth: "880px" }}>
            {siteConfig.fullName}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            borderTop: "1px solid rgba(31, 23, 22, 0.16)",
            paddingTop: "24px",
            fontSize: 28,
            color: "#5f5550",
          }}
        >
          Better suited to the future we want to read and publish in.
        </div>
      </div>
    ),
    size,
  );
}
