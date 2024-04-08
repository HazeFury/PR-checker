import { Button } from "@mui/material";
import styles from "./NotFoundPage.module.css";
import logo from "../../assets/logo.svg";

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundPage}>
      <img src={logo} alt="logo" />
      <div className={styles.notFoundBlock}>
        <h1>404</h1>
        <p>Une erreur s'est produite</p>
        <Button variant="contained">
          {" "}
          <a href="/">Retourner en lieu sûr</a>
        </Button>
      </div>
    </div>
  );
}
