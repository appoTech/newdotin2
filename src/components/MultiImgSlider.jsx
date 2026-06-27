import React, { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import classes from "./Styles.module.css";

import bhuvanLogo from "../assets/users/bhuvan.avif";
import midasLogo from "../assets/users/midas.avif";
import RaftaarLogo from "../assets/users/Raftaar.avif";
import RahulDuaLogo from "../assets/users/Rahul-dua.avif";
import twoSidedGamersLogo from "../assets/users/two-sided-gamers.avif";

const MultiImgSlider = () => {
  return (
    <>
      <div className={classes.sliderContainer}>
        <div className={classes.stakeHolderInfo}>
          <div className={classes.profileImg}>
            <img src={bhuvanLogo} alt="Logo" />
          </div>
          <div className={classes.info}>
            <h4>Bhuvan Bam</h4>
            <a
              style={{ textDecoration: "none" }}
              href="http://dhindora.appopener.com/"
              target="_blank"
            >
              dhindora.appopener.com
            </a>
          </div>
          <div className={classes.twitterIcon}>
            <FaYoutube style={{ color: "red" }} />
          </div>
        </div>

        <div className={classes.stakeHolderInfo}>
          <div className={classes.profileImg}>
            <img src={midasLogo} alt="Logo" />
          </div>
          <div className={classes.info}>
            <h4>Midas</h4>
            <a
              style={{ textDecoration: "none" }}
              href="http://midas.appopener.com/"
              target="_blank"
            >
              midas.appopener.com
            </a>
          </div>
          <div className={classes.twitterIcon}>
            <FaYoutube style={{ color: "red" }} />
          </div>
        </div>

        <div className={classes.stakeHolderInfo}>
          <div className={classes.profileImg}>
            <img src={RaftaarLogo} alt="Logo" />
          </div>
          <div className={classes.info}>
            <h4>Raftaar</h4>

            <a
              style={{ textDecoration: "none" }}
              href="http://ghanaKasoota.appopener.com/"
              target="_blank"
            >
              ghanaKasoota.appopener.com
            </a>
          </div>
          <div className={classes.twitterIcon}>
            <FaYoutube style={{ color: "red" }} />
          </div>
        </div>

        <div className={classes.stakeHolderInfo}>
          <div className={classes.profileImg}>
            <img src={RahulDuaLogo} alt="Logo" />
          </div>
          <div className={classes.info}>
            <h4>Rahul Dua</h4>
            <a
              style={{ textDecoration: "none" }}
              href="http://rahuldua.appopener.com/"
              target="_blank"
            >
              rahuldua.appopener.com
            </a>
          </div>
          <div className={classes.twitterIcon}>
            <FaYoutube style={{ color: "red" }} />
          </div>
        </div>

        <div className={classes.stakeHolderInfo}>
          <div className={classes.profileImg}>
            <img src={twoSidedGamersLogo} alt="Logo" />
          </div>
          <div className={classes.info}>
            <h4>Two sided gamers </h4>

            <a
              style={{ textDecoration: "none" }}
              href="http://2sidedgamers.appopener.com/"
              target="_blank"
            >
              2sidedgamers.appopener.com
            </a>
          </div>
          <div className={classes.twitterIcon}>
            <FaYoutube style={{ color: "red" }} />
          </div>
        </div>
      </div>
    </>
  );
};
export default MultiImgSlider;
