import { useState } from "react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import Login from "../../components/App-components/Connection/Login/Login";
import Register from "../../components/App-components/Connection/Register/Register";
import Logo from "../../assets/logo.svg";
import styles from "./Connection.module.css";

export default function Connection() {
  const [login, setLogin] = useState(true);

  const handleSwitchLogin = () => {
    setLogin(!login);
  };

  return (
    <div className={styles.connection_page}>
      <section id="connection" className={styles.connection_container}>
        <img className={styles.logo} src={Logo} alt="PR-checker logo" />
        <div className={styles.login_box}>
          {login ? <Login /> : <Register />}
          <button
            type="button"
            className={styles.switch_btn_login_register}
            onClick={handleSwitchLogin}
          >
            {login ? "Je n’ai pas encore de compte" : "J’ai déjà un compte"}
          </button>
        </div>
        <a href="#more-infos" className={styles.more_info_btn}>
          En savoir plus sur PR Checker
        </a>
      </section>
      <section id="more-infos" className={styles.more_infos_container}>
        <a href="#connection">
          <button
            type="button"
            aria-label="retour"
            className={styles.back_to_top}
          >
            <KeyboardDoubleArrowUpIcon />
          </button>
        </a>
        <div className={styles.infos}>
          <h1>Qu’est ce que PR Checker ?</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac
            turpis egestas maecenas pharetra convallis. Feugiat in ante metus
            dictum at tempor. Quisque non tellus orci ac. Felis eget nunc
            lobortis mattis aliquam faucibus purus in massa. Venenatis cras sed
            felis eget velit. In aliquam sem fringilla ut morbi tincidunt augue.
            Nisl condimentum id venenatis a condimentum vitae sapien. Nisl nunc
            mi ipsum faucibus vitae aliquet nec. Proin libero nunc consequat
            interdum varius sit amet mattis. Vitae tortor condimentum lacinia
            quis vel eros donec ac odio. Nunc scelerisque viverra mauris in. In
            nisl nisi scelerisque eu ultrices vitae auctor. Fringilla phasellus
            faucibus scelerisque eleifend donec pretium vulputate. Imperdiet sed
            euismod nisi porta lorem mollis. Facilisi etiam dignissim diam quis.
            Nunc vel risus commodo viverra maecenas accumsan lacus.{" "}
          </p>
        </div>
        <footer className={styles.footer}>
          <div className={styles.separator} />
          <p>Made with pain and tears by WayBackWilders</p>
        </footer>
      </section>
    </div>
  );
}
