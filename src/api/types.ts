export interface ApiInfo {
  query_credits: number; scan_credits: number; monitored_ips: number | null;
  plan: string; https: boolean; unlocked: boolean; unlocked_left: number; telnet: boolean;
  usage_limits: { scan_credits: number; query_credits: number; monitored_ips: number };
}
export interface ShodanLocation {
  city: string | null; region_code: string | null; longitude: number | null; latitude: number | null;
  country_code: string | null; country_name: string | null; postal_code: string | null;
}
export interface ShodanSsl {
  cert: { serial: number; subject: Record<string, string>; issuer: Record<string, string>; expires: string; fingerprint: Record<string, string>; sig_alg: string };
  cipher: { version: string; bits: number; name: string }; versions: string[];
}
export interface ShodanScreenshot {
  data: string;
  mime?: string | null;
  labels?: string[];
}
export interface ShodanBanner {
  port: number; transport: string; protocol: string; data: string; timestamp: string; hash: number;
  os: string | null; product: string | null; version: string | null; cpe: string[]; info: string | null; title: string | null;
  isp: string; asn: string; org: string; domains: string[]; hostnames: string[]; ip_str: string; ip: number;
  location: ShodanLocation; ssl?: ShodanSsl;
  vulns?: Record<string, { cvss: number | null; references: string[]; summary: string | null; verified: boolean }>;
  tags?: string[];
  screenshot?: ShodanScreenshot;
  opts?: { screenshot?: ShodanScreenshot };
  http?: { status: number; title: string | null; server: string | null; html: string; html_hash: number; robots: string | null; components: Record<string, { categories: string[] }> };
}
export interface ShodanHost {
  ip_str: string; ip: number; hostnames: string[]; domains: string[]; ports: number[];
  os: string | null; org: string; isp: string; asn: string;
  city: string | null; region_code: string | null; country_code: string | null; country_name: string | null;
  latitude: number | null; longitude: number | null;
  vulns?: string[]; tags: string[]; data: ShodanBanner[]; last_update: string;
}
export interface SearchFacet { count: number; value: string }
export interface SearchResult { matches: ShodanHost[]; total: number; facets: Record<string, SearchFacet[]> }
export interface SearchFilters { query: string; page?: number; facets?: string; minify?: boolean }
export interface CommunityQuery { votes: number; description: string; title: string; timestamp: string; tags: string[]; query: string }
export interface CommunityQueryResult { matches: CommunityQuery[]; total: number }
export interface HostCountResult { total: number; facets: Record<string, SearchFacet[]> }
export interface SearchTokensResult { string: string; filters: string[]; errors: string[]; attributes: Record<string, string> }
export type DnsResolutionMap = Record<string, string>;
