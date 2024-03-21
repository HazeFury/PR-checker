import PropTypes from "prop-types";
import GeneralSettings from "./GeneralSettings";
import ContributorSettings from "./ContributorSettings";
import JoinSettings from "./JoinSettings";

export default function SettingsModalContent({ content }) {
  return (
    <section style={{ paddingTop: "1rem" }}>
      {content === "Général" && <GeneralSettings />}
      {content === "Membres" && <ContributorSettings />}
      {content === "Demandes" && <JoinSettings />}
    </section>
  );
}

SettingsModalContent.propTypes = {
  content: PropTypes.string.isRequired,
};
