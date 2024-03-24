import supabase from "../client";

const createAndSendNotification = async (newStatus, requestId) => {
  try {
    /* --- Step 1: Update PR Request status in table via ManageRequestButton props --- */
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

    // Adding the updated PR (status) to a variable
    const prRequest = prUpdate[0];

    /* --- Step 2: Prepare information for notification addition --- */

    // Verify if the PR exists and the status is valid(5 ou 6)
    if (prRequest && (newStatus === 5 || newStatus === 6)) {
      // Associate PR status with notification type
      const notificationType = newStatus === 5 ? 2 : 1;
      // Create a notification message according to the statut
      let notificationMessage = "";
      if (newStatus === 5) {
        notificationMessage = `Votre PR "${prRequest.title}" a été refusée.`;
      } else if (newStatus === 6) {
        notificationMessage = `Votre PR "${prRequest.title}" a été acceptée.`;
      }

      /* --- Étape 3: Insert notification within table --- */
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
        // Adding notification into a variable
        const notifId = notificationData[0].id;

        /* --- Step 4 : Recover the user group having submitted the PR --- */
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

        // Adding the user group having submitted the PR
        const userGroup = userGroupData[0].group;

        /* --- Step 5 : Find all user that are in the same group and project that the user having submitted the PR --- */
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

        // Adding the user list with same project and group
        const userList = userListData.map((user) => user.user_uuid);

        /* --- Step : Insert in notification_user every user of that list --- */
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
