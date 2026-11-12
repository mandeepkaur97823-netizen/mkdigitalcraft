export interface EnquiryMessageFields {
  name: string;
  businessName?: string;
  whatsappNumber: string;
  email?: string;
  service: string;
  timeline?: string;
  budgetRange?: string;
  referenceLink?: string;
  projectDetails: string;
}

/** Formats submitted enquiry details into a ready-to-paste Instagram DM message. */
export function formatEnquiryDmMessage(fields: EnquiryMessageFields): string {
  const lines: string[] = ['Hello MK Digital Craft!', '', 'New Project Enquiry'];

  lines.push(`• Name: ${fields.name.trim()}`);
  if (fields.businessName?.trim()) {
    lines.push(`• Business / Brand: ${fields.businessName.trim()}`);
  }
  lines.push(`• Contact / WhatsApp: ${fields.whatsappNumber.trim()}`);
  if (fields.email?.trim()) {
    lines.push(`• Email: ${fields.email.trim()}`);
  }
  lines.push(`• Service: ${fields.service}`);
  if (fields.timeline?.trim()) {
    lines.push(`• Timeline: ${fields.timeline.trim()}`);
  }
  if (fields.budgetRange?.trim()) {
    lines.push(`• Project Tier: ${fields.budgetRange.trim()}`);
  }
  if (fields.referenceLink?.trim()) {
    lines.push(`• Reference Link: ${fields.referenceLink.trim()}`);
  }
  lines.push('', 'Project Details:', fields.projectDetails.trim());

  return lines.join('\n');
}

/** Copies the formatted message to clipboard (with fallback) and returns whether copying succeeded. */
export async function copyMessageToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to execCommand below for restricted mobile browsers
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
