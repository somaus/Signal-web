import { api } from "@/shared/api/axios";
import type {
  AgencyResponse,
  ConnectionResponse,
  CreateConnectionRequest,
  SituationType,
} from "./model";

export async function getAgencies(situationType?: SituationType): Promise<AgencyResponse[]> {
  const { data } = await api.get<{ agencies: AgencyResponse[] }>("/api/v1/agencies", {
    params: situationType ? { situationType } : undefined,
  });
  return data.agencies ?? [];
}

export async function createConnection(
  agencyId: number,
  payload: CreateConnectionRequest,
): Promise<ConnectionResponse> {
  const { data } = await api.post<ConnectionResponse>(
    `/api/v1/agencies/${agencyId}/connections`,
    payload,
  );
  return data;
}
