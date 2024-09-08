"use client";
import { useState, useEffect } from "react";
import styles from "./Rewards.module.css";
import { useSession } from "next-auth/react";
import { callApi } from "../../../helper";
import Swal from "sweetalert2";

const Rewards = () => {
  const { data: session } = useSession();
  const userToken = session?.id;

  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const minimum_points_to_redeem = rewards?.[0]?.minimum_points_to_redeem;
  const point_value_in_dollars = rewards?.[0]?.point_value_in_dollars;
  const usedCurrency = rewards?.[0]?.country_currency;

  async function fetchData() {
    const response = await callApi({
      type: "get",
      url: "order",
      userToken: userToken,
    });

    if (response.status == 200) {
      setRewards(response.data);
    }
  }

  function handleRedeem() {
    Swal.fire({
      title: "Do you want to redeem?",
      showCancelButton: true,
      confirmButtonText: "Redeem",
      confirmButtonColor: "#017bfe",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Redeemed!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("No redeem", "", "info");
      }
    });
  }

  useEffect(() => {
    if (userToken) {
      fetchData();
      setUserPoints(session?.user?.num_points);
    }
  }, [userToken]);

  useEffect(() => {
    if (point_value_in_dollars > 0 && userPoints > 0) {
      setUserBalance(userPoints * point_value_in_dollars);
    }
  }, [point_value_in_dollars]);

  return (
    <div className={styles.rewardsContainer}>
      <div className={styles.balanceBanner}>
        <h2>
          Your Balance: {usedCurrency} {userBalance.toFixed(2)}{" "}
        </h2>
        <h2>Minimus Points required {minimum_points_to_redeem} Points</h2>
      </div>
      <h2 className={styles.title}>Available Rewards</h2>
      <div className={styles.rewardsGrid}>
        {rewards.map((reward) => (
          <div key={reward.id} className={styles.rewardCard}>
            <img
              src={reward.brand_image}
              alt={reward.brand_en}
              className={styles.rewardImage}
            />
            <h3>{reward.brand_en}</h3>
            <p className={styles.rewardPrice}>
              Price: {usedCurrency} {reward.value_in_votly.toFixed(2)}
            </p>
            <button
              className={styles.redeemButton}
              onClick={handleRedeem}
              disabled={
                !(
                  minimum_points_to_redeem < userPoints &&
                  userBalance >= reward.value_in_votly
                )
              }
            >
              {minimum_points_to_redeem < userPoints &&
              userBalance >= reward.value_in_votly
                ? "Redeem"
                : "Not Enough Balance"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
