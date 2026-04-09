export interface IndustryProfile {
  operationTypes: string[];
  equipment: string[];
  facilities: string[];
  compliance: string[];
  staffRoles: string[];
}

export const COUNTRY_OPTIONS = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "Ethiopia",
  "South Africa",
  "Nigeria",
  "Ghana",
  "Egypt",
  "Morocco",
  "Zambia",
  "Zimbabwe",
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "India",
  "Australia",
  "New Zealand",
  "United Arab Emirates",
  "Saudi Arabia",
  "Brazil",
  "Mexico",
  "Other",
];

export const POSITION_OPTIONS = [
  "Founder / Owner",
  "Operations Manager",
  "General Manager",
  "Farm Manager",
  "Safety Officer",
  "Supervisor",
  "Team Lead",
  "Quality Manager",
  "Project Manager",
  "Administrator",
];

export const TEAM_MEMBER_OPTIONS = [
  "Just me",
  "2-10 team members",
  "11-25 team members",
  "26-50 team members",
  "51-100 team members",
  "100+ team members",
];

export const INDUSTRIES = [
  "Farm / Agriculture",
  "Restaurant / Food Service",
  "Construction / Contracting",
  "Healthcare / Medical Facility",
  "Retail / Warehouse",
  "Manufacturing / Production",
  "Logistics & Warehousing",
  "Hospitality / Hotels",
  "Education / Schools",
  "Property Management",
  "Mining & Extraction",
  "Automotive Services",
  "Oil & Gas",
  "Aged Care / NDIS",
  "Transport & Fleet",
  "Food Manufacturing",
  "Pharmaceutical",
  "Security Services",
  "Cleaning & Facilities",
  "Event Management",
  "Other",
];

export const PAIN_POINTS = [
  "Lost paperwork",
  "Incomplete checks",
  "No photo evidence",
  "Hard to track completion",
  "Compliance gaps",
  "Language barriers",
  "No real-time alerts",
  "Incident tracking gaps",
  "Duplicate data entry",
  "Slow reporting",
];

export const DEVICE_OPTIONS = [
  "Smartphone (iOS)",
  "Smartphone (Android)",
  "Tablet (iPad)",
  "Tablet (Android)",
  "Rugged Handheld",
  "Desktop / Laptop",
  "Mixed Devices",
];

export const INTEGRATION_OPTIONS = [
  "ERP System",
  "Accounting Software",
  "HR / Payroll System",
  "Inventory Management",
  "CRM",
  "Email Notifications",
  "SMS Alerts",
  "Cloud Storage",
  "None needed",
];

export const TIMELINE_OPTIONS = [
  "Immediate (0-1 month)",
  "Short-term (1-3 months)",
  "Medium-term (3-6 months)",
  "Long-term planning",
];

export const BUDGET_OPTIONS = [
  "Under $500/mo",
  "$500-1,500/mo",
  "$1,500-3,000/mo",
  "Enterprise pricing",
];

export const FIELD_TYPE_OPTIONS = [
  "Checkbox (Yes/No)",
  "Text Input",
  "Number / Measurement",
  "Photo Upload",
  "Signature",
  "Date / Time",
  "Dropdown Selection",
  "GPS / Location",
];

export const OPERATION_SCALE_OPTIONS = [
  "Single site / small team",
  "Growing multi-team operation",
  "Multi-site business",
  "Enterprise / distributed operation",
];

export const TOTAL_STAFF_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

export const SHIFT_STRUCTURE_OPTIONS = [
  "Single shift (day only)",
  "2 shifts (day/night)",
  "3 shifts (24/7)",
  "Rotating roster",
  "Flexible / ad-hoc",
];

export const CONNECTIVITY_OPTIONS = [
  "Always online",
  "Mostly online",
  "Intermittent connectivity",
  "Mostly offline",
  "No connectivity",
];

export const PHOTO_REQUIRED_OPTIONS = [
  "Yes - mandatory",
  "Yes - optional",
  "No",
];

export const TOP_PRIORITY_OPTIONS = [
  "Safety & Compliance",
  "Operational Efficiency",
  "Quality Control",
  "Staff Accountability",
  "Audit Readiness",
  "Cost Reduction",
];

