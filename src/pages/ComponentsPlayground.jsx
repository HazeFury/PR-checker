import "./ComponentPlayground.css";
import TextInput from "../components/UI-components/TextInput/TextInput";
import TextWithInfos from "../components/UI-components/TextWithInfos/TextWithInfos";
import ProjectCard from "../components/App-components/ProjectCard/ProjectCard";
import RequestCard from "../components/App-components/RequestCard/RequestCard";
import Login from "../components/App-components/Connection/Login/Login";
import Register from "../components/App-components/Connection/Register/Register";
import ProjectButtonNav from "../components/App-components/Navbar/ProjectButtonNav";

export default function ComponentsPlayground() {
  const projects = [
    {
      id: 1,
      name: "P3 | Lyon - FT - DWWM JS - 02.2024",
      role: "Propriétaire",
      status: true,
      totalUsers: 4,
      totalPRWaiting: 4,
      picture: "https://source.unsplash.com/random?wallpapers",
    },
    {
      id: 2,
      name: "P3 | Lyon - FT - DWWM JS - 02.2024",
      role: "Contributeur",
      status: false,
      totalUsers: 3,
      picture: "https://source.unsplash.com/random?wallpapers",
    },
  ];

  const requests = [
    {
      id: 1,
      title: "US254_Test_Component",
      description:
        "blalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalbla",
      status: 1,
      github: "blalblablalblablalblablalbla",
      trello: "blalblablalblablalblablalblablalblablalblablalblablalbla",
    },
    {
      id: 2,
      title: "US254_Test_Component",
      description:
        "blalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalbla",
      status: 2,
      github: "blalblablalblablalblablalbla",
      trello: "blalblablalblablalblablalblablalblablalblablalblablalbla",
    },
    {
      id: 3,
      title: "US254_Test_Component",
      description:
        "blalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalbla",
      status: 3,
      github: "blalblablalblablalblablalbla",
      trello: "blalblablalblablalblablalblablalblablalblablalblablalbla",
    },
  ];

  const nullFunction = () => {
    return null;
  };

  return (
    <div className="component-page">
      <h1>component playground</h1>

      <div className="component-section">
        <p className="component-title">TextInput</p>
        <TextInput
          label="Nom"
          hideLabel
          type="text"
          id="name"
          placeholder="Entrez votre nom"
          onChange={nullFunction}
          onBlur={nullFunction}
          value="toto"
        />
      </div>
      <div className="component-section">
        <p className="component-title">TextWithInfos</p>
        <TextWithInfos
          text="Exemple de TextWithInfos"
          description="Description de la fonctionalité ici !"
        />
      </div>
      <div className="component-section">
        <p className="component-title">ProjectCard</p>
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
      <div className="component-section">
        <p className="component-title">RequestCard</p>
        {requests.map((request) => (
          <RequestCard request={request} key={request.id} />
        ))}
      </div>
      <div className="component-section">
        <p className="component-title">Login</p>
        <Login />
      </div>
      <div className="component-section">
        <p className="component-title">Register</p>
        <Register />
      </div>
      <div className="component-section">
        <p className="component-title">useScreenSize</p>
        <ProjectButtonNav />
      </div>
    </div>
  );
}
