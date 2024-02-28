import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import { useEffect, useState } from "react";

import TextInput from "../../UI-components/TextInput/TextInput";
import styles from "./ModalFormRequest.module.css";
import TextArea from "../../UI-components/TextArea/TextArea";
import supabase from "../../../services/client";
import TooltipIconError from "../../UI-components/MUIRemix/TooltipIconError";

export default function ModalFormRequest({
  projectId,
  handleClose,
  handleOpenConfirmationModal,
  refreshPr,
  requestId,
}) {
  // state to manage the data of request
  const [requestData, setRequestData] = useState(null);

  // function to fetch data of the PR which is used
  useEffect(() => {
    const fetchPRData = async () => {
      try {
        const { data } = await supabase
          .from("pr_request")
          .select("*")
          .eq("id", requestId);

        setRequestData(data[0]);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la PR",
          error
        );
      }
    };

    fetchPRData();
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
      trello: Yup.string().required("Le lien Trello est requis"),
      github: Yup.string().required("Le lien Github est requis"),
    }),

    onSubmit: async (values) => {
      try {
        // Catch user id for this session
        const { data } = await supabase.auth.getSession();
        const userId = data.session.user.id;
        // Add project_uuid to the form data
        const formData = {
          ...values,
          project_uuid: projectId,
          user_uuid: userId,
        };

        // Add data to pr_request table with Supabase
        await supabase.from("pr_request").insert([formData]);
        toast.success("Votre PR a bien été créée");
        handleClose();
        refreshPr();
      } catch (error) {
        toast.error("L'enregistrement de la PR n'a pas fonctionné");
      }
    },
  });

  const handleSaveClick = () => {
    formik.handleSubmit();
  };
  // function to update form values with formik
  const updateFormValues = (newData) => {
    formik.setValues(newData);
  };

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
  }, [requestData]);

  return (
    <div className={styles.formStyle}>
      <button
        className={styles.buttonClose}
        onClick={() => {
          handleOpenConfirmationModal();
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
              <TooltipIconError
                tooltip={formik.errors.title}
                top="0"
                left="130px"
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
              <TooltipIconError
                tooltip={formik.errors.description}
                top="0"
                left="110px"
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
              <TooltipIconError
                tooltip={formik.errors.trello}
                top="0"
                left="100px"
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
              <TooltipIconError
                tooltip={formik.errors.github}
                top="0"
                left="110px"
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
              background: "#3883ba",
              fontFamily: "Montserrat, sans serif",
            }}
          >
            {modalTitle}
          </Button>
        </div>
      </form>
    </div>
  );
}
ModalFormRequest.propTypes = {
  projectId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOpenConfirmationModal: PropTypes.func.isRequired,
  refreshPr: PropTypes.func.isRequired,
  requestId: PropTypes.number.isRequired,
};
