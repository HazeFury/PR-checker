import { useState, useEffect } from "react";
import "./ComponentPlayground.css";
// import TextInput from "../components/UI-components/TextInput/TextInput";
// import TextWithInfos from "../components/UI-components/TextWithInfos/TextWithInfos";
// import ProjectCard from "../components/App-components/ProjectCard/ProjectCard";
// import RequestCard from "../components/App-components/RequestCard/RequestCard";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import Login from "../components/App-components/Connection/Login/Login";
import supabase from "../services/client";
// import Register from "../components/App-components/Connection/Register/Register";
// import ProjectButtonNav from "../components/App-components/Navbar/ProjectButtonNav";

export default function ComponentsPlayground() {
  // const projects = [
  //   {
  //     id: 1,
  //     name: "P3 | Lyon - FT - DWWM JS - 02.2024",
  //     role: "Propriétaire",
  //     status: true,
  //     totalUsers: 4,
  //     totalPRWaiting: 4,
  //     picture: "https://source.unsplash.com/random?wallpapers",
  //   },
  //   {
  //     id: 2,
  //     name: "P3 | Lyon - FT - DWWM JS - 02.2024",
  //     role: "Contributeur",
  //     status: false,
  //     totalUsers: 3,
  //     picture: "https://source.unsplash.com/random?wallpapers",
  //   },
  // ];

  // const requests = [
  //   {
  //     id: 1,
  //     title: "US254_Test_Component",
  //     description:
  //       "blalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalbla",
  //     status: 1,
  //     github: "blalblablalblablalblablalbla",
  //     trello: "blalblablalblablalblablalblablalblablalblablalblablalbla",
  //   },
  //   {
  //     id: 2,
  //     title: "US254_Test_Component",
  //     description:
  //       "blalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalbla",
  //     status: 2,
  //     github: "blalblablalblablalblablalbla",
  //     trello: "blalblablalblablalblablalblablalblablalblablalblablalbla",
  //   },
  //   {
  //     id: 3,
  //     title: "US254_Test_Component",
  //     description:
  //       "blalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalblablalbla",
  //     status: 3,
  //     github: "blalblablalblablalblablalbla",
  //     trello: "blalblablalblablalblablalblablalblablalblablalblablalbla",
  //   },
  // ];

  // const nullFunction = () => {
  //   return null;
  // };

  const [refresh, setRefresh] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      } else {
        toast.info("À bientôt !", {
          icon: "👋",
        });
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
      console.error(error);
    }
  };

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      const userInfos = data.session.user.user_metadata.first_name;
      console.info(userInfos);
    }
    getSession();
  }, [refresh]);
  const insertTest = async () => {
    try {
      const { error } = await supabase.from("pr_request").insert({
        title: "un boss",
        description: "toto",
        trello: "toto",
        github: "toto",
        project_uuid: "2bc9286a-bd67-44d3-996b-a6ad0bca02c8",
        user_uuid: "5cbbea0f-31b7-4e0a-bcf0-c81f73768f0d",
      });
      if (error) {
        toast.error("ça à merdé");
      }
      if (!error) {
        toast.success("Tout s'est bien passé !");
        setRefresh(!refresh);
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
      console.error(error);
    }
  };
  // const insertTest = async () => {
  //   try {
  //     const { error } = await supabase.from("projects").insert({
  //       name: "Je suis un boss",
  //       picture:
  //         "https://images.unsplash.com/photo-1511300636408-a63a89df3482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE3MDk0OTYyMjg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
  //     });
  //     if (error) {
  //       toast.error("ça à merdé");
  //     }
  //     if (!error) {
  //       toast.success("Tout s'est bien passé !");
  //       setRefresh(!refresh);
  //     }
  //   } catch (error) {
  //     toast.error("Une erreur s'est produite");
  //     console.error(error);
  //   }
  // };

  const [test, setTest] = useState([]);

  useEffect(() => {
    async function testQuery() {
      const { data } = await supabase
        .from("notification_user")
        .select("count")
        .match({
          user_uuid: "a6e76669-544d-4c82-8baa-84eb2479e830",
          unread: true,
        });

      setTest(data[0].count);
    }
    testQuery();
  }, [refresh]);

  console.info(test);

  return (
    <div className="component-page">
      <h1>component playground</h1>

      <div className="component-section">
        <div className="big_container">
          <ul>
            {/* {test ? (
              test.map((el) => <li key={el.id}>{`${el.id} - ${el.unread}`}</li>)
            ) : (
              <p>rien pour l'instant</p>
            )} */}
          </ul>
        </div>
        <button type="button" onClick={insertTest}>
          Insérer donnée
        </button>
      </div>
      <div>
        <button type="button" onClick={handleLogout}>
          déconnecter
        </button>
      </div>
      <div className="component-section">
        <p className="component-title">Login</p>
        <Login />
      </div>
      {/* <div className="component-section">
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
        <p className="component-title">Register</p>
        <Register />
      </div>
      <div className="component-section">
        <p className="component-title">useScreenSize</p>
        <ProjectButtonNav />
      </div> */}
    </div>
  );
}
