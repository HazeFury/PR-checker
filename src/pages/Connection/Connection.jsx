import { useState } from "react";
import Login from "../../components/App-components/Connection/Login/Login";
import Register from "../../components/App-components/Connection/Register/Register";
import Logo from "../../assets/logo.svg";
import "../../App.css";
import styles from "./Connection.module.css";

export default function Connection() {
  const [login, setLogin] = useState(true);

  const handleSwitchLogin = () => {
    setLogin(!login);
  };
  return (
    <section id="top_section" className={styles.connection_container}>
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
      <a href="#more_infos_container" className={styles.more_info_btn}>
        C&#39;est quoi PR checker ?
      </a>
    </section>
    // il reste à faire la partie "plus d'infos" en dessous
  );
}
