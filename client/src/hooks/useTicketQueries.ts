import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { GetTickets } from '../apiManager/RecordShop';
import { Cities, Festivals } from '../constants/enums';

const useTicketQueries = (): {
  victoriaQuery: UseQueryResult<unknown, unknown>;
  vancouverQuery: UseQueryResult<unknown, unknown>;
  philipsQuery: UseQueryResult<unknown, unknown>;
  whistleQuery: UseQueryResult<unknown, unknown>;
  laketownQuery: UseQueryResult<unknown, unknown>;
  osheagaQuery: UseQueryResult<unknown, unknown>;
  coachellaQuery: UseQueryResult<unknown, unknown>;
  rifflandiaQuery: UseQueryResult<unknown, unknown>;
} => {
  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    //enabled: false,
  };

  const victoriaQuery = useQuery({
    queryKey: [Cities.Victoria],
    queryFn: () => GetTickets(Cities.Victoria),
    ...queryOptions,
  });

  const vancouverQuery = useQuery({
    queryKey: [Cities.Vancouver],
    queryFn: () => GetTickets(Cities.Vancouver),
    ...queryOptions,
  });

  const philipsQuery = useQuery({
    queryKey: [Festivals.PhilipsBackyard],
    queryFn: () => GetTickets(Festivals.PhilipsBackyard),
    ...queryOptions,
  });

  const whistleQuery = useQuery({
    queryKey: [Festivals.Whistlemania],
    queryFn: () => GetTickets(Festivals.Whistlemania),
    ...queryOptions,
  });

  const laketownQuery = useQuery({
    queryKey: [Festivals.LaketownShakedown],
    queryFn: () => GetTickets(Festivals.LaketownShakedown),
    ...queryOptions,
  });

  const osheagaQuery = useQuery({
    queryKey: [Festivals.Osheaga],
    queryFn: () => GetTickets(Festivals.Osheaga),
    ...queryOptions,
  });

  const coachellaQuery = useQuery({
    queryKey: [Festivals.Coachella],
    queryFn: () => GetTickets(Festivals.Coachella),
    ...queryOptions,
  });

  const rifflandiaQuery = useQuery({
    queryKey: [Festivals.Rifflandia],
    queryFn: () => GetTickets(Festivals.Rifflandia),
    ...queryOptions,
  });

  return {
    victoriaQuery,
    vancouverQuery,
    philipsQuery,
    whistleQuery,
    laketownQuery,
    osheagaQuery,
    coachellaQuery,
    rifflandiaQuery,
  };
};

export default useTicketQueries;
