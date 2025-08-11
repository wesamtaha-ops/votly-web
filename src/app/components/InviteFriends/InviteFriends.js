'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import styles from './InviteFriends.module.css';
import {
  FaEnvelope,
  FaLink,
  FaWhatsapp,
  FaTwitter,
  FaFacebook,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const InviteFriends = () => {
  const { data: session } = useSession();
  const t = useTranslations('InviteFriends');

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = session?.user;
  console.log(user);
  const userHash = user?.user_hash || user?.id; // Use user_hash if available, fallback to id
  const inviteLink = `https://votly.app/?inviter=${userHash}`;

  const openMailApp = (mailtoLink) => {
    try {
      // Method 1: Direct window.location (most compatible)
      window.location.href = mailtoLink;

      // Method 2: Fallback - create and click link
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    } catch (error) {
      console.error('Failed to open mail app:', error);
      // Final fallback - copy to clipboard
      navigator.clipboard.writeText(mailtoLink).then(() => {
        toast.info(t('mailLinkCopied'));
      });
    }
  };

  const handleEmailInvite = () => {
    try {
      const subject = encodeURIComponent(t('emailSubject'));
      const body = encodeURIComponent(`${t('emailBody')}\n\n${inviteLink}`);

      // Create a simple mailto link
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

      // Open in new window/tab (more reliable on mobile)
      window.open(mailtoUrl, '_blank');

      toast.success(t('mailAppOpened'));
    } catch (error) {
      console.error('Email error:', error);
      // Fallback to copying link
      navigator.clipboard.writeText(inviteLink);
      toast.info('Invite link copied! Please paste it in your email.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success(t('linkCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('copyError'));
    }
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(`${t('whatsappMessage')} ${inviteLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareOnTwitter = () => {
    const message = encodeURIComponent(`${t('twitterMessage')} ${inviteLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        inviteLink,
      )}`,
      '_blank',
    );
  };

  return (
    <div className={styles.inviteContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.title}>{t('inviteFriends')}</h1>
        <p className={styles.description}>{t('inviteDescription')}</p>

        <div className={styles.rewardBadge}>
          <span className={styles.rewardAmount}>$0.25</span>
          <span className={styles.rewardText}>{t('rewardPerUser')}</span>
        </div>
      </div>

      {/* Visual Journey Timeline */}
      <div className={styles.journeySection}>
        <h2 className={styles.journeyTitle}>{t('friendJourney')}</h2>
        <p className={styles.journeySubtitle}>{t('journeyDescription')}</p>

        <div className={styles.timeline}>
          <div className={styles.timelineStep}>
            <div className={`${styles.stepIcon} ${styles.step1}`}>
              <FaLink />
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t('step1Title')}</h3>
              <p className={styles.stepDescription}>{t('step1Description')}</p>
            </div>
            <div className={styles.stepNumber}>1</div>
          </div>

          <div className={styles.timelineConnector}></div>

          <div className={styles.timelineStep}>
            <div className={`${styles.stepIcon} ${styles.step2}`}>
              <FaEnvelope />
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t('step2Title')}</h3>
              <p className={styles.stepDescription}>{t('step2Description')}</p>
            </div>
            <div className={styles.stepNumber}>2</div>
          </div>

          <div className={styles.timelineConnector}></div>

          <div className={styles.timelineStep}>
            <div className={`${styles.stepIcon} ${styles.step3}`}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' />
              </svg>
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t('step3Title')}</h3>
              <p className={styles.stepDescription}>{t('step3Description')}</p>
            </div>
            <div className={styles.stepNumber}>3</div>
          </div>

          <div className={styles.timelineConnector}></div>

          <div className={styles.timelineStep}>
            <div className={`${styles.stepIcon} ${styles.step4}`}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <path d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.88 6.13 16 10 16V21H14V16C17.87 16 21 12.88 21 9Z' />
              </svg>
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t('step4Title')}</h3>
              <p className={styles.stepDescription}>{t('step4Description')}</p>
            </div>
            <div className={styles.stepNumber}>4</div>
          </div>

          <div className={styles.timelineConnector}></div>

          <div className={styles.timelineStep}>
            <div
              className={`${styles.stepIcon} ${styles.step5} ${styles.finalStep}`}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z' />
              </svg>
            </div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{t('step5Title')}</h3>
              <p className={styles.stepDescription}>{t('step5Description')}</p>
              <div className={styles.earnAmount}>💰 $0.25</div>
            </div>
            <div className={styles.stepNumber}>💰</div>
          </div>
        </div>

        <div className={styles.unlimitedBox}>
          <h3>{t('unlimitedEarnings')}</h3>
          <p>{t('unlimitedDescription')}</p>
          <div className={styles.autoRewardNote}>{t('autoReward')}</div>
        </div>
      </div>

      {/* Sharing Actions */}
      <div className={styles.actionsSection}>
        <h2 className={styles.actionsTitle}>{t('startInviting')}</h2>

        <div className={styles.linkSection}>
          <h3 className={styles.sectionTitle}>{t('yourInviteLink')}</h3>
          <div className={styles.linkContainer}>
            <input
              type='text'
              value={inviteLink}
              readOnly
              className={styles.linkInput}
            />
            <button
              onClick={copyToClipboard}
              className={styles.copyButton}
              disabled={copied}>
              <FaLink />
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>

        <div className={styles.socialSection}>
          <h3 className={styles.sectionTitle}>{t('shareOnSocial')}</h3>
          <div className={styles.socialButtons}>
            <button
              onClick={handleEmailInvite}
              className={`${styles.socialButton} ${styles.email}`}>
              <FaEnvelope />
              {t('email')}
            </button>
            <button
              onClick={shareOnWhatsApp}
              className={`${styles.socialButton} ${styles.whatsapp}`}>
              <FaWhatsapp />
              {t('whatsapp')}
            </button>
            <button
              onClick={shareOnTwitter}
              className={`${styles.socialButton} ${styles.twitter}`}>
              <FaTwitter />
              {t('twitter')}
            </button>
            <button
              onClick={shareOnFacebook}
              className={`${styles.socialButton} ${styles.facebook}`}>
              <FaFacebook />
              {t('facebook')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;
