import PropTypes from "prop-types";
import { Button } from "@mui/material";
import TextInput from "../../UI-components/TextInput/TextInput";
import styles from "./ModalFormRequest.module.css";
import TextArea from "../../UI-components/TextArea/TextArea";

export default function ModalFormRequest({ title, text }) {
  return (
    <div className={styles.form}>
      <h1>{title}</h1>
      <div className={styles.input}>
        <TextInput
          label="Nom de la PR"
          type="text"
          id="name"
          placeholder="Nommez votre PR"
        />
        <TextArea
          label="Description"
          type="text"
          id="description"
          placeholder="Décrivez votre PR"
        />
        <TextInput
          label="Lien Trello"
          type="text"
          id="trelloLink"
          placeholder="Insérez le lien vers Trello"
        />
        <TextInput
          label="Lien Github"
          type="text"
          id="trelloLink"
          placeholder="Insérez le lien vers le repo Github"
        />
      </div>
      <div className={styles.button}>
        <Button variant="contained">{text} </Button>
      </div>
    </div>
  );
}
ModalFormRequest.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
