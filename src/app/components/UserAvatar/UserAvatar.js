"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { callApi } from "../../helper";
import styles from "./UserAvatar.module.css";
import { FaUser, FaWallet, FaChevronDown } from "react-icons/fa";
import Image from "next/image";

const UserAvatar = () => {
  const { data: session } = useSession();
  const userToken = session?.id;
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const isArabic = locale === "ar";
  
  const [userBalance, setUserBalance] = useState(session?.user?.syno_balance || 0);
  const [convertedBalance, setConvertedBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState("AED");

  // Get user balance
  const getUserBalance = async () => {
    if (!userToken) return;
    
    try {
      setLoading(true);
      const res = await callApi({
        type: "get",
        url: "balance",
        userToken: userToken,
        lang: locale,
      });
      
      // Check multiple possible response structures
      if (res?.user?.syno_balance !== undefined) {
        setUserBalance(res.user.syno_balance);
      } else if (res?.data?.balance !== undefined) {
        setUserBalance(res.data.balance);
      } else if (res?.balance !== undefined) {
        setUserBalance(res.balance);
      } else if (session?.user?.syno_balance !== undefined) {
        // Fallback to session data
        setUserBalance(session.user.syno_balance);
      }
      
      // Get currency from user data
      if (session?.user?.country_currency) {
        setCurrency(session.user.country_currency);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      // Fallback to session data if API fails
      if (session?.user?.syno_balance !== undefined) {
        setUserBalance(session.user.syno_balance);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      getUserBalance();
    }
    // Initialize currency from session
    if (session?.user?.country_currency) {
      setCurrency(session.user.country_currency);
    }
  }, [userToken, locale, session?.user?.country_currency]);

  // Apply currency conversion when userBalance or conversion rate changes
  useEffect(() => {
    if (userBalance > 0) {
      const conversionRate = session?.user?.countryDetails?.conversion_value ?? 0;
      setConvertedBalance(userBalance * conversionRate);
    }
  }, [userBalance, session?.user?.countryDetails?.conversion_value]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Don't render if no session
  if (!session?.user) return null;

  const user = session.user;
  const userName = `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email;
  const userImage = user.image || user.profile_picture || null;

  // Get display currency
  let displayCurrency = currency;
  if (currency === "AED" && isArabic) {
    displayCurrency = "درهم";
  } else if (currency === "SAR" && isArabic) {
    displayCurrency = "ريال";
  }

  return (
    <div className={styles.avatarContainer} lang={locale} dir={isArabic ? "rtl" : "ltr"}>
      {/* Main Avatar Button - Compact Design */}
      <button 
        className={styles.avatarButton} 
        onClick={toggleDropdown}
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
      >
        <div className={styles.avatarContent}>
          {/* User Image */}
          <div className={styles.imageContainer}>
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={40}
                height={40}
                className={styles.userImage}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                <FaUser />
              </div>
            )}
            <div className={styles.onlineIndicator}></div>
          </div>

          {/* Balance Badge - Modern Pill Design */}
          <div className={styles.balanceBadge}>
            {loading ? (
              <div className={styles.loadingDots}>
                <span></span><span></span><span></span>
              </div>
            ) : (
              <>
                <FaWallet className={styles.walletIcon} />
                <span className={styles.balanceAmount}>
                  {convertedBalance.toFixed(2)}
                </span>
                <span className={styles.currencyLabel}>
                  {displayCurrency}
                </span>
              </>
            )}
          </div>

          {/* Dropdown Arrow */}
          <FaChevronDown 
            className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.rotated : ''}`} 
          />
        </div>
      </button>

      {/* Enhanced Dropdown Menu */}
      {isDropdownOpen && (
        <>
          <div className={styles.backdrop} onClick={closeDropdown}></div>
          <div className={styles.dropdown}>
            {/* User Profile Section */}
            <div className={styles.dropdownProfile}>
              <div className={styles.dropdownAvatar}>
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={60}
                    height={60}
                    className={styles.dropdownUserImage}
                  />
                ) : (
                  <div className={styles.dropdownDefaultAvatar}>
                    <FaUser />
                  </div>
                )}
              </div>
              <div className={styles.dropdownUserInfo}>
                <div className={styles.dropdownUserName}>{userName}</div>
                <div className={styles.dropdownUserEmail}>{user.email}</div>
              </div>
            </div>
            
            {/* Balance Card */}
            <div className={styles.balanceCard}>
              <div className={styles.balanceCardHeader}>
                <FaWallet className={styles.balanceCardIcon} />
                <span className={styles.balanceCardLabel}>{t("availableBalance")}</span>
              </div>
              <div className={styles.balanceCardAmount}>
                {loading ? (
                  <div className={styles.loadingDots}>
                    <span></span><span></span><span></span>
                  </div>
                ) : (
                  <>
                    <span className={styles.balanceMainAmount}>
                      {convertedBalance.toFixed(2)}
                    </span>
                    <span className={styles.balanceCurrency}>
                      {displayCurrency}
                    </span>
                  </>
                )}
              </div>
              <div className={styles.balanceCardFooter}>
                <button 
                  className={styles.redeemButton}
                  onClick={() => {
                    closeDropdown();
                    router.push(`/${locale}/rewards`);
                  }}
                >
                  {t("rewards")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAvatar;
