"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { callApi } from "../../helper";
import styles from "./UserAvatar.module.css";
import { FaUser, FaWallet, FaChevronDown } from "react-icons/fa";
import Image from "next/image";

const UserAvatar = () => {
  const { data: session } = useSession();
  const userToken = session?.id;
  const t = useTranslations("Header");
  const locale = useLocale();
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
    <div className={styles.avatarContainer}>
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

          {/* User Info */}
          <div className={styles.userInfo}>
            <div className={styles.userName}>{userName}</div>
            <div className={styles.userBalance}>
              <FaWallet className={styles.walletIcon} />
              {loading ? (
                <span className={styles.loadingBalance}>...</span>
              ) : (
                <span className={styles.balanceAmount}>
                  {convertedBalance.toFixed(2)} {displayCurrency}
                </span>
              )}
            </div>
          </div>

          {/* Dropdown Arrow */}
          <FaChevronDown 
            className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.rotated : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          <div className={styles.backdrop} onClick={closeDropdown}></div>
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <div className={styles.dropdownUserInfo}>
                <div className={styles.dropdownUserName}>{userName}</div>
                <div className={styles.dropdownUserEmail}>{user.email}</div>
              </div>
            </div>
            
            <div className={styles.dropdownBalance}>
              <div className={styles.balanceLabel}>{t("availableBalance")}</div>
              <div className={styles.balanceValue}>
                {loading ? (
                  <span className={styles.loadingBalance}>...</span>
                ) : (
                  <span>{convertedBalance.toFixed(2)} {displayCurrency}</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAvatar;
