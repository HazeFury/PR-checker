import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import TextInput from "../../../UI-components/TextInput/TextInput";
import styles from "./Register.module.css";
import TooltipIcon from "../../../UI-components/MUIRemix/TooltipIcon";
import supabase from "../../../../services/client";

export default function Register() {
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      mail: "",
      password: "",
      confirm: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Veuillez entrer votre prénom"),
      lastname: Yup.string().required("Veuillez entrer votre nom"),
      mail: Yup.string()
        .email("Adresse mail invalide")
        .required("Veuillez entrer votre adresse mail"),
      password: Yup.string()
        .matches(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{14,}$",
          "Le mot de passe doit contenir au moins 14 caractères, dont 1 minuscule, 1 majuscule, 1 chiffre et 1 symbole (@$!%*?&)"
        )
        .required("Veuillez entrer un mot de passe"),
      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
        .required("Veuillez confirmer votre mot de passe"),
    }),
    onSubmit: async (values) => {
      try {
        const { error } = await supabase.auth.signUp({
          email: values.mail,
          password: values.password,
          options: {
            data: {
              first_name: values.firstname,
              last_name: values.lastname,
            },
          },
        });
        if (error) throw error;
        else toast.info("Un mail de validation vous a été envoyé");
      } catch (error) {
        toast.error("Une erreur s'est produite, veuillez réessayer plus tard");
        console.error(error);
      }
    },
  });

  return (
    <div className={styles.register}>
      <h1 className={styles.h1}>Inscription</h1>
      <div className={styles.separator} />
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <div className={styles.inputGroup}>
          <div className={styles.input}>
            <TextInput
              label="Prénom"
              type="text"
              id="firstname"
              placeholder="Entrez votre prénom"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstname}
            />
            {formik.touched.firstname && formik.errors.firstname ? (
              <TooltipIcon
                tooltip={formik.errors.firstname}
                top="0"
                left="80px"
                color="var(--error)"
              />
            ) : null}
          </div>
          <div className={styles.input}>
            <TextInput
              label="Nom"
              type="text"
              id="lastname"
              placeholder="Entrez votre nom"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastname}
            />
            {formik.touched.lastname && formik.errors.lastname ? (
              <TooltipIcon
                tooltip={formik.errors.lastname}
                top="0"
                left="50px"
                color="var(--error)"
              />
            ) : null}
          </div>
        </div>
        <div className={styles.mail}>
          <TextInput
            label="Adresse mail"
            type="mail"
            id="mail"
            placeholder="Entrez votre adresse mail"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mail}
          />
          {formik.touched.mail && formik.errors.mail ? (
            <TooltipIcon
              tooltip={formik.errors.mail}
              top="0"
              left="120px"
              color="var(--error)"
            />
          ) : null}
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.input}>
            <TextInput
              label="Mot de passe"
              type="password"
              id="password"
              placeholder="Entrez un mot de passe"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <TooltipIcon
                tooltip={formik.errors.password}
                top="1px"
                left="125px"
                color="var(--error)"
              />
            ) : null}
          </div>
          <div className={styles.input}>
            <TextInput
              label="Confirmation"
              type="password"
              id="confirm"
              placeholder="Entrez à nouveau le mot de passe"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirm}
            />
            {formik.touched.confirm && formik.errors.confirm ? (
              <TooltipIcon
                tooltip={formik.errors.confirm}
                top="1px"
                left="125px"
                color="var(--error)"
              />
            ) : null}
          </div>
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: ["100%", "100%", "40%"],
            background: "#3883ba",
            fontFamily: "Montserrat, sans serif",
            marginTop: "1rem",
          }}
        >
          S&#39;inscrire
        </Button>
      </form>
    </div>
  );
}
