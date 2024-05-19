import supabase from "../client";

const editPrRequestDisplayedId = async (projectId) => {
  const { data: requestList } = await supabase
    .from("pr_request")
    .select("*")
    .eq("project_uuid", projectId)
    .order("displayed_id", { ascending: true });

  if (requestList.length === 0) {
    return 1;
  }
  return requestList[requestList.length - 1].displayed_id + 1;
};

export default editPrRequestDisplayedId;