export const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {
  "Farm / Agriculture": {
    operationTypes: ["Crop Production", "Livestock Management", "Irrigation", "Harvest Operations", "Chemical Application"],
    equipment: ["Tractors & Harvesters", "Irrigation Systems", "Sprayers & Applicators", "Seeders & Planters", "ATVs / UTVs"],
    facilities: ["Fields / Paddocks", "Grain Storage / Silos", "Livestock Sheds / Barns", "Cold Storage", "Packing Shed"],
    compliance: ["GlobalG.A.P.", "Organic Certification", "Food Safety (HACCP)", "Worker Safety (OSHA / WHS)", "Water Use Permits"],
    staffRoles: ["Farm Manager", "Field Supervisor", "Farm Workers", "Equipment Operators", "Safety Officer"],
  },
  "Restaurant / Food Service": {
    operationTypes: ["Food Preparation", "Front-of-House Service", "Inventory & Ordering", "Cleaning & Sanitation", "Allergen Management"],
    equipment: ["Commercial Ovens", "Refrigeration Units", "Dishwashers", "Fryers & Grills", "Temperature Probes"],
    facilities: ["Kitchen", "Dining Room", "Bar Area", "Dry Storage", "Walk-in Cooler / Freezer"],
    compliance: ["Food Safety (HACCP)", "Local Health Regulations", "FDA Food Code", "Liquor Licensing", "Fire Safety"],
    staffRoles: ["Head Chef", "Line Cooks", "Servers", "Bartenders", "General Manager"],
  },
  "Construction / Contracting": {
    operationTypes: ["Site Preparation", "Structural Construction", "Electrical Installation", "Demolition", "Site Safety Inspections"],
    equipment: ["Excavators & Bulldozers", "Cranes", "Scaffolding Systems", "Concrete Mixers", "Power Tools"],
    facilities: ["Active Construction Site", "Site Office", "Material Storage", "Fuel Storage", "Laydown Area"],
    compliance: ["Construction Safety Standards", "Local Building Codes", "Confined Space Regulations", "Working at Heights", "Electrical Safety"],
    staffRoles: ["Project Manager", "Site Supervisor", "Electricians", "Carpenters", "Safety Officer"],
  },
  "Healthcare / Medical Facility": {
    operationTypes: ["Patient Admissions", "Medication Administration", "Infection Control", "Emergency Response", "Medical Equipment Maintenance"],
    equipment: ["Monitoring Systems", "Surgical Instruments", "Defibrillators", "Autoclaves", "EMR Systems"],
    facilities: ["Patient Wards", "Operating Theatre", "Emergency Department", "Pharmacy", "Laboratory"],
    compliance: ["Joint Commission", "HIPAA", "Infection Control Guidelines", "Medication Safety", "Medical Device Regulations"],
    staffRoles: ["Medical Director", "Registered Nurses", "Allied Health Professionals", "Pharmacists", "Facility Manager"],
  },
  "Retail / Warehouse": {
    operationTypes: ["Stock Receiving", "Inventory Audits", "Order Picking", "POS Operations", "Merchandising"],
    equipment: ["Forklifts", "Barcode Scanners", "POS Systems", "CCTV", "Racking Systems"],
    facilities: ["Sales Floor", "Stockroom", "Receiving Dock", "Cash Office", "Cold Storage"],
    compliance: ["Fire Safety", "Warehouse Safety", "Consumer Protection", "Privacy Regulations", "Business Licensing"],
    staffRoles: ["Store Manager", "Sales Associates", "Cashiers", "Warehouse Staff", "Receiving Officers"],
  },
  "Manufacturing / Production": {
    operationTypes: ["Production Line Operations", "Quality Control", "Machine Changeovers", "Preventive Maintenance", "Shift Handovers"],
    equipment: ["CNC Machines", "Conveyor Systems", "Forklifts", "Welding Equipment", "Packaging Machinery"],
    facilities: ["Production Floor", "QC Lab", "Raw Materials Warehouse", "Finished Goods Warehouse", "Maintenance Workshop"],
    compliance: ["ISO 9001", "ISO 45001", "Manufacturing Safety", "Environmental Regulations", "Fire Safety"],
    staffRoles: ["Production Manager", "Supervisors", "Machine Operators", "QC Inspectors", "Maintenance Technicians"],
  },
  "Logistics & Warehousing": {
    operationTypes: ["Receiving & Unloading", "Put-Away", "Order Picking", "Dispatch & Loading", "Returns Processing"],
    equipment: ["Forklifts", "Pallet Jacks", "Conveyor Systems", "WMS Terminals", "Dock Equipment"],
    facilities: ["Receiving Dock", "Dispatch Dock", "Bulk Storage", "Pick / Pack Area", "Cold Storage"],
    compliance: ["Warehousing Safety", "Dangerous Goods", "Cold Chain Compliance", "Chain of Responsibility", "Forklift Licensing"],
    staffRoles: ["Logistics Manager", "Warehouse Supervisor", "Truck Drivers", "Forklift Operators", "Dispatch Coordinators"],
  },
  "Hospitality / Hotels": {
    operationTypes: ["Guest Check-in", "Housekeeping", "Food & Beverage Service", "Maintenance", "Event Management"],
    equipment: ["Laundry Equipment", "Kitchen Equipment", "HVAC Systems", "Security Systems", "AV Equipment"],
    facilities: ["Guest Rooms", "Lobby", "Restaurant & Bar", "Conference Rooms", "Pool & Spa"],
    compliance: ["Food Safety", "Fire Safety", "Health & Safety", "Accessibility", "Liquor Licensing"],
    staffRoles: ["General Manager", "Front Office Manager", "Housekeeping Supervisor", "Head Chef", "Maintenance Manager"],
  },
  "Education / Schools": {
    operationTypes: ["Classroom Instruction", "Facility Maintenance", "Excursions", "IT Management", "Emergency Drills"],
    equipment: ["Smartboards", "Laboratory Equipment", "Sports Equipment", "Security Systems", "First Aid Kits"],
    facilities: ["Classrooms", "Laboratories", "Sports Grounds", "Cafeteria", "Administration Block"],
    compliance: ["Child Protection", "School Safety", "Fire Safety", "Food Safety", "Privacy / FERPA"],
    staffRoles: ["Principal", "Teachers", "Teacher Aides", "IT Support", "Admin Staff"],
  },
  "Property Management": {
    operationTypes: ["Routine Inspections", "Tenant Onboarding", "Maintenance & Repairs", "Lease Management", "Contractor Management"],
    equipment: ["Inspection Tools", "HVAC Systems", "Security Systems", "Cleaning Equipment", "Fire Safety Systems"],
    facilities: ["Residential Units", "Commercial Tenancies", "Common Areas", "Car Parks", "Plant Rooms"],
    compliance: ["Tenancy Regulations", "Building Codes", "Fire Safety", "Electrical Safety", "Pool Safety"],
    staffRoles: ["Property Manager", "Building Manager", "Leasing Agent", "Maintenance Technician", "Admin Staff"],
  },
  "Mining & Extraction": {
    operationTypes: ["Drilling & Blasting", "Ore Extraction", "Processing Plant Operations", "Environmental Monitoring", "Emergency Response"],
    equipment: ["Drill Rigs", "Haul Trucks", "Excavators", "Conveyor Systems", "Monitoring Equipment"],
    facilities: ["Open Cut Mine", "Underground Workings", "Processing Plant", "Fuel Farm", "Maintenance Workshop"],
    compliance: ["Mine Safety Regulations", "Mining Safety Standards", "Environmental Regulations", "Explosives Licensing", "ISO 14001"],
    staffRoles: ["Mine Manager", "Superintendent", "Operators", "Geotechnical Staff", "Safety Officer"],
  },
  "Automotive Services": {
    operationTypes: ["Vehicle Servicing", "Diagnostics", "Parts Handling", "Roadworthy Inspections", "Workshop Safety"],
    equipment: ["Vehicle Hoists", "Diagnostic Tools", "Tyre Changers", "Power Tools", "Battery Testers"],
    facilities: ["Workshop", "Parts Store", "Customer Reception", "Vehicle Yard", "Wash Bay"],
    compliance: ["Workshop Safety", "Waste Oil Disposal", "Roadworthy Standards", "Fire Safety", "Environmental Regulations"],
    staffRoles: ["Workshop Manager", "Mechanics", "Service Advisors", "Parts Staff", "Apprentices"],
  },
  "Oil & Gas": {
    operationTypes: ["Field Operations", "Maintenance", "Permit to Work", "Isolation / LOTO", "Emergency Response"],
    equipment: ["Pressure Systems", "Gas Detectors", "Pumps", "Valves", "Monitoring Systems"],
    facilities: ["Plant Area", "Control Room", "Storage Tank Area", "Workshop", "Field Site"],
    compliance: ["Process Safety", "LOTO Standards", "Environmental Regulations", "Fire Safety", "Permit Systems"],
    staffRoles: ["Operations Manager", "Process Technician", "Maintenance Technician", "Permit Coordinator", "HSE Officer"],
  },
  "Aged Care / NDIS": {
    operationTypes: ["Resident Care", "Medication Support", "Care Planning", "Incident Reporting", "Daily Living Support"],
    equipment: ["Patient Lifts", "Medication Trolleys", "Mobility Aids", "Monitoring Devices", "Cleaning Equipment"],
    facilities: ["Resident Rooms", "Medication Room", "Dining Area", "Laundry", "Staff Station"],
    compliance: ["Care Standards", "Medication Safety", "Infection Control", "Worker Safety", "Privacy"],
    staffRoles: ["Care Manager", "Support Workers", "Registered Nurses", "Lifestyle Coordinators", "Administrators"],
  },
  "Transport & Fleet": {
    operationTypes: ["Vehicle Dispatch", "Driver Fatigue Management", "Load Securing", "Fleet Maintenance", "Incident Response"],
    equipment: ["Rigid Trucks", "Vans", "GPS & Telematics", "Dashcams", "Loading Equipment"],
    facilities: ["Depot / Yard", "Workshop", "Fuel Farm", "Dispatch Office", "Wash Bay"],
    compliance: ["HVNL", "Fatigue Management", "Dangerous Goods", "Loading Standards", "Transport Safety"],
    staffRoles: ["Fleet Manager", "Dispatch Coordinator", "Drivers", "Maintenance Technicians", "Compliance Officer"],
  },
  "Food Manufacturing": {
    operationTypes: ["Raw Material Receiving", "Line Operations", "Quality Sampling", "Cleaning & Sanitation", "Allergen Management"],
    equipment: ["Mixers", "Pasteurisers", "Packaging Machines", "Metal Detectors", "Data Loggers"],
    facilities: ["Production Floor", "QC Lab", "Cold Store", "Packaging Area", "Finished Goods Warehouse"],
    compliance: ["HACCP", "SQF / BRC", "FSMA", "Allergen Labelling", "Food Manufacturing Safety"],
    staffRoles: ["Production Manager", "QA Manager", "Food Safety Officer", "Operators", "Sanitation Team"],
  },
  "Pharmaceutical": {
    operationTypes: ["Batch Production", "In-Process Testing", "Cleanroom Operations", "Validation", "Deviation Management"],
    equipment: ["Tablet Presses", "HPLC Systems", "Autoclaves", "HVAC Systems", "Cold Storage"],
    facilities: ["Cleanrooms", "Manufacturing Suites", "QC Lab", "Dispensary", "Warehouse"],
    compliance: ["GMP", "FDA 21 CFR", "EU GMP Annex 1", "GDP", "Pharmacopoeial Standards"],
    staffRoles: ["Quality Lead", "Production Manager", "QA Officers", "QC Analysts", "Validation Engineers"],
  },
  "Security Services": {
    operationTypes: ["Static Guarding", "Mobile Patrol", "CCTV Monitoring", "Alarm Response", "Incident Investigation"],
    equipment: ["CCTV Systems", "Access Control", "Two-Way Radios", "Body Cameras", "Patrol Vehicles"],
    facilities: ["Control Room", "Guard Post", "Client Site", "Patrol Depot", "Training Facility"],
    compliance: ["Security Licensing", "Worker Safety", "Privacy Act", "First Aid Certification", "Use of Force Regulations"],
    staffRoles: ["Security Manager", "Control Room Operator", "Static Guards", "Patrol Officers", "Schedulers"],
  },
  "Cleaning & Facilities": {
    operationTypes: ["Commercial Cleaning", "Deep Cleaning", "Floor Care", "Waste Management", "Consumables Restocking"],
    equipment: ["Scrubbers", "Vacuum Cleaners", "Pressure Washers", "Steam Cleaners", "Chemical Dispensing Systems"],
    facilities: ["Office Buildings", "Healthcare Facilities", "Warehouse Sites", "Retail Centres", "Chemical Store"],
    compliance: ["Cleaning Safety", "Infection Control", "Chemical Safety", "Working at Heights", "Waste Disposal"],
    staffRoles: ["Operations Manager", "Supervisors", "Commercial Cleaners", "Healthcare Cleaners", "Quality Inspectors"],
  },
  "Event Management": {
    operationTypes: ["Venue Setup", "Bump-In", "Crowd Management", "Vendor Management", "Ticketing"],
    equipment: ["Stage Equipment", "AV Systems", "Generators", "Crowd Barriers", "Communication Radios"],
    facilities: ["Venue Site", "Backstage", "Entry / Exit Points", "Vendor Areas", "First Aid Station"],
    compliance: ["Event Safety", "Council Permits", "Liquor Licensing", "Fire Safety", "Public Liability"],
    staffRoles: ["Event Manager", "Operations Coordinator", "Production Manager", "Security Lead", "Vendor Liaison"],
  },
  Other: {
    operationTypes: ["Daily Operations", "Equipment Operation", "Facility Management", "Quality Control", "Safety Inspections"],
    equipment: ["General Machinery", "Vehicles & Fleet", "IT Equipment", "Safety Equipment", "Power Tools"],
    facilities: ["Main Operations Area", "Office / Admin Space", "Storage Area", "Staff Amenities", "Maintenance Area"],
    compliance: ["Worker Safety", "Quality Management", "Environmental Compliance", "Fire Safety", "Business Licensing"],
    staffRoles: ["Operations Manager", "Supervisors", "General Workers", "Safety Officer", "Admin Staff"],
  },
};

export function getIndustryProfile(industry: string): IndustryProfile {
  if (!industry) return INDUSTRY_PROFILES.Other;
  return INDUSTRY_PROFILES[industry] ?? INDUSTRY_PROFILES.Other;
}
