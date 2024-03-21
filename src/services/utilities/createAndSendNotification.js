import supabase from "../client";

const createAndSendNotification = async (newStatus, requestId) => {
  try {
    // Étape 1: Mettre à jour le statut de la PR Request dans la table
    const { data, error: updateError } = await supabase
      .from("pr_request")
      .update({ status: newStatus })
      .eq("id", requestId)
      .select();
    console.info("Statut de la PR Request mis à jour avec succès.", data);
    if (updateError) {
      console.error(
        "Erreur lors de la mise à jour du statut de la PR Request :",
        updateError.message
      );
      return;
    }

    // Étape 3: Récupérer les informations de la PR Request
    const { data: prRequests, error: prRequestError } = await supabase
      .from("pr_request")
      .select("*")
      .eq("id", requestId);

    console.info("Informations sur la PR Request :", prRequests);
    if (prRequestError) {
      console.error(
        "Erreur lors de la récupération de la PR Request :",
        prRequestError.message
      );
      return;
    }

    const prRequest = prRequests[0];

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
        console.error(
          "Erreur lors de l'insertion de la notification :",
          notificationError.message
        );
      } else {
        const notifId = notificationData[0].id;
        console.info("Notification insérée avec succès.");

        // Étape 4: Récupérer les utilisateurs du même projet que la PR
        const { data: projectUsersData, error: projectUsersError } =
          await supabase
            .from("project_users")
            .select("user_uuid")
            .eq("project_uuid", prRequest.project_uuid);

        console.info("Utilisateurs du projet récupérés :", projectUsersData);

        if (projectUsersError) {
          console.error(
            "Erreur lors de la récupération des utilisateurs du projet :",
            projectUsersError.message
          );
        } else {
          const userList = projectUsersData.map((user) => user.user_uuid);
          console.info(
            "Liste des utilisateurs du projet récupérée :",
            userList
          );

          // Étape 5: Insérer dans la table notification_user l'ID de la notification et l'ID de chaque utilisateur
          const promises = userList.map((userId) =>
            supabase
              .from("notification_user")
              .insert({ user_uuid: userId, notification_id: notifId })
          );

          const insertResults = await Promise.all(promises);
          insertResults.forEach((result, index) => {
            if (result.error) {
              console.error(
                "Erreur lors de l'insertion de la notification pour l'utilisateur",
                userList[index],
                ":",
                result.error.message
              );
            } else {
              console.info(
                "Notification insérée avec succès pour l'utilisateur",
                userList[index]
              );
            }
          });
        }
      }
    } else {
      console.warn("Aucune PR trouvée ou la PR n'est pas dans un état valide.");
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
};

export default createAndSendNotification;
