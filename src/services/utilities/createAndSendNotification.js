import supabase from "../client";

// RAJOUTER ETAPE 1

// ETAPE 2 : Récupérer les utilisateurs de pr_request
const { data: prRequests } = await supabase
  .from("pr_request")
  .select("*")
  .match({ user_uuid: "5984e67a-6ba4-4cd8-a927-b6ddd2b89df0" });

// RAJOUTER ETAPE 3
prRequests.forEach(async (prRequest) => {
  if (prRequest.status === 5 || prRequest.status === 6) {
    // Match le status de la PR avec le type de notification pour l'insertion lors de la création de la notification
    const notificationType = prRequest.status === 5 ? 2 : 1;
    // Créer le message de la notification en fonction du statut et du titre de la PR
    let notificationMessage = "";
    if (prRequest.status === 5) {
      notificationMessage = `Votre PR "${prRequest.title}" a été acceptée.`;
    } else if (prRequest.status === 6) {
      notificationMessage = `Votre PR "${prRequest.title}" a été refusée.`;
    }

    const { data: notificationData, error: notificationError } = await supabase
      .from("notification")
      .insert({
        type: notificationType,
        message: notificationMessage,
        pr_request_id: prRequest.id,
      })
      .select("*");

    if (notificationError) {
      console.error(
        "Erreur lors de l'insertion de la notification :",
        notificationError.message
      );
    } else {
      const notifId = notificationData[0].id;
      console.info("Notification insérée avec succès.");

      // ETAPE 4 : Récupérer les utilisateurs de project_users
      const { data: projectUserData, error: projectUserError } = await supabase
        .from("project_users")
        .select("group")
        .match({
          user_id: prRequest.user_uuid,
          project_uuid: prRequest.project_uuid,
        });

      if (projectUserError) {
        console.error(
          "Erreur lors de la récupération du groupe de l'utilisateur :",
          projectUserError.message
        );
      } else {
        // ETAPE 5 : Isoler dans une variable le groupe et l'user
        const groupId = projectUserData[0].group;
        console.info("Groupe récupéré à partir de project_users :", groupId);

        // ETAPE 6 : Récupérer les utilisateurs du groupe
        const { data: groupUsersData, error: groupUsersError } = await supabase
          .from("project_users")
          .select("user_id")
          .eq("group", groupId);

        if (groupUsersError) {
          console.error(
            "Erreur lors de la récupération des utilisateurs du groupe :",
            groupUsersError.message
          );
        } else {
          const userList = groupUsersData.map((user) => user.user_id); // Isoler les user_id du groupe dans une variable
          console.info(
            "Liste des utilisateurs du groupe récupérée :",
            userList
          );

          // ETAPE 7 : Insertion des notifId associés à chaque utilisateur dans la table notification_user
          userList.forEach(async (userId) => {
            const { error: notificationUserError } = await supabase
              .from("notification_user")
              .insert({ user_uuid: userId, notification_id: notifId });

            if (notificationUserError) {
              console.error(
                "Erreur lors de l'insertion de la notification pour l'utilisateur",
                userId,
                ":",
                notificationUserError.message
              );
            } else {
              console.info(
                "Notification insérée avec succès pour l'utilisateur",
                userId
              );
            }
          });
        }
      }
    }
  }
});
