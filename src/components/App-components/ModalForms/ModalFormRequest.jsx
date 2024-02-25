import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useFormik } from "formik";

import TextInput from "../../UI-components/TextInput/TextInput";
import styles from "./ModalFormRequest.module.css";
import TextArea from "../../UI-components/TextArea/TextArea";
import supabase from "../../../services/client";

export default function ModalFormRequest({ title, text, projectId }) {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      trello: "",
      github: "",
    },

    onSubmit: async (values) => {
      try {
        // Catch user id for this session
        const { data } = await supabase.auth.getSession();
        const userId = data.session.user.id;
        // Add project_uuid to the form data
        const requestData = {
          ...values,
          project_uuid: projectId,
          user_uuid: userId,
        };

        // Add data to pr_request table with Supabase
        await supabase.from("pr_request").insert([requestData]);
      } catch (error) {
        console.error("L'enregistrement n'a pas fonctionné");
      }
    },
  });
  const handleSaveClick = () => {
    formik.handleSubmit();
  };

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <h1>{title}</h1>
      <div className={styles.input}>
        <TextInput
          label="Nom de la PR"
          type="text"
          id="title"
          placeholder="Nommez votre PR"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
        />
        <TextArea
          label="Description"
          type="text"
          id="description"
          placeholder="Décrivez votre PR"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        <TextInput
          label="Lien Trello"
          type="text"
          id="trello"
          placeholder="Insérez le lien vers Trello"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.trello}
        />
        <TextInput
          label="Lien Github"
          type="text"
          id="github"
          placeholder="Insérez le lien vers Github"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.github}
        />
      </div>
      <div className={styles.button}>
        <Button
          variant="contained"
          onClick={handleSaveClick}
          sx={{
            width: ["100%", "100%", "40%"],
            background: "#3883ba",
            fontFamily: "Montserrat, sans serif",
          }}
        >
          {text}{" "}
        </Button>
      </div>
    </form>
  );
}
ModalFormRequest.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
};
