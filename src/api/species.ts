import { fetchApi } from "./utils";

export type CreateSpeciesParams = {
  name: string;
  scientificName: string;
  description: string;
};
export const createSpecies = async (speciesDetails: CreateSpeciesParams) => {
  const { data } = await fetchApi("/species", {
    method: "POST",
    data: { ...speciesDetails },
  });

  return data;
};

export type SpeciesBaseSchema = {
  _id: string;
  name: string;
  scientificName: string;
  description: string;
};

export const getSpecies = async () => {
  const { data } = await fetchApi<SpeciesBaseSchema[]>("/species", {
    method: "GET",
  });
  return data;
};
