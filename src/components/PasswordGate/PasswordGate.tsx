'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/Button/Button';
import { PASSWORD_GATE_CONFIG, checkPassword } from '@/lib/auth/passwordGate';
import styles from './PasswordGate.module.scss';

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if the cookie already exists and is valid
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${PASSWORD_GATE_CONFIG.COOKIE_NAME}=`));

    const token = match ? match.split('=')[1] : null;
    const isAuthed = token === PASSWORD_GATE_CONFIG.TOKEN_VALUE;

    queueMicrotask(() => {
      setIsAuthenticated(isAuthed);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (checkPassword(passwordInput)) {
      // Set secure cookie for 30 days
      const maxAge = PASSWORD_GATE_CONFIG.MAX_AGE_DAYS * 24 * 60 * 60;
      document.cookie = `${PASSWORD_GATE_CONFIG.COOKIE_NAME}=${PASSWORD_GATE_CONFIG.TOKEN_VALUE}; path=/; max-age=${maxAge}; SameSite=Lax`;

      setHasError(false);
      setIsAuthenticated(true);
    } else {
      setHasError(true);
    }
  };

  // Prevent flash of content or gate while checking cookie
  if (isAuthenticated === null) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 999999,
        }}
      />
    );
  }

  // Once authenticated, render normal website content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, lock everything and render the PasswordGate
  return (
    <div className={styles.gateContainer} role="dialog" aria-modal="true" aria-label="Protected Access">
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/Logo-Header.svg"
            alt="CREW Republic"
            width={157}
            height={146}
            priority
            className={styles.logoImage}
          />
        </div>

        <Heading level="h4" as="h1" className={styles.title}>
          PROTECTED ACCESS
        </Heading>

        <p className={styles.subtitle}>
          This website is currently private. Please enter the access password to continue.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              placeholder="Enter access password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                if (hasError) setHasError(false);
              }}
              autoFocus
              className={`${styles.input} ${hasError ? styles.inputError : ''}`}
            />
          </div>

          {hasError && (
            <p className={styles.errorMessage} role="alert">
              Incorrect password. Please try again.
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className={styles.submitButton}
          >
            ENTER
          </Button>
        </form>
      </div>
    </div>
  );
}

