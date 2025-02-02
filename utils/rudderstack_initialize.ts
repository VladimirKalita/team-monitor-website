export interface RudderstackClientSideEvents {
  identify: (
    userId: string,
    name: string,
    email: string,
    anonymousId: string
  ) => void;
  track: (
    userId: string,
    event: string,
    properties: { [key: string]: any },
    anonymousId: string
  ) => void;
  page: (
    type: string,
    pageName: string,
    properties: { [key: string]: any }
  ) => void;
}

let rudderAnalyticsInstance: typeof import('rudder-sdk-js') | null = null;

async function loadRudderAnalytics(): Promise<typeof import("rudder-sdk-js") | null> {
  if (typeof window !== "undefined") {
    const rudderAnalytics = await import("rudder-sdk-js");
    rudderAnalytics.load(
      process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY!,
      process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATAPLANE_URL!,
      {
        integrations: { All: true }, // load call options
      }
    );
	
	rudderAnalyticsInstance = rudderAnalytics
    rudderAnalytics.ready(() => {
      console.log("we are all set!!!");
    });
  }
  return rudderAnalyticsInstance;
}

export async function rudderEventMethods(): Promise<RudderstackClientSideEvents | null> {
  const rudderAnalytics = await loadRudderAnalytics();

  if (rudderAnalytics) {
    const rudderstackClientSideEvents: RudderstackClientSideEvents = {
      identify: (userId, name, email, anonymousId) => {  // Anonymous Id is set in local storage as soon as a user lands on the webiste.
        console.log("identify");
        rudderAnalytics.identify(
          userId,
          { name: name, email: email },
          { anonymousId: anonymousId },
          () => {
            console.log("identify event successfully recorded");
          }
        );
      },
      /**
       * @param {*} properties properties should be a dictionary of properties of the event. It must contain an "eventStatusFlag" which will define the status of a single event. If the flag is 1, event is successful and if it is 0, event is failed.
       */
      track: (userId, event, properties, anonymousId) => {
        console.log("track");
        properties["userId"] = userId;
        properties["event_timestamp"] = new Date();
        rudderAnalytics.track(
          event,
          properties,
          { anonymousId: anonymousId },
          () => {
            console.log("Track event successfully recorded");
          }
        );
      },
      page: (type, pageName, properties) => {
        //TODO: Rudderstack doesn't take `userId` or `anonymousId` as arguments to page method but then does it makes sense to use this method? Figure out.
        console.log("page");
        rudderAnalytics.page(
          type,
          pageName,
          properties,
          () => {
            console.log("Page event successfully recorded");
          }
        );
      },
    };
    return rudderstackClientSideEvents;
  }
  return null;
}
