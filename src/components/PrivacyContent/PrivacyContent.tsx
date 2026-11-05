import React from 'react';
import { Heading } from '@/components/Heading';
import styles from './PrivacyContent.module.scss';

interface PrivacyContentProps {
  heading: string;
  sections: string[];
  headingId?: string;
}

/**
 * Regex to recognize numbered or § section titles like:
 * "1) EINLEITUNG UND KONTAKTDATEN DES VERANTWORTLICHEN"
 * "§ 1 Geltungsbereich"
 */
const SECTION_TITLE_REGEX = /^(?:\d+\)|§\s*\d+[a-zA-Z]?\.?)\s+\S/;

/**
 * Regex to detect numbered paragraph headings like:
 * "1.1 Wir freuen uns..." -> bold "1.1"
 * "12.2 WIDERSPRUCHSRECHT" -> bold "12.2 WIDERSPRUCHSRECHT"
 */
const NUMBERED_LEAD_REGEX = /^(\d+\.\d+)(\s+)(.*)$/;

/**
 * Helper to turn plain URL strings into clickable accessible <a> links
 */
function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s)\]]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={`link-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/**
 * Renders a single line inside a section body
 */
function renderBodyLine(line: string, lineIndex: number) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Bullet point lines starting with •, -, or –
  if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('– ')) {
    const bulletContent = trimmed.replace(/^[•\-–]\s*/, '');
    return (
      <li key={`line-${lineIndex}`} className={styles.listItem}>
        {renderTextWithLinks(bulletContent)}
      </li>
    );
  }

  // Check if line starts with numbered paragraph prefix (e.g. 1.1, 12.2)
  const numberedMatch = trimmed.match(NUMBERED_LEAD_REGEX);
  if (numberedMatch) {
    const [, numberLead, space, rest] = numberedMatch;
    return (
      <p key={`line-${lineIndex}`} className={styles.paragraph}>
        <strong className={styles.numberLead}>{numberLead}</strong>
        {space}
        {renderTextWithLinks(rest)}
      </p>
    );
  }

  // Normal text paragraph
  return (
    <p key={`line-${lineIndex}`} className={styles.paragraph}>
      {renderTextWithLinks(trimmed)}
    </p>
  );
}

export function PrivacyContent({
  heading,
  sections,
  headingId = 'privacy-heading',
}: PrivacyContentProps) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.container}>
        <Heading id={headingId} level="h2" as="h2">
          {heading}
        </Heading>

        <div className={styles.sectionsList}>
          {sections.map((sectionContent, sIndex) => {
            const rawLines = sectionContent.split('\n');
            const firstLine = rawLines[0].trim();
            const bodyLines = rawLines.slice(1);

            const isTitle = SECTION_TITLE_REGEX.test(firstLine);

            return (
              <article key={`privacy-sec-${sIndex}`} className={styles.sectionBlock}>
                {isTitle ? (
                  <Heading level="h5" as="h3">
                    {firstLine}
                  </Heading>
                ) : (
                  renderBodyLine(firstLine, 0)
                )}

                <div className={styles.sectionBody}>
                  {bodyLines.map((line, lIndex) => renderBodyLine(line, lIndex + 1))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
