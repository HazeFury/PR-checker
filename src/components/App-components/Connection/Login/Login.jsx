import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../../../UI-components/TextInput/TextInput";
import styles from "./Login.module.css";
import ShowPassword from "../../../UI-components/MUIRemix/ShowPassword";
import TooltipIconError from "../../../UI-components/MUIRemix/TooltipIconError";
import supabase from "../../../../services/client";

export default function Login() {
  const revealPassLog = () => {
    const passLog = document.getElementById("passwordLog");
    passLog.type = "text";
  };

  const hidePassLog = () => {
    const passLog = document.getElementById("passwordLog");
    passLog.type = "password";
  };

  const formik = useFormik({
    initialValues: {
      mailLog: "",
      passwordLog: "",
    },
    validationSchema: Yup.object({
      mailLog: Yup.string()
        .email("Adresse mail invalide")
        .required("Veuillez entrer votre adresse mail"),
      passwordLog: Yup.string().required("Veuillez entrer votre mot de passe"),
    }),
    onSubmit: (values) => {
      supabase.auth.signInWithPassword({
        email: values.mailLog,
        password: values.passwordLog,
      });
    },
  });

  return (
    <div className={styles.login}>
      <h1 className={styles.h1}>Connexion</h1>
      <div className={styles.separator} />
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <div className={styles.input}>
          <TextInput
            label="Adresse mail"
            type="mail"
            id="mailLog"
            placeholder="Entrez votre adresse mail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mailLog}
          />
          {formik.touched.mailLog && formik.errors.mailLog ? (
            <TooltipIconError
              tooltip={formik.errors.mailLog}
              top="0"
              left="120px"
            />
          ) : null}
        </div>
        <div className={styles.input}>
          <TextInput
            label="Mot de passe"
            type="password"
            id="passwordLog"
            placeholder="Entrez votre mot de passe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.passwordLog}
          />
          <ShowPassword reveal={revealPassLog} hide={hidePassLog} />
          {formik.touched.passwordLog && formik.errors.passwordLog ? (
            <TooltipIconError
              tooltip={formik.errors.passwordLog}
              top="0"
              left="150px"
            />
          ) : null}
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "100%",
            background: "#3883ba",
            fontFamily: "Montserrat, sans serif",
            marginTop: "1rem",
          }}
        >
          Se connecter
        </Button>
      </form>
    </div>
  );
}
