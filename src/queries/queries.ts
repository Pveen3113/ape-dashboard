import { getSpecies } from "@/api/species"
import { useQuery } from "@tanstack/react-query"

export const useSpecies = () => {
    return useQuery(["species"], getSpecies)
}