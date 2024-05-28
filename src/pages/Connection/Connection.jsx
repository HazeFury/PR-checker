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
          <div>
            <h2>
              Bienvenue sur PR-Checker, l'outil révolutionnaire de gestion des
              pull requests conçu par une équipe de passionnés, pour simplifier
              votre flux de développement collaboratif.
            </h2>
            <br />
            <br />
            <h3> Comment ça fonctionne ?</h3> <br />
            <p>
              {" "}
              Vous pouvez créer un compte et rejoindre des projets existants ou
              en créer de nouveaux en toute simplicité.
              <br />
              <br />
              Une fois que vous avez rejoint un projet, vous serez en attente
              jusqu'à ce que le propriétaire du projet vous accepte. Lorsque
              vous êtes intégré à un projet, vous pouvez soumettre des demandes
              de pull request en toute confiance, sachant qu'elles seront
              examinées par le propriétaire du projet ou le formateur désigné.{" "}
              <br />
              <br /> Le tableau de bord intuitif offre aux propriétaires de
              projet une vue d'ensemble de leurs membres, des demandes de
              participation en attente et des fonctionnalités de modification de
              projet.
              <br />
              <br />
              D'abord conçu pour les formateurs et leurs élèves en développement
              web, PR-Checker évolue vers une solution polyvalente pour les
              entreprises. Basé sur l'expérience d'un de nos développeurs, il
              résoud les défis de gestion des pull requests, offrant une
              solution robuste pour le développement collaboratif.
              <br /> <br />{" "}
            </p>
            <h3 className={styles.endOfText}>
              Découvrez dès maintenant PR-Checker et révolutionnez votre façon
              de gérer les pull requests !
            </h3>
          </div>
        </div>
        <footer className={styles.footer}>
          <p>
            Un problème à nous signaler ? Contactez-nous par mail à l'adresse
            <a
              className={styles.contact_mail_link}
              href="mailto:contact.pr.checker@gmail.com"
            >
              contact.pr.checker@gmail.com
            </a>
          </p>
          <div className={styles.separator} />
          <p>
            {" "}
            🧑🏼‍💻Réalisé avec passion par
            <a href="https://github.com/HazeFury">Marco</a>,
            <a href="https://github.com/anthonydscrs">Anthony</a>,
            <a href="https://github.com/Wraethh">Guillaume</a> and{" "}
            <a href="https://github.com/VanessaGrd">Vanessa</a>
          </p>
        </footer>
      </section>
    </div>
  );
}
