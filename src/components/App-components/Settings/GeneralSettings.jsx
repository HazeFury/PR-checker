import PropTypes from "prop-types";

export default function GeneralSettings({ projectData }) {
  return (
    <div>
      <p>{projectData.name}</p>
    </div>
  );
}

GeneralSettings.propTypes = {
  projectData: PropTypes.shape({
    created_at: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    invitation: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
  }).isRequired,
};
