"use client";
import { useState, useEffect } from "react";
import styles from "./Rewards.module.css";
import { useSession } from "next-auth/react";
import { callApi } from "../../../helper";

// const rewards = [
//   {
//     id: 1,
//     name: "Happenis Gift Card",
//     price: 60,
//     image:
//       "https://cdn.merchant-console.yougotagift.com/media/brands/image/2ea965a1-01ec-4efa-8254-2ce656c384c7.png",
//   },
//   {
//     id: 2,
//     name: "Noon Gift Card",
//     price: 5,
//     image:
//       "https://cdn.merchant-console.yougotagift.com/media/brands/image/1fcf9521-35cf-4402-a496-65be1e4f981d.jpg",
//   },
//   {
//     id: 3,
//     name: "Amazon Gift Card",
//     price: 20,
//     image:
//       "https://cdn.merchant-console.yougotagift.com/media/brands/image/f375361e-7604-4adb-8be7-839b144adab1.png",
//   },
//   {
//     id: 1,
//     name: "Virgin Gift Card",
//     price: 60,
//     image:
//       "https://cdn.merchant-console.yougotagift.com/media/brands/image/194b920f-3885-439f-9a9f-c369043c02e7.png",
//   },
//   {
//     id: 2,
//     name: "Talabat Gift Card",
//     price: 5,
//     image:
//       "https://cdn.merchant-console.yougotagift.com/media/brands/image/f08603bc-033d-43d3-9fb2-25a52378972d.png",
//   },
//   {
//     id: 3,
//     name: "IKIA Gift Card",
//     price: 100,
//     image:
//       "https://cdn.merchant-console.yougotagift.com/media/brands/image/c6f3e6b6-bd6e-4159-85bc-d72977830b4f.png",
//   },
//   // Add more rewards as needed
// ];

const Rewards = () => {
  const userBalance = 18; // Example user balance

  const [rewards, setRewards] = useState([]);

  const { data: session } = useSession();
  const userToken = session?.id;

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

  useEffect(() => {
    if (userToken) {
      fetchData();
    }
  }, [userToken]);

  return (
    <div className={styles.rewardsContainer}>
      <div className={styles.balanceBanner}>
        <h2>Your Balance: ${userBalance.toFixed(2)}</h2>
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
              Price: ${reward.value_in_votly.toFixed(2)}
            </p>
            <button
              className={styles.redeemButton}
              disabled={userBalance < reward.value_in_votly}
            >
              {userBalance >= reward.value_in_votly
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
