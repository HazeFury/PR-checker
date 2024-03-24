import { useFormik } from "formik";
import PropTypes from "prop-types";
import { Button, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import TextInput from "../../../UI-components/TextInput/TextInput";
import supabase from "../../../../services/client";
import styles from "./JoinProject.module.css";

export default function JoinProject({ openModalJoin, onCloseModalJoin }) {
  const handleModalCloseJoin = () => {
    onCloseModalJoin(); // Appel de la fonction onClose pour fermer la modal
  };

  const formik = useFormik({
    initialValues: {
      project_id: "",
    },
    onSubmit: async () => {
      try {
        // Get the userId
        const { data: userData } = await supabase.auth.getSession();
        const userId = userData?.session.user.id;
        const userFirstName = userData.session.user.user_metadata.first_name;
        const userLastName = userData.session.user.user_metadata.last_name;

        // Check if the project exists
        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .eq("id", formik.values.project_id)
          .single();

        if (!projectData) {
          toast.error("Le projet n'existe pas");
          return;
        }

        // Ask to join the project
        await supabase
          .from("project_users")
          .insert({
            user_uuid: userId,
            user_firstname: userFirstName,
            user_lastname: userLastName,
            project_uuid: formik.values.project_id,
            pending: true, // Pending until accepted by project owner
          })
          .select();

        handleModalCloseJoin();
        toast.success("Votre demande a bien été envoyée");
      } catch (error) {
        toast.error("Votre demande n'a pas fonctionnée");
      }
    },
  });
  const handleJoinProject = () => {
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
    fontFamily: "Montserrat",
    boxShadow: 24,
    padding: 4,
  };

  return (
    <Modal open={openModalJoin} onClose={handleModalCloseJoin}>
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
          onClick={handleModalCloseJoin}
          aria-label="close"
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <h2>Rejoindre un projet</h2>
          <div className={styles.input}>
            <TextInput
              label="Rentrez l'ID du projet"
              type="text"
              id="project_id"
              placeholder="ID du projet"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.project_id}
              labelStyle={{ fontSize: "4rem", fontWeight: "bold" }}
            />
          </div>
          <div className={styles.button}>
            <Button
              variant="contained"
              onClick={handleJoinProject}
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
              Rejoindre
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

JoinProject.propTypes = {
  openModalJoin: PropTypes.bool.isRequired,
  onCloseModalJoin: PropTypes.func.isRequired,
};
