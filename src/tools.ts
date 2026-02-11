import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResendClient } from "./client.js";
import {
  SendEmailSchema,
  GetEmailSchema,
  ListEmailsSchema,
  CreateContactSchema,
  GetContactSchema,
  UpdateContactSchema,
  DeleteContactSchema,
  ListContactsSchema,
  CreateAudienceSchema,
  GetAudienceSchema,
  ListAudiencesSchema,
  DeleteAudienceSchema,
  GetDomainSchema,
  ListDomainsSchema,
} from "./schemas.js";

export function registerTools(server: McpServer): void {
  let _client: ResendClient | null = null;
  const getClient = () => {
    if (!_client) _client = new ResendClient();
    return _client;
  };

  // ============================================================
  // Email Tools
  // ============================================================

  server.tool(
    "resend_send_email",
    "Send an email via Resend. Supports HTML/text content, CC, BCC, reply-to, and scheduled delivery.",
    SendEmailSchema.shape,
    async ({ from, to, subject, html, text, cc, bcc, replyTo, scheduledAt }) => {
      try {
        const result = await getClient().sendEmail(from, to, subject, html, text, cc, bcc, replyTo, scheduledAt);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, emailId: result.id }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_get_email",
    "Get email details and delivery status by ID.",
    GetEmailSchema.shape,
    async ({ emailId }) => {
      try {
        const result = await getClient().getEmail(emailId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_list_emails",
    "List all sent emails.",
    ListEmailsSchema.shape,
    async () => {
      try {
        const result = await getClient().listEmails();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, emails: result.data }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // ============================================================
  // Contact Tools
  // ============================================================

  server.tool(
    "resend_create_contact",
    "Create a new contact in an audience.",
    CreateContactSchema.shape,
    async ({ audienceId, email, firstName, lastName, unsubscribed }) => {
      try {
        const result = await getClient().createContact(audienceId, email, firstName, lastName, unsubscribed);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, contact: result }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_get_contact",
    "Get contact details by ID.",
    GetContactSchema.shape,
    async ({ audienceId, contactId }) => {
      try {
        const result = await getClient().getContact(audienceId, contactId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_update_contact",
    "Update contact properties.",
    UpdateContactSchema.shape,
    async ({ audienceId, contactId, email, firstName, lastName, unsubscribed }) => {
      try {
        const props: Record<string, unknown> = {};
        if (email) props.email = email;
        if (firstName) props.first_name = firstName;
        if (lastName) props.last_name = lastName;
        if (unsubscribed !== undefined) props.unsubscribed = unsubscribed;
        const result = await getClient().updateContact(audienceId, contactId, props);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, contact: result }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_delete_contact",
    "Delete a contact from an audience.",
    DeleteContactSchema.shape,
    async ({ audienceId, contactId }) => {
      try {
        const result = await getClient().deleteContact(audienceId, contactId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, deleted: result }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_list_contacts",
    "List all contacts in an audience.",
    ListContactsSchema.shape,
    async ({ audienceId }) => {
      try {
        const result = await getClient().listContacts(audienceId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, contacts: result.data }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // ============================================================
  // Audience Tools
  // ============================================================

  server.tool(
    "resend_create_audience",
    "Create a new audience for organizing contacts.",
    CreateAudienceSchema.shape,
    async ({ name }) => {
      try {
        const result = await getClient().createAudience(name);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, audience: result }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_get_audience",
    "Get audience details by ID.",
    GetAudienceSchema.shape,
    async ({ audienceId }) => {
      try {
        const result = await getClient().getAudience(audienceId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_list_audiences",
    "List all audiences.",
    ListAudiencesSchema.shape,
    async () => {
      try {
        const result = await getClient().listAudiences();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, audiences: result.data }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_delete_audience",
    "Delete an audience.",
    DeleteAudienceSchema.shape,
    async ({ audienceId }) => {
      try {
        const result = await getClient().deleteAudience(audienceId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ success: true, deleted: result }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  // ============================================================
  // Domain Tools
  // ============================================================

  server.tool(
    "resend_get_domain",
    "Get domain verification status and details.",
    GetDomainSchema.shape,
    async ({ domainId }) => {
      try {
        const result = await getClient().getDomain(domainId);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.tool(
    "resend_list_domains",
    "List all verified domains.",
    ListDomainsSchema.shape,
    async () => {
      try {
        const result = await getClient().listDomains();
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, domains: result.data }, null, 2) }],
        };
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  };
}
