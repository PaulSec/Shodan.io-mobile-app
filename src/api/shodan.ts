import client from './client';
import type { ApiInfo, SearchFilters, SearchResult, ShodanHost, SearchFacet, SearchTokensResult, CommunityQueryResult, DnsResolutionMap, HostCountResult } from './types';
export async function getApiInfo(): Promise<ApiInfo> { return (await client.get<ApiInfo>('/api-info')).data; }
export async function searchHosts(filters: SearchFilters): Promise<SearchResult> {
  const { query, page, facets, minify } = filters;
  return (await client.get<SearchResult>('/shodan/host/search', { params: { query, page: page ?? 1, facets, minify: minify ?? true } })).data;
}
export async function getHost(ip: string): Promise<ShodanHost> { return (await client.get<ShodanHost>(`/shodan/host/${encodeURIComponent(ip)}`)).data; }
export async function getHostCount(query: string, facets?: string[]): Promise<{ total: number; facets: Record<string, SearchFacet[]> }> {
  const d = (await client.get<HostCountResult>('/shodan/host/count', { params: { query, facets: facets?.join(',') } })).data;
  return { total: d.total, facets: d.facets };
}
export async function getSearchTokens(query: string): Promise<SearchTokensResult> { return (await client.get<SearchTokensResult>('/shodan/host/search/tokens', { params: { query } })).data; }
export async function getPorts(): Promise<number[]> { return (await client.get<number[]>('/shodan/ports')).data; }
export async function resolveDns(hostnames: string[]): Promise<DnsResolutionMap> { return (await client.get<DnsResolutionMap>('/dns/resolve', { params: { hostnames: hostnames.join(',') } })).data; }
export async function getCommunityQueries(page = 1, sort: 'votes' | 'timestamp' = 'votes'): Promise<CommunityQueryResult> { return (await client.get<CommunityQueryResult>('/shodan/query', { params: { page, sort } })).data; }
export async function searchCommunityQueries(query: string, page = 1): Promise<CommunityQueryResult> { return (await client.get<CommunityQueryResult>('/shodan/query/search', { params: { query, page } })).data; }
