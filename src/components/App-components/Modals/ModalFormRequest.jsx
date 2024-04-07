import PropTypes from "prop-types";
import { Modal, Button } from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import { useEffect, useState, useContext } from "react";
import { useTheme } from "@emotion/react";
import refreshContext from "../../../contexts/RefreshContext";

import TextInput from "../../UI-components/TextInput/TextInput";
import styles from "./ModalFormRequest.module.css";
import TextArea from "../../UI-components/TextArea/TextArea";
import supabase from "../../../services/client";
import TooltipIcon from "../../UI-components/MUIRemix/TooltipIcon";

export default function ModalFormRequest({
  projectId,
  handleClose,
  handleOpenConfirmationModal,
  requestId,
  handleCreateOrUpdateRequest,
  openModalAboutRequest,
}) {
  const theme = useTheme();

  // state to manage the data of request
  const [requestData, setRequestData] = useState(null);

  const { refreshData, setRefreshData } = useContext(refreshContext);

  // function to fetch data of the PR which is used
  useEffect(() => {
    if (requestId !== null) {
      const fetchPRData = async () => {
        try {
          const { data } = await supabase
            .from("pr_request")
            .select("*")
            .eq("id", requestId);

          setRequestData(data[0]);
        } catch (error) {
          console.error("Erreur lors de la récupération des données de la PR");
        }
      };

      fetchPRData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // to manage the title of the modal and of the button if it's edit or create form
  const modalTitle = requestData ? "Modifier" : "Enregistrer";

  // initialize the initialesValues with Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      trello: "",
      github: "",
    },

    // validation form
    validationSchema: Yup.object({
      title: Yup.string().required("Le titre est requis"),
      description: Yup.string().required("La description est requise"),
      trello: Yup.string()
        .url("Le lien Trello doit être une URL valide")
        .required("Le lien Trello est requis"),
      github: Yup.string()
        .url("Le lien Github doit être une URL valide")
        .required("Le lien Github est requis"),
    }),

    onSubmit: async (values) => {
      try {
        // Catch user id for this session
        const { data } = await supabase.auth.getSession();
        const userId = data.session.user.id;
        const userFirstName = data.session.user.user_metadata.first_name;

        // Add project_uuid to the form data
        const formData = {
          ...values,
          project_uuid: projectId,
          user_uuid: userId,
          opened_by: userFirstName,
        };
        if (requestData) {
          // update data to pr_request table with supabase
          await supabase
            .from("pr_request")
            .update([formData])
            .eq("id", requestId);

          toast.success("Votre PR a bien été mise à jour");
        } else {
          // Add data to pr_request table with Supabase
          await supabase.from("pr_request").insert([formData]);
          toast.success("Votre PR a bien été créée");
        }
        await handleCreateOrUpdateRequest();
      } catch (error) {
        toast.error("L'enregistrement de la PR n'a pas fonctionné");
      }
      handleClose();
      setRefreshData(!refreshData);
    },
  });

  const handleSaveClick = () => {
    formik.handleSubmit();
  };
  // function to update form values with formik
  const updateFormValues = (newData) => {
    formik.setValues(newData);
  };
  // function to check if a value has been changed in the form. If don't : close directly modal
  const isDataChanged =
    requestId && requestData
      ? Object.keys(formik.values).some(
          (key) => formik.values[key] !== requestData[key]
        )
      : Object.values(formik.values).some((value) => value !== "");

  // Update form values when initialValues change
  useEffect(() => {
    if (requestData) {
      updateFormValues({
        title: requestData.title,
        description: requestData.description,
        trello: requestData.trello,
        github: requestData.github,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestData]);
  // modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 700,
    bgcolor: "#292929",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    width: {
      sm: "400px",
      md: "450px",
      lg: "500px",
      xl: "550px",
    },
  };

  return (
    <Modal
      sx={style}
      open={openModalAboutRequest}
      onClose={() => {
        if (isDataChanged) {
          handleOpenConfirmationModal();
        } else {
          handleClose();
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.formStyle}>
        <button
          className={styles.buttonClose}
          onClick={() => {
            if (isDataChanged) {
              handleOpenConfirmationModal();
            } else {
              handleClose();
            }
          }}
          type="button"
        >
          X
        </button>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <h1>{modalTitle} </h1>
          <div className={styles.input}>
            <div className={styles.inputStyle}>
              <TextInput
                label="Nom de la PR"
                type="text"
                id="title"
                placeholder="Nommez votre PR"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                readOnly={false}
              />
              {formik.touched.title && formik.errors.title ? (
                <TooltipIcon
                  tooltip={formik.errors.title}
                  top="0"
                  left="130px"
                  color="var(--error)"
                />
              ) : null}
            </div>
            <div className={styles.inputStyle}>
              <TextArea
                label="Description"
                type="text"
                id="description"
                placeholder="Décrivez votre PR"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description ? (
                <TooltipIcon
                  tooltip={formik.errors.description}
                  top="0"
                  left="110px"
                  color="var(--error)"
                />
              ) : null}
            </div>
            <div className={styles.inputStyle}>
              <TextInput
                label="Lien Trello"
                type="text"
                id="trello"
                placeholder="Insérez le lien vers Trello"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.trello}
              />
              {formik.touched.trello && formik.errors.trello ? (
                <TooltipIcon
                  tooltip={formik.errors.trello}
                  top="0"
                  left="100px"
                  color="var(--error)"
                />
              ) : null}
            </div>
            <div className={styles.inputStyle}>
              <TextInput
                label="Lien Github"
                type="text"
                id="github"
                placeholder="Insérez le lien vers Github"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.github}
              />
              {formik.touched.github && formik.errors.github ? (
                <TooltipIcon
                  tooltip={formik.errors.github}
                  top="0"
                  left="110px"
                  color="var(--error)"
                />
              ) : null}
            </div>
          </div>
          <div className={styles.button}>
            <Button
              variant="contained"
              onClick={handleSaveClick}
              sx={{
                width: ["100%", "100%", "40%"],
                background: theme.palette.button.main,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {modalTitle}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
ModalFormRequest.propTypes = {
  projectId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOpenConfirmationModal: PropTypes.func.isRequired,
  requestId: PropTypes.number,
  handleCreateOrUpdateRequest: PropTypes.func.isRequired,
  openModalAboutRequest: PropTypes.bool.isRequired,
};
ModalFormRequest.defaultProps = {
  requestId: null,
};
