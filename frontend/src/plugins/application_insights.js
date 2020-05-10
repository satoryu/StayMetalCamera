import { ApplicationInsights } from "@microsoft/applicationinsights-web";

if (process.env.VUE_APP_INSTRUMENTATION_KEY) {
  const appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: process.env.VUE_APP_INSTRUMENTATION_KEY,
    },
  });

  appInsights.loadAppInsights();
  appInsights.trackPageView();
}
