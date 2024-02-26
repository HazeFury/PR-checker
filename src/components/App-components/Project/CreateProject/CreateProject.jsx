import { useFormik } from "formik";
import PropTypes from "prop-types";
import axios from "axios";
import { Button, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextInput from "../../../UI-components/TextInput/TextInput";
import supabase from "../../../../services/client";
import styles from "./CreateProject.module.css";

export default function CreateProject({ open, onClose, handleRefresh }) {
  const handleModalCloseCreate = () => {
    onClose(); // Appel de la fonction onClose pour fermer la modal
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async () => {
      try {
        // Get the userId
        const { data: userData } = await supabase.auth.getSession();
        const userId = userData?.session.user.id;
        console.info("le userId est : ", userId);

        // To get the picture
        const newPictureForProject = await axios
          .get("https://source.unsplash.com/random?wallpapers")
          .then((res) => {
            return res.request.responseURL;
          })
          .catch((err) => {
            console.error(err);
          });

        // To create the project with name and picture
        const { data: newProject } = await supabase
          .from("projects")
          .insert({ name: formik.values.name, picture: newPictureForProject })
          .select();

        const projectId = newProject[0].id;
        // create the first user related to the project newely created. This user is "role: owner" and "pending: false" by default
        await supabase
          .from("project_users")
          .insert({
            user_uuid: userId,
            project_uuid: projectId,
            role: "owner",
            pending: false,
          })
          .select();

        handleModalCloseCreate(); // close the modal
        handleRefresh();
      } catch (error) {
        console.error("La création du projet n'a pas fonctionné");
        // [TODO : toast pour l'erreur !]
      }
    },
  });
  const handleCreateProject = () => {
    formik.handleSubmit();
  };

  const style = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 690,
    height: 405,
    backgroundColor: "#292929",
    borderRadius: "0.625rem",
    boxShadow: 24,
    padding: 4,
  };

  return (
    <Modal open={open} onClose={handleModalCloseCreate}>
      <Box sx={style}>
        <IconButton
          style={{
            position: "absolute",
            top: "0.3rem",
            right: "0.3rem",
            backgroundColor: "#A82B2B",
            width: "2.3rem",
            height: "2.5rem",
            borderRadius: "0px 7px 0px 10px",
          }}
          onClick={handleModalCloseCreate}
          aria-label="close"
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <h2>Créer un projet</h2>
          <div className={styles.input}>
            <TextInput
              label="Rentrez le nom du projet"
              type="text"
              id="name"
              placeholder="Nom du projet"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              labelStyle={{ fontSize: "4rem", fontWeight: "bold" }}
            />
          </div>
          <div className={styles.button}>
            <Button
              variant="contained"
              onClick={handleCreateProject}
              sx={{
                width: "12.625rem",
                height: "3.813rem",
                background: "#3883ba",
                fontFamily: "Montserrat, sans serif",
                fontWeight: "600",
                fontSize: "1rem",
                top: "-25%",
              }}
            >
              Créer
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

CreateProject.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};
