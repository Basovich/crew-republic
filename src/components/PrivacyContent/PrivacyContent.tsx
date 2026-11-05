import React from 'react';
import { Heading } from '@/components/Heading';
import styles from './PrivacyContent.module.scss';

export interface PrivacyLinkNode {
  type: 'link';
  href: string;
  label: string;
}

export interface PrivacyBrNode {
  type: 'br';
}

export type PrivacyInlineNode = string | PrivacyLinkNode | PrivacyBrNode;

export interface PrivacyParagraphBlock {
  type: 'p';
  lead?: string;
  content: PrivacyInlineNode[];
}

export interface PrivacyListBlock {
  type: 'ul';
  items: string[];
}

export type PrivacyBlock = PrivacyParagraphBlock | PrivacyListBlock;

export interface PrivacySection {
  id: string;
  title: string;
  blocks: PrivacyBlock[];
}

export interface PrivacyContentData {
  heading: string;
  sections: PrivacySection[];
}

interface PrivacyContentProps {
  data: PrivacyContentData;
  headingId?: string;
}

function renderInlineNodes(nodes: PrivacyInlineNode[]) {
  return nodes.map((node, idx) => {
    if (typeof node === 'string') {
      return <React.Fragment key={`txt-${idx}`}>{node}</React.Fragment>;
    }
    if (node.type === 'br') {
      return <br key={`br-${idx}`} />;
    }
    return (
      <a
        key={`lnk-${idx}`}
        href={node.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {node.label}
      </a>
    );
  });
}

export function PrivacyContent({
  data,
  headingId = 'privacy-heading',
}: PrivacyContentProps) {
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.container}>
        <Heading id={headingId} level="h2" as="h2">
          {data.heading}
        </Heading>

        <div className={styles.sectionsList}>
          {data.sections.map((sec) => (
            <article key={sec.id} className={styles.sectionBlock}>
              <Heading id={sec.id} level="h5" as="h2">
                {sec.title}
              </Heading>

              <div className={styles.sectionBody}>
                {sec.blocks.map((block, bIdx) => {
                  if (block.type === 'ul') {
                    return (
                      <ul
                        key={`${sec.id}-ul-${bIdx}`}
                        className={styles.bulletList}
                      >
                        {block.items.map((item, iIdx) => (
                          <li
                            key={`${sec.id}-li-${bIdx}-${iIdx}`}
                            className={styles.bulletItem}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={`${sec.id}-p-${bIdx}`} className={styles.paragraph}>
                      {block.lead && (
                        <>
                          <b className={styles.leadBold}>{block.lead}</b>
                          {'\u00A0'}
                        </>
                      )}
                      {renderInlineNodes(block.content)}
                    </p>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
