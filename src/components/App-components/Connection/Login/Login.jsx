import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import TextInput from "../../../UI-components/TextInput/TextInput";
import styles from "./Login.module.css";
import TooltipIcon from "../../../UI-components/MUIRemix/TooltipIcon";
import supabase from "../../../../services/client";

export default function Login() {
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
    onSubmit: async (values) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.mailLog,
          password: values.passwordLog,
        });
        if (error) throw error;
        else toast.success(`Bonjour ${data.user.user_metadata.first_name} !`);
      } catch (error) {
        if (error.status === 400)
          toast.error("L'adresse mail et le mot de passe ne correspondent pas");
        else
          toast.error(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
        console.error(error);
      }
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
            <TooltipIcon
              tooltip={formik.errors.mailLog}
              top="0"
              left="120px"
              color="var(--error)"
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
          {formik.touched.passwordLog && formik.errors.passwordLog ? (
            <TooltipIcon
              tooltip={formik.errors.passwordLog}
              top="0"
              left="125px"
              color="var(--error)"
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
