import classes from "../components/Styles.module.css";
import { Link } from "react-router-dom";
// import DiwaliCard from "../assets/diwali_card.jpg";

import DiwaliCard1 from "../assets/diwali_card.jpg";
import DiwaliCard2 from "../assets/diwali_card_2.jpg";
import DiwaliCard3 from "../assets/diwali_card_3.jpg";
import DiwaliCard4 from "../assets/diwali_card_4.jpg";

const imagesList = [
  { id: 1, imgUrl: DiwaliCard1 },
  { id: 2, imgUrl: DiwaliCard2 },
  { id: 3, imgUrl: DiwaliCard3 },
  { id: 4, imgUrl: DiwaliCard4 },
];

export default function SharedCard(params) {
  const name = params.match.params.name;
  const imageId = parseInt(params.match.params.id);

  let setectedImage;

  imagesList.forEach((e) => {
    if (e.id === imageId) {
      setectedImage = e;
    }
  });

  return (
    <>
      <div className={classes.diwali_page}>
        {name && (
          <div className={classes.send_container}>
            <div className={classes.diwali_card}>
              <div id="diwaliCard" className={classes.card_container}>
                <img src={setectedImage.imgUrl} alt="" />
                <div className={classes.card_content}>
                  <p className={classes.nameOnCard}>{name}</p>
                  <p className={classes.wishes}>Wishes you</p>
                  <p className={classes.happy}>HAPPY</p>
                  <p className={classes.diwali}>Diwali</p>
                  <p className={classes.message}>
                    With the shining of diyas and the echoes of the chants, may
                    prosperity and happiness of the festival of lights fill our
                    lives.
                  </p>
                </div>
                <div className={classes.send_button}>
                  <Link to="/:apptype/:shorturl">
                    <button>Send Wishes</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
