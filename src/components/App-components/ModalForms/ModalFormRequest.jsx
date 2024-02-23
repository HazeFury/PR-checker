import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useFormik } from "formik";

import TextInput from "../../UI-components/TextInput/TextInput";
import styles from "./ModalFormRequest.module.css";
import TextArea from "../../UI-components/TextArea/TextArea";

export default function ModalFormRequest({ title, text }) {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      trello: "",
      github: "",
    },

    onSubmit: async (values) => {
      console.error("Form values:", values);
    },
  });
  const handleSaveClick = () => {
    formik.handleSubmit(); // Trigger form submission
  };

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <h1>{title}</h1>
      <div className={styles.input}>
        <TextInput
          label="Nom de la PR"
          type="text"
          id="name"
          placeholder="Nommez votre PR"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
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
};
