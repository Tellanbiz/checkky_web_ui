export const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  
  // North America
  { value: "America/New_York", label: "Eastern Time (ET) - New York" },
  { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
  { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
  { value: "America/Anchorage", label: "Alaska Time (AKT) - Anchorage" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT) - Honolulu" },
  { value: "America/Toronto", label: "Eastern Time - Toronto" },
  { value: "America/Vancouver", label: "Pacific Time - Vancouver" },
  { value: "America/Mexico_City", label: "Central Time - Mexico City" },
  { value: "America/Sao_Paulo", label: "Brasília Time (BRT) - São Paulo" },
  
  // Europe
  { value: "Europe/London", label: "Greenwich Mean Time (GMT) - London" },
  { value: "Europe/Paris", label: "Central European Time (CET) - Paris" },
  { value: "Europe/Berlin", label: "Central European Time (CET) - Berlin" },
  { value: "Europe/Rome", label: "Central European Time (CET) - Rome" },
  { value: "Europe/Madrid", label: "Central European Time (CET) - Madrid" },
  { value: "Europe/Amsterdam", label: "Central European Time (CET) - Amsterdam" },
  { value: "Europe/Stockholm", label: "Central European Time (CET) - Stockholm" },
  { value: "Europe/Moscow", label: "Moscow Time (MSK) - Moscow" },
  
  // Africa
  { value: "Africa/Cairo", label: "Eastern European Time (EET) - Cairo" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT) - Lagos" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST) - Johannesburg" },
  { value: "Africa/Casablanca", label: "Western European Time (WET) - Casablanca" },
  { value: "Africa/Nairobi", label: "East Africa Time (EAT) - Nairobi" },
  { value: "Africa/Addis_Ababa", label: "East Africa Time (EAT) - Addis Ababa" },
  { value: "Africa/Accra", label: "Greenwich Mean Time (GMT) - Accra" },
  { value: "Africa/Dakar", label: "Greenwich Mean Time (GMT) - Dakar" },
  { value: "Africa/Tunis", label: "Central European Time (CET) - Tunis" },
  { value: "Africa/Algiers", label: "Central European Time (CET) - Algiers" },
  { value: "Africa/Harare", label: "Central Africa Time (CAT) - Harare" },
  { value: "Africa/Dar_es_Salaam", label: "East Africa Time (EAT) - Dar es Salaam" },
  { value: "Africa/Kampala", label: "East Africa Time (EAT) - Kampala" },
  { value: "Africa/Khartoum", label: "Central Africa Time (CAT) - Khartoum" },
  
  // Middle East & Asia
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST) - Dubai" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST) - Mumbai/Delhi" },
  { value: "Asia/Bangkok", label: "Indochina Time (ICT) - Bangkok" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST) - Shanghai" },
  { value: "Asia/Hong_Kong", label: "Hong Kong Time (HKT) - Hong Kong" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST) - Tokyo" },
  { value: "Asia/Seoul", label: "Korea Standard Time (KST) - Seoul" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT) - Singapore" },
  
  // Australia & Pacific
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET) - Sydney" },
  { value: "Australia/Melbourne", label: "Australian Eastern Time (AET) - Melbourne" },
  { value: "Pacific/Auckland", label: "New Zealand Time (NZT) - Auckland" },
];

export const getDefaultTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getTimezoneByValue = (value: string) => {
  return TIMEZONES.find(tz => tz.value === value);
};