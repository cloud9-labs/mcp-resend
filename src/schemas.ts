import { z } from "zod";

// ============================================================
// Email Schemas
// ============================================================

export const SendEmailSchema = z.object({
  from: z.string().describe("Sender email address (must be from a verified domain)"),
  to: z.union([z.string(), z.array(z.string())]).describe("Recipient email address(es)"),
  subject: z.string().describe("Email subject line"),
  html: z.string().describe("HTML content of the email"),
  text: z.string().optional().describe("Plain text fallback content"),
  cc: z.union([z.string(), z.array(z.string())]).optional().describe("CC recipient(s)"),
  bcc: z.union([z.string(), z.array(z.string())]).optional().describe("BCC recipient(s)"),
  replyTo: z.union([z.string(), z.array(z.string())]).optional().describe("Reply-to address(es)"),
  scheduledAt: z.string().optional().describe("ISO 8601 timestamp to schedule email delivery"),
});

export const GetEmailSchema = z.object({
  emailId: z.string().describe("Email ID returned from send operation"),
});

export const ListEmailsSchema = z.object({});

// ============================================================
// Contact Schemas
// ============================================================

export const CreateContactSchema = z.object({
  audienceId: z.string().describe("Audience ID to add the contact to"),
  email: z.string().describe("Contact email address"),
  firstName: z.string().optional().describe("Contact first name"),
  lastName: z.string().optional().describe("Contact last name"),
  unsubscribed: z.boolean().optional().describe("Whether the contact is unsubscribed"),
});

export const GetContactSchema = z.object({
  audienceId: z.string().describe("Audience ID containing the contact"),
  contactId: z.string().describe("Contact ID"),
});

export const UpdateContactSchema = z.object({
  audienceId: z.string().describe("Audience ID containing the contact"),
  contactId: z.string().describe("Contact ID to update"),
  email: z.string().optional().describe("Updated email address"),
  firstName: z.string().optional().describe("Updated first name"),
  lastName: z.string().optional().describe("Updated last name"),
  unsubscribed: z.boolean().optional().describe("Updated subscription status"),
});

export const DeleteContactSchema = z.object({
  audienceId: z.string().describe("Audience ID containing the contact"),
  contactId: z.string().describe("Contact ID to delete"),
});

export const ListContactsSchema = z.object({
  audienceId: z.string().describe("Audience ID to list contacts from"),
});

// ============================================================
// Audience Schemas
// ============================================================

export const CreateAudienceSchema = z.object({
  name: z.string().describe("Audience name"),
});

export const GetAudienceSchema = z.object({
  audienceId: z.string().describe("Audience ID"),
});

export const ListAudiencesSchema = z.object({});

export const DeleteAudienceSchema = z.object({
  audienceId: z.string().describe("Audience ID to delete"),
});

// ============================================================
// Domain Schemas
// ============================================================

export const GetDomainSchema = z.object({
  domainId: z.string().describe("Domain ID"),
});

export const ListDomainsSchema = z.object({});
