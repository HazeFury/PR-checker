import supabase from "../client";

function subscribeToNewChannel(
  channelName, // (string) : name of the channel you want to create
  tableName, // (string) : name of the table you want to listen
  filterColumnName, // (string) : name of the table column you want to especially listen to
  filterOperator, // (string) : the operator to apply on filter (here will be "eq" or "in") (eg: eq.project_uuid or in.(project1, project2, project3))
  filterValue, // (string or array) : the value that match the table column (eg: eq.project_uuid or in.(project1, project2, project3) )
  refreshFunction // (function) : the function to refresh the data
) {
  const isOperatorIsIn = `(${filterValue})`;

  return supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: `${tableName}`,
        filter: `${filterColumnName}=${filterOperator}.${filterOperator === "in" ? isOperatorIsIn : filterValue}`,
      },
      () => {
        refreshFunction();
      }
    )
    .subscribe();
}

export default subscribeToNewChannel;
