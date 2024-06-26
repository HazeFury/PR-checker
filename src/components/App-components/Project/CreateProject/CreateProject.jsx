import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import axios from "axios";
import { Button, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import TextInput from "../../../UI-components/TextInput/TextInput";
import supabase from "../../../../services/client";
import styles from "./CreateProject.module.css";
import refreshContext from "../../../../contexts/RefreshContext";

export default function CreateProject({ openModalCreate, onCloseModalCreate }) {
  const { refreshData, setRefreshData } = useContext(refreshContext);

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  const handleModalCloseCreate = () => {
    onCloseModalCreate(); // Call the function to close the modal
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    // validation form
    validationSchema: Yup.object({
      name: Yup.string().required("Un nom de projet est requis"),
    }),

    onSubmit: async () => {
      try {
        // Get the userId
        const { data: userData } = await supabase.auth.getSession();
        const userId = userData?.session.user.id;
        const userFirstName = userData.session.user.user_metadata.first_name;
        const userLastName = userData.session.user.user_metadata.last_name;

        if (formik.values.name.length >= 30) {
          toast.error("Le nom du projet peut faire au maximum 30 caractères");
          return;
        }

        // To verify if the user already have an project named like this
        let cantCreateProject;
        const { data: existingProjectName, error } = await supabase
          .from("projects")
          .select("name, project_users!inner(role)")
          .eq("project_users.user_uuid", userId);

        if (error) {
          console.error(error);
          toast.error(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
          return;
        }

        existingProjectName.forEach((project) => {
          if (
            project.name === formik.values.name &&
            project.project_users[0].role === "owner"
          ) {
            cantCreateProject = true;
          }
        });
        if (cantCreateProject === true) {
          toast.error("Vous avez déjà un projet avec ce nom !");
          return;
        }

        // To get the picture
        const newPictureForProject = await axios
          .get("https://picsum.photos/1920/1080")
          .then((res) => {
            return res.request.responseURL;
          })
          .catch(() => {
            console.error("Impossible de récupérer une image");
            toast.error("Impossible de récupérer une image");
          });

        if (
          newPictureForProject === "" ||
          newPictureForProject === null ||
          newPictureForProject === undefined
        ) {
          toast.error(
            "Le service d'image est indisponible pour le moment. Veuillez réessayer plus tard"
          );
        }

        // To create the project with name and picture
        const { data: newProject } = await supabase
          .from("projects")
          .insert({ name: formik.values.name, picture: newPictureForProject })
          .select();

        toast.success("Le projet a bien été crée");

        const projectId = newProject[0].id;
        // create the first user related to the project newely created. This user is "role: owner" and "pending: false" by default
        await supabase
          .from("project_users")
          .insert({
            user_uuid: userId,
            user_firstname: userFirstName,
            user_lastname: userLastName,
            project_uuid: projectId,
            role: "owner",
            pending: false,
          })
          .select();

        handleModalCloseCreate(); // close the modal
        formik.resetForm();
        handleRefresh(); // refetch the project list after the creation
      } catch (error) {
        console.error("La création du projet n'a pas fonctionné");
        toast.error("La création du projet a échoué");
      }
    },
  });
  const handleCreateProject = () => {
    formik.handleSubmit();
  };

  // CSS for the modal
  const style = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      sm: "400px",
      md: "670px",
      lg: "690px",
      xl: "710px",
    },
    height: 405,
    backgroundColor: "#292929",
    borderRadius: "0.625rem",
    fontFamily: "Montserrat",
    boxShadow: 24,
    padding: 4,
  };

  return (
    <Modal open={openModalCreate} onClose={handleModalCloseCreate}>
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
  openModalCreate: PropTypes.bool.isRequired,
  onCloseModalCreate: PropTypes.func.isRequired,
};
