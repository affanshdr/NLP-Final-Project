"use client";

import SiteNavbar from "@/components/section/SiteNavbar";
import Footer from "@/components/section/Footer";
import LoadingView from "@/components/koreksi-page/LoadingView";
import ErrorView from "@/components/koreksi-page/ErrorView";
import ResultView from "@/components/koreksi-page/ResultView";
import { Card, CardContent } from "@/components/koreksi-page/card";
import { useCorrection } from "@/lib/useCorrection";

export default function KoreksiPage() {
  const { state, file, meta } = useCorrection();

  return (
    <div className="koreksi-page">
      <SiteNavbar />
      <main className="container koreksi-main">
        <Card className="koreksi-card">
          <CardContent className="koreksi-card__content">
            {state.phase === "loading" && (
              <LoadingView progress={state.progress} />
            )}
            {state.phase === "error" && <ErrorView message={state.message} />}
            {state.phase === "done" && (
              <ResultView
                original={state.original}
                corrected={state.corrected}
                confidence={state.confidence}
                diff={state.diff}
                changed={state.changed}
                truncated={state.truncated}
                file={file}
                meta={meta}
              />
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}