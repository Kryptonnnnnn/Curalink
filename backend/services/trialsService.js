import axios from "axios";

export const fetchTrials = async (disease) => {
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${disease}&pageSize=10&format=json`;

    const res = await axios.get(url);

    return res.data.studies.map((trial) => ({
      title: trial.protocolSection?.identificationModule?.briefTitle,
      status: trial.protocolSection?.statusModule?.overallStatus,
      eligibility:
        trial.protocolSection?.eligibilityModule?.eligibilityCriteria,
      location:
        trial.protocolSection?.contactsLocationsModule?.locations?.[0]
          ?.facility || "N/A",
      source: "ClinicalTrials",
    }));

  } catch (error) {
    console.error("Trials Error:", error.message);
    return [];
  }
};