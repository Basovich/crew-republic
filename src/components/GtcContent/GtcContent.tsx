'use client';

import React, { useCallback } from 'react';
import { Heading } from '@/components/Heading';
import styles from './GtcContent.module.scss';

export interface GtcTocItem {
  id: string;
  label: string;
}

export interface GtcLinkNode {
  type: 'link';
  href: string;
  label: string;
}

export type GtcInlineNode = string | GtcLinkNode;

export interface GtcParagraphBlock {
  type: 'p';
  lead?: string;
  content: GtcInlineNode[];
}

export interface GtcListBlock {
  type: 'ul';
  items: string[];
}

export type GtcBlock = GtcParagraphBlock | GtcListBlock;

export interface GtcSection {
  id: string;
  title: string;
  blocks: GtcBlock[];
}

export interface GtcContentData {
  heading: string;
  tocTitle: string;
  tocItems: GtcTocItem[];
  sections: GtcSection[];
}

interface GtcContentProps {
  data: GtcContentData;
}

function renderInlineNodes(nodes: GtcInlineNode[]) {
  return nodes.map((node, idx) => {
    if (typeof node === 'string') {
      return <React.Fragment key={`txt-${idx}`}>{node}</React.Fragment>;
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

export function GtcContent({ data }: GtcContentProps) {
  const handleTocClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      window.history.pushState(null, '', `#${targetId}`);
    },
    []
  );

  return (
    <section className={styles.section} aria-labelledby="gtc-heading">
      <div className={styles.container}>
        <Heading id="gtc-heading" level="h2" as="h2">
          {data.heading}
        </Heading>

        {/* Interactive Table of Contents (<ol> > <li> > <a>) */}
        <nav className={styles.tocNav} aria-labelledby="gtc-toc-heading">
          <Heading id="gtc-toc-heading" level="h5" as="h2">
            {data.tocTitle}
          </Heading>
          <ol className={styles.tocList}>
            {data.tocItems.map((item) => (
              <li key={item.id} className={styles.tocItem}>
                <a
                  href={`#${item.id}`}
                  className={styles.tocLink}
                  onClick={(e) => handleTocClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Numbered GTC / AGB Sections */}
        <div className={styles.sectionsList}>
          {data.sections.map((sec) => (
            <article key={sec.id} className={styles.sectionBlock}>
              <Heading
                id={sec.id}
                level="h5"
                as="h2"
                className={styles.sectionHeading}
              >
                {sec.title}
              </Heading>

              <div className={styles.sectionBody}>
                {sec.blocks.map((block, bIdx) => {
                  if (block.type === 'ul') {
                    return (
                      <ul key={`${sec.id}-ul-${bIdx}`} className={styles.bulletList}>
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

