const loadProfileData = async () => {
  const response = await fetch("./data.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load data.json: ${response.status}`);
  }

  const data = await response.json();
  window.profileData = data;
  return data;
};

window.profileDataPromise = loadProfileData().catch((error) => {
  console.error("Unable to load profile data from data.json.", error);
  return null;
});
