import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import GeneralSettings from "./GeneralSettings";
import ContributorSettings from "./ContributorSettings";
import JoinSettings from "./JoinSettings";
import supabase from "../../../services/client";

export default function SettingsModalContent({ content }) {
  const [projectData, setProjectData] = useState(null);
  const projectId = useParams();

  // Function to get the data from the project on screen
  const getProjectData = async () => {
    try {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId.uuid)
        .single();

      setProjectData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projectData) {
    return (
      <section style={{ paddingTop: "1.5rem", width: "90%" }}>
        {content === "Général" && (
          <GeneralSettings
            projectData={projectData}
            getProjectData={getProjectData}
          />
        )}
        {content === "Membres" && <ContributorSettings />}
        {content === "Demandes" && <JoinSettings />}
      </section>
    );
  }
}

SettingsModalContent.propTypes = {
  content: PropTypes.string.isRequired,
};
