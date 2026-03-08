export type NotificationEventType =
  | "submission_submitted"
  | "submission_status_changed"
  | "submission_revision_requested"
  | "submission_accepted"
  | "submission_rejected"
  | "reviewer_assigned"
  | "reviewer_unassigned"
  | "review_submitted"
  | "publication_metadata_updated"
  | "publication_ready_marked"
  | "publication_published";

export type NotificationEvent = {
  type: NotificationEventType;
  submissionPublicId: string;
  recipients?: string[];
  context: Record<string, unknown>;
};

export type NotificationProvider = {
  send(event: NotificationEvent): Promise<void>;
};

class MockNotificationProvider implements NotificationProvider {
  async send(event: NotificationEvent) {
    console.info(
      `[notification:${event.type}]`,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          submissionPublicId: event.submissionPublicId,
          recipients: event.recipients ?? [],
          context: event.context,
        },
        null,
        2,
      ),
    );
  }
}

class DisabledNotificationProvider implements NotificationProvider {
  async send() {}
}

function getNotificationProvider(): NotificationProvider {
  const provider = process.env.NOTIFICATION_PROVIDER ?? "mock";

  if (provider === "disabled") {
    return new DisabledNotificationProvider();
  }

  return new MockNotificationProvider();
}

export async function sendNotification(event: NotificationEvent) {
  try {
    await getNotificationProvider().send(event);
  } catch (error) {
    console.error("Notification dispatch failed", error);
  }
}
