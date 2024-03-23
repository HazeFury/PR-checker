import supabase from "../client";

const createAndSendNotification = async (newStatus, requestId) => {
  try {
    // Étape 1: Mettre à jour le statut de la PR Request dans la table
    const { data: prUpdate, error: updateError } = await supabase
      .from("pr_request")
      .update({ status: newStatus })
      .eq("id", requestId)
      .select();

    if (updateError) {
      console.error(
        "Erreur lors de la mise à jour du statut de la PR Request :"
      );
      return;
    }

    const prRequest = prUpdate[0];

    // Vérifier si la PR existe et si son statut est valide (5 ou 6)
    if (prRequest && (newStatus === 5 || newStatus === 6)) {
      // Associer le statut de la PR avec le type de notification
      const notificationType = newStatus === 5 ? 2 : 1;
      // Créer un message de notification en fonction du statut
      let notificationMessage = "";
      if (newStatus === 5) {
        notificationMessage = `Votre PR "${prRequest.title}" a été refusée.`;
      } else if (newStatus === 6) {
        notificationMessage = `Votre PR "${prRequest.title}" a été acceptée.`;
      }

      // Étape 3: Insérer la notification dans la table
      const { data: notificationData, error: notificationError } =
        await supabase
          .from("notification")
          .insert({
            type: notificationType,
            message: notificationMessage,
            pr_request_id: requestId,
          })
          .select("*");

      if (notificationError) {
        console.error("Erreur lors de l'insertion de la notification :");
      } else {
        const notifId = notificationData[0].id;

        // Étape 4: Récupérer le groupe de l'utilisateur ayant soumis la PR Request
        const { data: userGroupData, error: userGroupError } = await supabase
          .from("project_users")
          .select("group")
          .match({
            user_uuid: prRequest.user_uuid,
            project_uuid: prRequest.project_uuid,
          });

        if (userGroupError) {
          console.error(
            "Erreur lors de la récupération du groupe de l'utilisateur :"
          );
          return;
        }

        const userGroup = userGroupData[0].group;

        const { data: userListData, error: userListError } = await supabase
          .from("project_users")
          .select("user_uuid")
          .match({
            group: userGroup,
            project_uuid: prRequest.project_uuid,
          });

        if (userListError) {
          console.error(
            "Erreur lors de la récupération de la liste des utilisateurs :"
          );
        }

        const userList = userListData.map((user) => user.user_uuid);

        // Étape 6: Insérer dans la table notification_user pour chaque utilisateur
        userList.forEach(async (userId) => {
          const { error: insertError } = await supabase
            .from("notification_user")
            .insert({ user_uuid: userId, notification_id: notifId });

          if (insertError) {
            console.error(
              "Erreur lors de l'insertion de la notification pour l'utilisateur"
            );
          }
        });
      }
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
};

export default createAndSendNotification;
