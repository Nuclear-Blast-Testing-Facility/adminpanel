import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

const defaultDirectoryData = {
  siteTitle: "NBTF.CA Domain Directory",
  siteTagline: "Official subdomain directory, network routing, and contact endpoints for nbtf.ca",
  disclaimer: "\u26A0 NBTF.CA is a second-level domain owned by cbx.nz \u2014 it may or may not be directly affiliated with NBTF or its developer.",
  maintainerNotice: "NBTF.ca is connected via Cloudflare, domain owned by cbx.nz (maintainer of cbx.kiwi).",
  bannerAnnouncement: {
    enabled: true,
    text: "Operational Network Status: Normal. All official subdomains and routing endpoints are active.",
    type: "info",
    link: "//index.nbtf.ca"
  },
  categories: [
    {
      id: "official-links",
      name: "Official Links",
      description: "Core infrastructure, portals, and primary web access points",
      links: [
        {
          id: "dir-1",
          title: "Domain's Directory",
          description: "Directory of all nbtf.ca subdomains, routing portals, and emails",
          url: "https://index.nbtf.ca",
          displayUrl: "i.nbtf.ca",
          badge: "Primary Directory",
          status: "online",
          icon: "FolderGit2"
        },
        {
          id: "dir-2",
          title: "nbtf.ca Homepage",
          description: "The official web portal and master reference for Nuclear Blast Testing Facility",
          url: "https://web.nbtf.ca",
          displayUrl: "web.nbtf.ca",
          badge: "Main Web",
          status: "online",
          icon: "Globe"
        },
        {
          id: "dir-3",
          title: "NBTF.CA (Vite React Alternative)",
          description: "Alternative fast client homepage for nbtf.ca website built with Vite React",
          url: "https://nbtf.ca",
          displayUrl: "nbtf.ca",
          badge: "Vite React",
          status: "online",
          icon: "Atom"
        },
        {
          id: "dir-4",
          title: "Nuclear Blast App",
          description: "The dedicated web companion app for NBTF telemetry and faction operations (Coming Soon)",
          url: "https://app.nbtf.ca",
          displayUrl: "app.nbtf.ca",
          badge: "In Development",
          status: "coming-soon",
          icon: "Smartphone"
        }
      ]
    },
    {
      id: "other-subdomains",
      name: "Other Subdomains",
      description: "Utility tools, registration systems, and network maintainer platforms",
      links: [
        {
          id: "sub-1",
          title: "Register Portal",
          description: "Registration and provisioning portal for subdomains and official email aliases",
          url: "https://register.nbtf.ca",
          displayUrl: "register.nbtf.ca",
          badge: "Access Gateway",
          status: "online",
          icon: "UserPlus"
        },
        {
          id: "sub-2",
          title: "civblog",
          description: "Civilian Blogging Platform & independent community reporting from NBTF territory",
          url: "https://civblog.nbtf.ca",
          displayUrl: "civblog.nbtf.ca",
          badge: "Community Hub",
          status: "online",
          icon: "BookOpen"
        },
        {
          id: "sub-3",
          title: "Domain Maintainer (cbx.kiwi)",
          description: "Official network domain maintainer and infrastructure sponsor platform",
          url: "https://cbx.kiwi",
          displayUrl: "cbx.kiwi",
          badge: "Maintainer",
          status: "external",
          icon: "ShieldAlert"
        }
      ]
    },
    {
      id: "faction-websites",
      name: "Faction Websites",
      description: "Authorized and recognized faction operational web pages",
      links: [
        {
          id: "fac-1",
          title: "just another faction",
          description: "Official website and communication node for just another faction (JAF)",
          url: "https://jaf.nbtf.ca",
          displayUrl: "jaf.nbtf.ca",
          badge: "Faction Web",
          status: "online",
          icon: "Flag"
        },
        {
          id: "fac-2",
          title: "Military Training Department",
          description: "The tactical website, doctrines, and syllabus for Military Training Department (MTD)",
          url: "https://mtd.nbtf.ca",
          displayUrl: "mtd.nbtf.ca",
          badge: "Military Dept",
          status: "online",
          icon: "Crosshair"
        }
      ]
    },
    {
      id: "public-emails",
      name: "Public Emails",
      description: "Encrypted mailboxes, department contacts, and legal communication channels",
      links: [
        {
          id: "mail-1",
          title: "Official: Admin Contact",
          description: "Direct contact inbox for the NBTF.CA domain administrator and server ops",
          url: "mailto:admin@nbtf.ca",
          displayUrl: "admin@nbtf.ca",
          badge: "Admin Mail",
          isEmail: true,
          status: "online",
          icon: "Mail"
        },
        {
          id: "mail-2",
          title: "Faction: just another faction",
          description: "Official faction correspondence for just another faction diplomatic inquiries",
          url: "mailto:jaf@factions.nbtf.ca",
          displayUrl: "jaf@factions.nbtf.ca",
          badge: "Faction Mail",
          isEmail: true,
          status: "online",
          icon: "Send"
        },
        {
          id: "mail-3",
          title: "Faction: Channel 6 News",
          description: "Press releases, news dispatches, and emergency broadcaster contact inbox",
          url: "mailto:c6n@factions.nbtf.ca",
          displayUrl: "c6n@factions.nbtf.ca",
          badge: "Press Desk",
          isEmail: true,
          status: "online",
          icon: "Radio"
        },
        {
          id: "mail-4",
          title: "Official: Legal Contact",
          description: "Formal legal inquiries, DMCA notices, and domain policy matters (cbx.kiwi)",
          url: "mailto:legal@cbx.kiwi",
          displayUrl: "legal@cbx.kiwi",
          badge: "Legal Desk",
          isEmail: true,
          status: "external",
          icon: "Scale"
        }
      ]
    }
  ]
};
const defaultWwwData = {
  siteTitle: "Nuclear Blast Testing Facility",
  siteTagline: "The definitive intelligence dossier and operations reference for NBTF on Roblox",
  heroDescription: "A secret nuclear testing facility operates a superheated fusion reactor and executes nuclear tests while military, security, and scientific personnel keep the facility operational. A rebel organisation attempts to infiltrate the facility, sabotage systems, and trigger a catastrophic core explosion.",
  robloxExperienceUrl: "https://www.roblox.com/games/6153709/Nuclear-Blast-Testing-Facility",
  stats: {
    visits: "41.7M+",
    positiveRating: "88%+",
    dailyPlayers: "400+",
    totalRoles: 28,
    creator: "Ryanblaze",
    corporation: "Pyrowh Corporation",
    resistance: "Sharlach Resistance"
  },
  bannerAlert: {
    enabled: true,
    level: "NOMINAL",
    message: "REACTOR CORE STABILITY: 99.8% \u2014 ALL PROTOCOLS ENFORCED. FACILITY AT STANDARD READINESS."
  },
  roles: [
    {
      id: "council-executive",
      name: "Council Executive",
      category: "Executive",
      side: "Facility",
      clearanceLevel: "Level 5",
      hasLaunchKeycard: true,
      isPaid: true,
      costRobux: 2e3,
      spawnLocation: "Executive Board Room / SCC Rooftop",
      purpose: "Senior leadership of the Supreme Council alongside the Facility Director.",
      responsibilities: [
        "Coordinate all facility departments",
        "Help make strategic facility policies",
        "Administrative oversight & Supreme Council votes",
        "Hold authority over Facility Directors (including impeachment)",
        "Participate in executive-level nuclear launch authorizations"
      ],
      equipment: ["Launch Keycard", "Executive ID", "Special Weapons Chamber Access", "Executive Vehicle"],
      loreNotes: "Council Executives represent the Supreme Council. Banished or expelled executives historically become rebel Warlords.",
      mirrorRole: "Warlord"
    },
    {
      id: "facility-director",
      name: "Facility Director",
      category: "Executive",
      side: "Facility",
      clearanceLevel: "Level 6",
      hasLaunchKeycard: true,
      isPaid: true,
      costRobux: 3400,
      spawnLocation: "Executive Offices",
      purpose: "The highest facility operational authority.",
      responsibilities: [
        "Overall facility command & crisis leadership",
        "Strategic decision making & maintaining order",
        "Final approval on high-level defensive operations",
        "Directing facility emergency protocols"
      ],
      equipment: ["Level 6 Keycard", "Launch Keycard", "Director APC", "Director Sedan", "Executive Broadcast Dashboard"],
      loreNotes: "Impeached or removed Directors historically seek revenge by joining the rebellion as Overseers.",
      mirrorRole: "Overseer"
    },
    {
      id: "government-official",
      name: "Government Official",
      category: "Government",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 400,
      spawnLocation: "Strategic Command Center (SCC)",
      purpose: "Represents national governmental interests at NBTF.",
      responsibilities: [
        "Government liaison & regulatory compliance",
        "National security oversight",
        "Monitoring facility compliance and safety treaties"
      ],
      equipment: ["Level 4 Keycard", "Government Sedan", "Government SUV"],
      mirrorRole: "Hitman"
    },
    {
      id: "intelligence-agent",
      name: "Intelligence Agent",
      category: "Government",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Strategic Command Center (SCC)",
      purpose: "The facility's intelligence and counter-espionage operative.",
      responsibilities: [
        "Gather internal intelligence",
        "Investigate suspicious personnel & counter espionage",
        "Identify and neutralize hostile rebel covert assets"
      ],
      equipment: ["Level 4 Keycard", "Covert Scanner", "Tactical Radio"],
      mirrorRole: "Spy"
    },
    {
      id: "protection-service",
      name: "Protection Service",
      category: "Government",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Strategic Command Center (SCC)",
      purpose: "Government official and VIP close protection detail.",
      responsibilities: [
        "Protect government officials and VIPs",
        "Escort dignitaries through restricted sectors",
        "Respond to immediate threats against leadership"
      ],
      equipment: ["Level 4 Keycard", "Heavy Armor", "VIP Escort Radio"]
    },
    {
      id: "core-engineer",
      name: "Core Engineer",
      category: "Scientist",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: true,
      isPaid: false,
      spawnLocation: "Energy Generation Center (EGC) Core Room",
      purpose: "Monitor and maintain the reactor core and prevent catastrophic meltdown.",
      responsibilities: [
        "Monitor core temperature and plasma stability",
        "Operate primary heating and coolant systems",
        "Respond to core alarms and dangerous destabilization",
        "Perform emergency coolant injection procedures"
      ],
      equipment: ["Level 3 Keycard", "Launch Keycard", "Hazmat Suit", "Core Diagnostic Tool"],
      loreNotes: "Core Engineers are the direct frontline defense against the rebel core sabotage sequence."
    },
    {
      id: "rocket-scientist",
      name: "Rocket Scientist",
      category: "Scientist",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: true,
      isPaid: false,
      spawnLocation: "Weapons Research Center",
      purpose: "Design and conduct nuclear tests and missile launch sequences.",
      responsibilities: [
        "Design weapon tests & manage test countdowns",
        "Conduct ballistic launches and monitor nuclear blast effects",
        "Analyze radiological data & secure launch terminals"
      ],
      equipment: ["Level 3 Keycard", "Launch Keycard", "Launch Console Access"]
    },
    {
      id: "infantry-soldier",
      name: "Infantry Soldier",
      category: "Military",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Military Barracks",
      purpose: "The conventional frontline military defense force.",
      responsibilities: [
        "Defend the facility perimeter and key sectors",
        "Patrol strategic pathways & engage hostile rebel forces",
        "Defend personnel and maintain physical security"
      ],
      equipment: ["M4 Carbine", "USP Pistol", "Level 3 Keycard", "Flashlight", "Radio", "Infantry Jeep"],
      mirrorRole: "Raider"
    },
    {
      id: "military-officer",
      name: "Military Officer",
      category: "Military",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: true,
      isPaid: true,
      costRobux: 400,
      spawnLocation: "Military Barracks Officer Quarters",
      purpose: "Military tactical command and operational planning.",
      responsibilities: [
        "Command military forces during base raids",
        "Plan tactical defensive operations",
        "Authorize heavy weapons response"
      ],
      equipment: ["Level 4 Keycard", "Launch Keycard", "Officer Pistol", "Officer Vehicle"]
    },
    {
      id: "military-police",
      name: "Military Police",
      category: "Military",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 800,
      spawnLocation: "Military Barracks MP Station",
      purpose: "Military law enforcement and facility discipline.",
      responsibilities: [
        "Enforce military regulations and base protocol",
        "Investigate military infractions and detain rogue units",
        "Maintain base order"
      ],
      equipment: ["Level 4 Keycard", "Handcuffs", "Stun Baton", "MP Sedan"]
    },
    {
      id: "special-task-force",
      name: "Special Task Force",
      category: "Military",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 450,
      spawnLocation: "Military Barracks STF Armory",
      purpose: "Elite tactical military strike and counter-terror team.",
      responsibilities: [
        "Handle high-risk armed rebel assaults",
        "Conduct specialized tactical strikes",
        "Retake breached core control rooms"
      ],
      equipment: ["Level 4 Keycard", "Heavy Tactical Armor", "Advanced Rifle", "STF Tactical SUV"],
      mirrorRole: "Commando"
    },
    {
      id: "exterior-guard",
      name: "Exterior Guard",
      category: "Security",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Exterior Checkpoint",
      purpose: "The outer defensive perimeter gatekeeper.",
      responsibilities: [
        "Defend the facility outer perimeter",
        "Control exterior vehicle and pedestrian checkpoints",
        "Halt unauthorized entry"
      ],
      equipment: ["Level 3 Keycard", "Shotgun / Rifle", "Security Pickup", "Security SUV"]
    },
    {
      id: "internal-security",
      name: "Internal Security",
      category: "Security",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Interior Checkpoint",
      purpose: "Interior security and hallway patrol.",
      responsibilities: [
        "Patrol interior corridors and secure sensitive doors",
        "Verify keycard clearance of passing personnel",
        "Respond to internal security alarms"
      ],
      equipment: ["Level 3 Keycard", "Taser", "Sidearm", "Security Golf Cart"]
    },
    {
      id: "security-supervisor",
      name: "Security Supervisor",
      category: "Security",
      side: "Facility",
      clearanceLevel: "Level 4",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 450,
      spawnLocation: "Interior Security Hub",
      purpose: "Security department operations command.",
      responsibilities: [
        "Supervise security personnel and guard posts",
        "Coordinate camera surveillance and emergency lockdowns",
        "Handle sensitive security escalations"
      ],
      equipment: ["Level 4 Keycard", "Supervisor Sidearm", "Security Supervisor SUV"]
    },
    {
      id: "factory-personnel",
      name: "Factory Personnel",
      category: "Safety",
      side: "Facility",
      clearanceLevel: "Level 2",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Receiving Department",
      purpose: "Factory production and cargo processing.",
      responsibilities: [
        "Operate production facilities & material lines",
        "Receive deliveries and inspect incoming shipments",
        "Perform quality control"
      ],
      equipment: ["Level 2 Keycard", "Work Tools", "Cargo Scanner"]
    },
    {
      id: "janitor",
      name: "Janitor",
      category: "Safety",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Maintenance Offices",
      purpose: "Facility sanitation and radiological cleanup.",
      responsibilities: [
        "Clean facility corridors and wipe contamination",
        "Assist in hazardous material cleanup",
        "Maintain sanitation in high-risk zones"
      ],
      equipment: ["Level 3 Keycard", "Mop", "Biohazard Bin", "Cleaning Cart"]
    },
    {
      id: "maintenance-team",
      name: "Maintenance Team",
      category: "Safety",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Maintenance Offices",
      purpose: "Facility infrastructure technicians and system repair.",
      responsibilities: [
        "Repair damaged electrical systems and broken doors",
        "Maintain facility cooling pumps and structural conduits",
        "Conduct regular facility safety inspections"
      ],
      equipment: ["Level 3 Keycard", "Wrench", "Welder", "Toolbox"]
    },
    {
      id: "medic",
      name: "Medic",
      category: "Safety",
      side: "Facility",
      clearanceLevel: "Level 3",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Hospital",
      purpose: "Medical triage and health restoration.",
      responsibilities: [
        "Treat wounded personnel from combat and accidents",
        "Administer anti-radiation treatments",
        "Staff the Hospital ward"
      ],
      equipment: ["Level 3 Keycard", "Medkit", "Defibrillator", "Syringe"]
    },
    {
      id: "volunteer",
      name: "Volunteer",
      category: "Safety",
      side: "Facility",
      clearanceLevel: "Level 1",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Logistics Checkpoint",
      purpose: "General-purpose facility support worker.",
      responsibilities: [
        "Assist personnel with miscellaneous chores",
        "Transport minor cargo",
        "Learn facility layout and earn promotions"
      ],
      equipment: ["Level 1 Keycard", "Flashlight"]
    },
    {
      id: "delivery-driver",
      name: "Delivery Driver",
      category: "Logistics",
      side: "Facility",
      clearanceLevel: "Level 2",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Logistics Checkpoint",
      purpose: "Supply logistics and heavy material transportation.",
      responsibilities: [
        "Transport supply crates, rocket fuel, and sheet metal",
        "Drive logistics routes into facility receiving bays",
        "Maintain supply lines"
      ],
      equipment: ["Level 2 Keycard", "Delivery Flatbed Truck", "Fuel Canisters"]
    },
    {
      id: "commando",
      name: "Commando",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Level 1 / Rebel Card",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 350,
      spawnLocation: "Rebel Base",
      purpose: "Elite rebel combatant specialized in breach assaults.",
      responsibilities: [
        "Execute high-risk breach operations",
        "Assault facility defensive strongpoints",
        "Eliminate high-value facility defenders"
      ],
      equipment: ["Rebel Keycard", "Heavy Assault Rifle", "Combat Armor", "Explosives"],
      mirrorRole: "Special Task Force"
    },
    {
      id: "hitman",
      name: "Hitman",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Level 1 / Rebel Card",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 550,
      spawnLocation: "Rebel Base / Hidden Cave",
      purpose: "Contracted assassin targeting high-ranking facility personnel.",
      responsibilities: [
        "Eliminate high-value targets (Director, Council, Officials)",
        "Conduct clandestine infiltration strikes",
        "Operate independently under bounty contracts"
      ],
      equipment: ["Rebel Keycard", "Silenced Sniper / Pistol", "Infiltration Cloak"],
      loreNotes: "Hitmen are hired mercenary guns rather than ideological members of the Sharlach Resistance.",
      mirrorRole: "Government Official"
    },
    {
      id: "overseer",
      name: "Overseer",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Rebel Card",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 3e3,
      spawnLocation: "Rebel Base Command",
      purpose: "Rebel intelligence and strategic mastermind.",
      responsibilities: [
        "Monitor facility communications and vulnerabilities",
        "Coordinate reactor sabotage sequences and terminal code gathering",
        "Guide assault teams toward weak points"
      ],
      equipment: ["Rebel Master Card", "Rebel Command Terminal", "Tactical Map"],
      loreNotes: "Overseers are former Facility Directors removed by the Supreme Council who now direct resistance intelligence.",
      mirrorRole: "Facility Director"
    },
    {
      id: "raid-leader",
      name: "Raid Leader",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Level 1 / Rebel Card",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 800,
      spawnLocation: "Rebel Base",
      purpose: "Tactical rebel raid commander.",
      responsibilities: [
        "Plan and lead rebel squads in organized attacks",
        "Coordinate breaches into the Core and SCC",
        "Call targets and rally combatants"
      ],
      equipment: ["Rebel Keycard", "Command Radio", "Assault Loadout"],
      mirrorRole: "Security Supervisor"
    },
    {
      id: "raider",
      name: "Raider",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Rebel Card",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Rebel Base",
      purpose: "Standard rebel frontline combat force.",
      responsibilities: [
        "Attack facility checkpoints and defense lines",
        "Capture strategic control points",
        "Provide fire support during core infiltration"
      ],
      equipment: ["AK-47 / SMG", "Rebel Keycard", "Flashlight"],
      mirrorRole: "Infantry Soldier"
    },
    {
      id: "spy",
      name: "Spy",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Level 1 / Disguised",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Rebel Base / Infiltration Spawn",
      purpose: "Covert undercover infiltrator operating inside facility lines.",
      responsibilities: [
        "Infiltrate facility disguised in civilian or worker gear",
        "Access terminals and steal override code fragments",
        "Sabotage systems from deep within without detection"
      ],
      equipment: ["Disguise Kit", "Hacking Decryption Tool", "Silenced Sidearm"],
      loreNotes: "Creates a direct social infiltration loop inside the facility.",
      mirrorRole: "Intelligence Agent"
    },
    {
      id: "warlord",
      name: "Warlord",
      category: "Rebellion",
      side: "Rebellion",
      clearanceLevel: "Rebel Card",
      hasLaunchKeycard: false,
      isPaid: true,
      costRobux: 1700,
      spawnLocation: "Rebel Base Throne",
      purpose: "Supreme military commander of the Sharlach Resistance.",
      responsibilities: [
        "Lead all rebellion armed forces in total war",
        "Formulate grand strategic invasion doctrine",
        "Authorize full-scale reactor core destruction operations"
      ],
      equipment: ["Warlord Heavy Armor", "Warlord Custom Weaponry", "Rebel Master Key"],
      loreNotes: "Warlords are former Supreme Council Executives expelled from NBTF who now seek total destruction of the Pyrowh Corporation.",
      mirrorRole: "Council Executive"
    },
    {
      id: "civilian",
      name: "Civilian",
      category: "Neutral",
      side: "Neutral",
      clearanceLevel: "None",
      hasLaunchKeycard: false,
      isPaid: false,
      spawnLocation: "Civilian Gas Station / Wilderness",
      purpose: "Independent wanderer and survivor in NBTF territory.",
      responsibilities: [
        "Explore the facility perimeter and external landmarks",
        "Survive ongoing clashes between Pyrowh and Sharlach forces",
        "Choose whether to cooperate or remain neutral"
      ],
      equipment: ["Civilian Clothes", "Flashlight"],
      loreNotes: "The civilian role embodies the experience of an independent bystander navigating the nuclear territory."
    }
  ],
  locations: [
    {
      id: "egc-core",
      name: "Energy Generation Center (EGC) & Reactor Core",
      category: "Science & Reactor",
      clearanceRequired: "Level 3 (Level 4+ for Control Room)",
      description: "The beating heart of NBTF. Houses the superheated fusion reactor core, coolant injection pipelines, and safety override panels.",
      associatedRoles: ["Core Engineer", "Facility Director", "Rebel Saboteurs"],
      keyFeatures: ["Superheated Plasma Core", "Coolant Flow Valving", "Master Safety Override Panel", "180s Meltdown Alarm"]
    },
    {
      id: "scc",
      name: "Strategic Command Center (SCC)",
      category: "Executive/Government",
      clearanceRequired: "Level 4 - 6",
      description: "Command and control installation housing high-level government liaisons, intelligence suites, executive boardrooms, and rooftop broadcasting.",
      associatedRoles: ["Government Official", "Intelligence Agent", "Protection Service", "Council Executive"],
      keyFeatures: ["Executive Board Room", "Weapons Chamber", "Broadcast Station", "Direct Teleporter"]
    },
    {
      id: "weapons-research",
      name: "Weapons Research Center & Launch Silo",
      category: "Science & Reactor",
      clearanceRequired: "Level 3 + Launch Keycard",
      description: "High-security nuclear missile research center where nuclear warheads are calibrated and test sequences launched across the Testing Field.",
      associatedRoles: ["Rocket Scientist", "Facility Director", "Council Executive"],
      keyFeatures: ["Nuclear Silo Controls", "Radiation Monitoring Arrays", "Blast Physics Telemetry"]
    },
    {
      id: "military-barracks",
      name: "Military Barracks",
      category: "Military",
      clearanceRequired: "Level 3 - 4",
      description: "Tactical staging grounds for Infantry, Military Police, Officers, and the Special Task Force.",
      associatedRoles: ["Infantry Soldier", "Military Officer", "Military Police", "Special Task Force"],
      keyFeatures: ["Shooting Range", "Melee Training Dummies", "Armory Lockers", "Vehicle Garage"]
    },
    {
      id: "data-center",
      name: "Data Center & Applied Sciences",
      category: "Interior",
      clearanceRequired: "Level 3",
      description: "Main server banks containing sensitive facility telemetry, access logs, and code fragments critical for reactor safety overrides.",
      associatedRoles: ["Core Engineer", "Spy", "Internal Security"],
      keyFeatures: ["Server Banks", "Code Decryption Terminals", "Upper Factory Catwalks"]
    },
    {
      id: "exterior-checkpoint",
      name: "Exterior Checkpoint & Logistics",
      category: "Exterior",
      clearanceRequired: "Level 2 - 3",
      description: "The outermost fortified perimeter controlling all vehicular and pedestrian access into the testing grounds.",
      associatedRoles: ["Exterior Guard", "Delivery Driver", "Volunteer"],
      keyFeatures: ["Barrier Gates", "Vehicle Inspection Bay", "Cargo Scale"]
    },
    {
      id: "hospital",
      name: "Hospital & Medical Ward",
      category: "Interior",
      clearanceRequired: "Level 3",
      description: "Emergency treatment facility equipped with decontamination showers, trauma pods, and medical terminals.",
      associatedRoles: ["Medic", "Janitor"],
      keyFeatures: ["Trauma Beds", "Anti-Radiation Dispensary", "Sub-level Terminal"]
    },
    {
      id: "rebel-base",
      name: "Sharlach Resistance Rebel Base & Hidden Cave",
      category: "Exterior",
      clearanceRequired: "Rebel Card",
      description: "Fortified rebel bunker hidden in the surrounding badlands where raids are planned, and weapons stockpiled.",
      associatedRoles: ["Warlord", "Overseer", "Raid Leader", "Commando", "Raider", "Spy", "Hitman"],
      keyFeatures: ["War Room", "Armory Spawns", "Underground Escape Tunnels", "Rebel Gas Outpost"]
    }
  ],
  terminals: [
    { id: "term-1", name: "Hospital Terminal", location: "Hospital Ward", description: "Contains medical encryption hashes and sub-level reactor bypass data." },
    { id: "term-2", name: "Internal Security Checkpoint Terminal", location: "Internal Security Hub", description: "Stores internal security clearances and lock codes." },
    { id: "term-3", name: "Kitchen / Applied Sciences Terminal", location: "Applied Sciences Center", description: "Connected to coolant fluid mechanics and thermal logs." },
    { id: "term-4", name: "Power Station Terminal", location: "EGC Lower Power Station", description: "Regulates auxiliary turbine power and safety interlocks." },
    { id: "term-5", name: "Strategic Command Center Terminal", location: "SCC Level 2", description: "Executive clearance database housing master override code fragment." },
    { id: "term-6", name: "West Tower Terminal", location: "West Perimeter Watchtower", description: "Perimeter surveillance telemetry and secondary failsafe." }
  ],
  gamepasses: [
    { name: "Commando", role: "Rebel Commando", robux: 350, description: "Unlocks heavy combat assault loadout on the Rebel team." },
    { name: "Military Officer", role: "Facility Military", robux: 400, description: "Grants Level 4 clearance, launch keycard, and military command authority." },
    { name: "Government Official", role: "Facility Government", robux: 400, description: "Grants Level 4 clearance, executive limousine, and SCC liaison role." },
    { name: "Security Supervisor", role: "Facility Security", robux: 450, description: "Grants security leadership access and surveillance oversight tools." },
    { name: "Special Task Force", role: "Facility Military", robux: 450, description: "Unlocks elite armor, advanced rifles, and tactical strike vehicle." },
    { name: "Hitman", role: "Independent Rebel", robux: 550, description: "Unlocks silenced assassination loadout and stealth operative contracts." },
    { name: "Military Police", role: "Facility Military", robux: 800, description: "Unlocks MP squad car, handcuffs, and base disciplinary authority." },
    { name: "Raid Leader", role: "Rebel Command", robux: 800, description: "Grants squad command radio and organized raid leadership gear." },
    { name: "Warlord", role: "Rebel Supreme Leader", robux: 1700, description: "Supreme rebel leadership role, heavy armor, and master rebel access." },
    { name: "Council Executive", role: "Supreme Council", robux: 2e3, description: "Senior Supreme Council seat with impeachment and launch power." },
    { name: "Overseer", role: "Rebel Intelligence Head", robux: 3e3, description: "Former Director commanding rebel sabotage intelligence." },
    { name: "Facility Director", role: "Supreme Facility Head", robux: 3400, description: "Highest operational facility authority with Level 6 clearance." }
  ],
  loreOverview: {
    facilityFaction: "Pyrowh Corporation",
    rebelFaction: "Sharlach Resistance",
    backstory: "The Pyrowh Corporation operates the Nuclear Blast Testing Facility under strict military and governmental contracts, harnessing superheated plasma reactors and developing experimental nuclear warheads. The Sharlach Resistance, formed by disenfranchised former facility executives, banished directors, and freedom fighters, wages asymmetric war to dismantle the facility and breach its reactor core.",
    roleMirrors: [
      { facility: "Facility Director (L6)", rebel: "Overseer (Rebel Mastermind)", notes: "Overseers are canonically former Facility Directors removed or impeached by the Supreme Council." },
      { facility: "Council Executive (L5)", rebel: "Warlord (Supreme Rebel Commander)", notes: "Warlords are banished former Supreme Council Executives seeking total annihilation of Pyrowh." },
      { facility: "Special Task Force (L4)", rebel: "Commando (Elite Raider)", notes: "Direct tactical mirrors in combat armor, weaponry, and breaching capabilities." },
      { facility: "Intelligence Agent (L4)", rebel: "Spy (Undercover Saboteur)", notes: "The cat-and-mouse game of counter-espionage vs covert terminal infiltration." },
      { facility: "Infantry Soldier (L3)", rebel: "Raider (Frontline Combat)", notes: "The backbone combat forces engaging in perimeter and hallway firefights." },
      { facility: "Security Supervisor (L4)", rebel: "Raid Leader (Assault Coordinator)", notes: "Tactical leaders directing team movements and security lockdowns." },
      { facility: "Government Official (L4)", rebel: "Hitman (Contracted Assassin)", notes: "VIP political interests vs clandestine contract elimination." }
    ]
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("overview");
    const saving = ref(false);
    const statusMessage = ref("");
    const statusType = ref("success");
    const redisMode = ref("memory");
    const redisHealthy = ref(true);
    const indexData = ref(JSON.parse(JSON.stringify(defaultDirectoryData)));
    const wwwData = ref(JSON.parse(JSON.stringify(defaultWwwData)));
    const auditLogs = ref([]);
    const rawIndexJson = ref("");
    const rawWwwJson = ref("");
    const tabs = computed(() => {
      var _a, _b;
      return [
        { id: "overview", label: "Overview & Telemetry" },
        { id: "index", label: "Directory Links (i.nbtf.ca)", count: totalIndexLinks.value },
        { id: "www", label: "Game Dossier & Roles (web.nbtf.ca)", count: (_b = (_a = wwwData.value) == null ? void 0 : _a.roles) == null ? void 0 : _b.length },
        { id: "redis", label: "Redis Datastore JSON" }
      ];
    });
    const totalIndexLinks = computed(() => {
      var _a;
      if (!((_a = indexData.value) == null ? void 0 : _a.categories)) return 0;
      return indexData.value.categories.reduce((acc, cat) => {
        var _a2;
        return acc + (((_a2 = cat.links) == null ? void 0 : _a2.length) || 0);
      }, 0);
    });
    const lastUpdatedTime = computed(() => {
      var _a;
      return ((_a = indexData.value) == null ? void 0 : _a.updatedAt) ? new Date(indexData.value.updatedAt).toLocaleString() : "Just now";
    });
    const alertStateColor = computed(() => {
      var _a, _b;
      const lvl = (_b = (_a = wwwData.value) == null ? void 0 : _a.bannerAlert) == null ? void 0 : _b.level;
      if (lvl === "LEVEL 5 EMERGENCY") return "text-red-400 animate-pulse";
      if (lvl == null ? void 0 : lvl.includes("DEFCON")) return "text-amber-400";
      return "text-emerald-400";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col justify-between" }, _attrs))}><header class="border-b border-slate-800 bg-facility-900/90 backdrop-blur-md sticky top-0 z-40"><div class="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(255,183,3,0.2)]"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div><div><div class="flex items-center gap-2"><span class="font-display text-lg font-bold tracking-wider text-white">NBTF.CA</span><span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"> ADMIN PANEL </span></div><p class="text-[11px] text-slate-400 font-mono">Master Database &amp; Configuration Console</p></div></div><div class="flex items-center gap-3 font-mono text-xs">`);
      if (statusMessage.value) {
        _push(`<span class="${ssrRenderClass([
          "px-2.5 py-1 rounded border transition-all text-[11px]",
          statusType.value === "success" ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50" : "bg-red-950/80 text-red-300 border-red-500/50"
        ])}">${ssrInterpolate(statusMessage.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-facility-850 border border-slate-800 text-slate-400"><span class="${ssrRenderClass([redisHealthy.value ? "bg-emerald-400" : "bg-amber-400", "w-2 h-2 rounded-full"])}"></span><span>REDIS: ${ssrInterpolate(redisMode.value.toUpperCase())}</span></div><button${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,183,3,0.25)] transition-all disabled:opacity-50">`);
      if (saving.value) {
        _push(`<svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span>${ssrInterpolate(saving.value ? "SAVING..." : "COMMIT ALL")}</span></button><button class="p-1.5 rounded-lg bg-facility-800 hover:bg-facility-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors" title="Sign out"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button></div></div><div class="border-t border-slate-800 bg-facility-950/60 px-4"><div class="container mx-auto flex items-center gap-2 overflow-x-auto py-2 font-mono text-xs"><!--[-->`);
      ssrRenderList(tabs.value, (tab) => {
        _push(`<button class="${ssrRenderClass([
          "px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
          activeTab.value === tab.id ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(255,183,3,0.15)] font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-facility-850 border border-transparent"
        ])}"><span>${ssrInterpolate(tab.label)}</span>`);
        if (tab.count !== void 0) {
          _push(`<span class="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">${ssrInterpolate(tab.count)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div></header><main class="container mx-auto px-4 py-8 flex-1 max-w-6xl">`);
      if (activeTab.value === "overview") {
        _push(`<section class="space-y-8"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs"><div class="admin-card p-5 rounded-xl"><span class="text-slate-400">DIRECTORY ENDPOINTS</span><p class="text-3xl font-display font-bold text-amber-400 mt-1">${ssrInterpolate(totalIndexLinks.value)}</p><span class="text-slate-500">Across ${ssrInterpolate(((_b = (_a = indexData.value) == null ? void 0 : _a.categories) == null ? void 0 : _b.length) || 0)} categories</span></div><div class="admin-card p-5 rounded-xl"><span class="text-slate-400">GAME DOSSIER ROLES</span><p class="text-3xl font-display font-bold text-cyan-400 mt-1">${ssrInterpolate(((_d = (_c = wwwData.value) == null ? void 0 : _c.roles) == null ? void 0 : _d.length) || 0)}</p><span class="text-slate-500">28 classes configured</span></div><div class="admin-card p-5 rounded-xl"><span class="text-slate-400">FACILITY ALERT STATE</span><p class="${ssrRenderClass([alertStateColor.value, "text-xl font-display font-bold mt-2"])}">${ssrInterpolate(((_f = (_e = wwwData.value) == null ? void 0 : _e.bannerAlert) == null ? void 0 : _f.level) || "NOMINAL")}</p><span class="text-slate-500">Banner: ${ssrInterpolate(((_h = (_g = wwwData.value) == null ? void 0 : _g.bannerAlert) == null ? void 0 : _h.enabled) ? "Active" : "Muted")}</span></div><div class="admin-card p-5 rounded-xl"><span class="text-slate-400">LAST PERSISTED</span><p class="text-xs font-bold text-slate-200 mt-2 truncate">${ssrInterpolate(lastUpdatedTime.value)}</p><span class="text-slate-500">Synced to Redis cluster</span></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="admin-card p-6 rounded-2xl space-y-4"><h3 class="text-base font-display font-bold text-white uppercase tracking-wider"> Quick Management Operations </h3><p class="text-xs text-slate-400 leading-relaxed"> Trigger synchronization across the connected Vercel deployments (<a href="https://index.nbtf.ca" target="_blank" class="text-amber-400 underline">index.nbtf.ca</a> and <a href="https://web.nbtf.ca" target="_blank" class="text-cyan-400 underline">web.nbtf.ca</a>). </p><div class="flex flex-wrap gap-3 font-mono text-xs pt-2"><button class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"> Sync Data to Redis </button><button class="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40"> Reset to Master Defaults </button><button class="px-4 py-2 rounded-lg bg-facility-800 hover:bg-facility-700 text-slate-200 border border-slate-700"> Export JSON Backup </button></div></div><div class="admin-card p-6 rounded-2xl space-y-3 font-mono text-xs"><h3 class="text-base font-display font-bold text-white uppercase tracking-wider"> Domain &amp; Architecture Status </h3><div class="space-y-2 text-slate-300"><div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-500">Domain</span><span class="text-white">nbtf.ca (Second-level domain)</span></div><div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-500">Maintainer / Sponsor</span><span class="text-amber-300">cbx.nz \u2022 cbx.kiwi</span></div><div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-500">DNS &amp; CDN</span><span class="text-white">Cloudflare Proxy</span></div><div class="flex justify-between py-1"><span class="text-slate-500">Target Repos</span><span class="text-slate-400">github.com/Nuclear-Blast-Testing-Facility</span></div></div></div></div><div class="admin-card rounded-2xl p-6"><div class="flex items-center justify-between mb-4"><h3 class="text-base font-display font-bold text-white uppercase tracking-wider"> Recent System Audit Trail </h3><span class="text-xs font-mono text-slate-500">${ssrInterpolate(auditLogs.value.length)} recorded entries</span></div><div class="overflow-x-auto"><table class="w-full text-left font-mono text-xs"><thead><tr class="border-b border-slate-800 text-slate-400 uppercase text-[11px]"><th class="pb-2">Timestamp</th><th class="pb-2">Action</th><th class="pb-2">Target</th><th class="pb-2">User</th><th class="pb-2">Details</th></tr></thead><tbody class="divide-y divide-slate-800/60"><!--[-->`);
        ssrRenderList(auditLogs.value.slice(0, 8), (log) => {
          var _a2;
          _push(`<tr class="hover:bg-facility-850/50"><td class="py-2.5 text-slate-500 whitespace-nowrap">${ssrInterpolate((_a2 = log.timestamp) == null ? void 0 : _a2.substring(0, 19).replace("T", " "))}</td><td class="py-2.5 font-bold text-amber-300 whitespace-nowrap">${ssrInterpolate(log.action)}</td><td class="py-2.5 uppercase text-cyan-400 whitespace-nowrap">${ssrInterpolate(log.target)}</td><td class="py-2.5 text-slate-300 whitespace-nowrap">${ssrInterpolate(log.user)}</td><td class="py-2.5 text-slate-400 truncate max-w-xs">${ssrInterpolate(log.details || "\u2014")}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "index") {
        _push(`<section class="space-y-8"><div class="admin-card p-6 rounded-2xl space-y-4"><h3 class="text-base font-display font-bold text-white uppercase tracking-wider"> Index Directory Header &amp; Announcement </h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs"><div><label class="block text-slate-400 mb-1">Site Title</label><input${ssrRenderAttr("value", indexData.value.siteTitle)} type="text" class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"></div><div><label class="block text-slate-400 mb-1">Site Tagline</label><input${ssrRenderAttr("value", indexData.value.siteTagline)} type="text" class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"></div></div><div class="p-4 rounded-xl bg-facility-900 border border-slate-800 font-mono text-xs space-y-3"><div class="flex items-center justify-between"><span class="font-bold text-amber-300">Top Announcement Banner</span><label class="flex items-center gap-2 cursor-pointer text-slate-300"><input${ssrIncludeBooleanAttr(Array.isArray(indexData.value.bannerAnnouncement.enabled) ? ssrLooseContain(indexData.value.bannerAnnouncement.enabled, null) : indexData.value.bannerAnnouncement.enabled) ? " checked" : ""} type="checkbox" class="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-0"><span>Active</span></label></div><div class="grid grid-cols-1 md:grid-cols-3 gap-3"><div class="md:col-span-2"><label class="block text-slate-400 mb-1">Banner Text</label><input${ssrRenderAttr("value", indexData.value.bannerAnnouncement.text)} type="text" class="w-full px-3 py-2 bg-facility-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"></div><div><label class="block text-slate-400 mb-1">Optional Link</label><input${ssrRenderAttr("value", indexData.value.bannerAnnouncement.link)} type="text" class="w-full px-3 py-2 bg-facility-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs"><div><label class="block text-slate-400 mb-1">Domain Disclaimer</label><textarea rows="2" class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400">${ssrInterpolate(indexData.value.disclaimer)}</textarea></div><div><label class="block text-slate-400 mb-1">Maintainer Notice</label><textarea rows="2" class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400">${ssrInterpolate(indexData.value.maintainerNotice)}</textarea></div></div></div><div class="space-y-6"><div class="flex items-center justify-between"><h3 class="text-lg font-display font-bold text-white uppercase tracking-wider"> Categories &amp; Link Endpoints </h3><button class="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold"> + Add Category </button></div><!--[-->`);
        ssrRenderList(indexData.value.categories, (cat, catIdx) => {
          _push(`<div class="admin-card p-6 rounded-2xl space-y-4"><div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 font-mono text-xs"><div class="flex items-center gap-2 flex-1 min-w-[200px]"><input${ssrRenderAttr("value", cat.name)} type="text" placeholder="Category Name" class="px-3 py-1.5 bg-facility-900 border border-slate-700 rounded-lg text-white font-bold text-sm focus:outline-none focus:border-amber-400 flex-1 max-w-xs"><input${ssrRenderAttr("value", cat.description)} type="text" placeholder="Category Description" class="px-3 py-1.5 bg-facility-900 border border-slate-800 rounded-lg text-slate-400 text-xs focus:outline-none focus:border-amber-400 flex-1"></div><div class="flex items-center gap-2"><button class="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold"> + Add Link </button><button class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30" title="Delete category"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div></div><div class="space-y-3"><!--[-->`);
          ssrRenderList(cat.links, (link, linkIdx) => {
            _push(`<div class="p-3.5 rounded-xl bg-facility-900 border border-slate-800 font-mono text-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center"><div class="md:col-span-3"><label class="block text-[10px] text-slate-500 mb-0.5">TITLE</label><input${ssrRenderAttr("value", link.title)} type="text" placeholder="Link Title" class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"></div><div class="md:col-span-3"><label class="block text-[10px] text-slate-500 mb-0.5">URL / ENDPOINT</label><input${ssrRenderAttr("value", link.url)} type="text" placeholder="https://..." class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"></div><div class="md:col-span-2"><label class="block text-[10px] text-slate-500 mb-0.5">DISPLAY URL</label><input${ssrRenderAttr("value", link.displayUrl)} type="text" placeholder="web.nbtf.ca" class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"></div><div class="md:col-span-2"><label class="block text-[10px] text-slate-500 mb-0.5">BADGE</label><input${ssrRenderAttr("value", link.badge)} type="text" placeholder="e.g. Main Web" class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200 text-xs"></div><div class="md:col-span-2 flex items-center justify-between gap-2"><div class="flex items-center gap-1.5"><label class="flex items-center gap-1 text-[11px] text-slate-400"><input${ssrIncludeBooleanAttr(Array.isArray(link.isEmail) ? ssrLooseContain(link.isEmail, null) : link.isEmail) ? " checked" : ""} type="checkbox" class="rounded bg-slate-800"><span>Email</span></label></div><button class="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30" title="Remove link"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div><div class="md:col-span-12"><input${ssrRenderAttr("value", link.description)} type="text" placeholder="Description of the subdomain or mailbox" class="w-full px-2.5 py-1 bg-facility-950 border border-slate-800/80 rounded text-slate-400 text-[11px]"></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "www") {
        _push(`<section class="space-y-8"><div class="admin-card p-6 rounded-2xl space-y-4"><div class="flex items-center justify-between"><h3 class="text-base font-display font-bold text-white uppercase tracking-wider"> Live Facility Alert System </h3><label class="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300"><input${ssrIncludeBooleanAttr(Array.isArray(wwwData.value.bannerAlert.enabled) ? ssrLooseContain(wwwData.value.bannerAlert.enabled, null) : wwwData.value.bannerAlert.enabled) ? " checked" : ""} type="checkbox" class="rounded bg-slate-800 border-slate-700 text-rose-500"><span>Banner Enabled</span></label></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs"><div><label class="block text-slate-400 mb-1">DEFCON / Alert Level</label><select class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 font-bold"><option value="NOMINAL"${ssrIncludeBooleanAttr(Array.isArray(wwwData.value.bannerAlert.level) ? ssrLooseContain(wwwData.value.bannerAlert.level, "NOMINAL") : ssrLooseEqual(wwwData.value.bannerAlert.level, "NOMINAL")) ? " selected" : ""}>NOMINAL (Green/Cyan)</option><option value="DEFCON 3"${ssrIncludeBooleanAttr(Array.isArray(wwwData.value.bannerAlert.level) ? ssrLooseContain(wwwData.value.bannerAlert.level, "DEFCON 3") : ssrLooseEqual(wwwData.value.bannerAlert.level, "DEFCON 3")) ? " selected" : ""}>DEFCON 3 (Elevated)</option><option value="DEFCON 2"${ssrIncludeBooleanAttr(Array.isArray(wwwData.value.bannerAlert.level) ? ssrLooseContain(wwwData.value.bannerAlert.level, "DEFCON 2") : ssrLooseEqual(wwwData.value.bannerAlert.level, "DEFCON 2")) ? " selected" : ""}>DEFCON 2 (Amber / Breach)</option><option value="LEVEL 5 EMERGENCY"${ssrIncludeBooleanAttr(Array.isArray(wwwData.value.bannerAlert.level) ? ssrLooseContain(wwwData.value.bannerAlert.level, "LEVEL 5 EMERGENCY") : ssrLooseEqual(wwwData.value.bannerAlert.level, "LEVEL 5 EMERGENCY")) ? " selected" : ""}>LEVEL 5 EMERGENCY (Red Meltdown)</option></select></div><div class="md:col-span-3"><label class="block text-slate-400 mb-1">Alert Broadcast Message</label><input${ssrRenderAttr("value", wwwData.value.bannerAlert.message)} type="text" class="w-full px-3 py-2 bg-facility-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400"></div></div></div><div class="space-y-4"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h3 class="text-lg font-display font-bold text-white uppercase tracking-wider"> Roles &amp; Personnel Configuration (${ssrInterpolate(wwwData.value.roles.length)} Roles) </h3><p class="text-xs text-slate-400 font-mono">Edit loadouts, keycards, Robux pricing, and duties</p></div><button class="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold"> + Add New Role </button></div><div class="space-y-3"><!--[-->`);
        ssrRenderList(wwwData.value.roles, (role, rIdx) => {
          _push(`<div class="admin-card p-4 rounded-xl space-y-3 font-mono text-xs"><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-center"><div><label class="block text-[10px] text-slate-500 mb-0.5">ROLE NAME</label><input${ssrRenderAttr("value", role.name)} type="text" class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-white font-bold"></div><div><label class="block text-[10px] text-slate-500 mb-0.5">DEPARTMENT</label><select class="w-full px-2 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"><option value="Executive"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Executive") : ssrLooseEqual(role.category, "Executive")) ? " selected" : ""}>Executive</option><option value="Government"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Government") : ssrLooseEqual(role.category, "Government")) ? " selected" : ""}>Government</option><option value="Scientist"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Scientist") : ssrLooseEqual(role.category, "Scientist")) ? " selected" : ""}>Scientist</option><option value="Military"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Military") : ssrLooseEqual(role.category, "Military")) ? " selected" : ""}>Military</option><option value="Security"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Security") : ssrLooseEqual(role.category, "Security")) ? " selected" : ""}>Security</option><option value="Safety"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Safety") : ssrLooseEqual(role.category, "Safety")) ? " selected" : ""}>Safety</option><option value="Logistics"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Logistics") : ssrLooseEqual(role.category, "Logistics")) ? " selected" : ""}>Logistics</option><option value="Rebellion"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Rebellion") : ssrLooseEqual(role.category, "Rebellion")) ? " selected" : ""}>Rebellion</option><option value="Neutral"${ssrIncludeBooleanAttr(Array.isArray(role.category) ? ssrLooseContain(role.category, "Neutral") : ssrLooseEqual(role.category, "Neutral")) ? " selected" : ""}>Neutral</option></select></div><div><label class="block text-[10px] text-slate-500 mb-0.5">SIDE</label><select class="w-full px-2 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"><option value="Facility"${ssrIncludeBooleanAttr(Array.isArray(role.side) ? ssrLooseContain(role.side, "Facility") : ssrLooseEqual(role.side, "Facility")) ? " selected" : ""}>Facility</option><option value="Rebellion"${ssrIncludeBooleanAttr(Array.isArray(role.side) ? ssrLooseContain(role.side, "Rebellion") : ssrLooseEqual(role.side, "Rebellion")) ? " selected" : ""}>Rebellion</option><option value="Neutral"${ssrIncludeBooleanAttr(Array.isArray(role.side) ? ssrLooseContain(role.side, "Neutral") : ssrLooseEqual(role.side, "Neutral")) ? " selected" : ""}>Neutral</option></select></div><div><label class="block text-[10px] text-slate-500 mb-0.5">CLEARANCE</label><input${ssrRenderAttr("value", role.clearanceLevel)} type="text" class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"></div><div><label class="block text-[10px] text-slate-500 mb-0.5">PRICE (ROBUX)</label><input${ssrRenderAttr("value", role.costRobux)} type="number" placeholder="0 (Free)" class="w-full px-2.5 py-1.5 bg-facility-950 border border-slate-800 rounded text-slate-200"></div><div class="flex items-center justify-end gap-2 pt-3"><label class="flex items-center gap-1 text-[11px] text-amber-300"><input${ssrIncludeBooleanAttr(Array.isArray(role.hasLaunchKeycard) ? ssrLooseContain(role.hasLaunchKeycard, null) : role.hasLaunchKeycard) ? " checked" : ""} type="checkbox" class="rounded bg-slate-800"><span>Launch Card</span></label><button class="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30" title="Delete role"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div><label class="block text-[10px] text-slate-500 mb-0.5">PURPOSE</label><input${ssrRenderAttr("value", role.purpose)} type="text" class="w-full px-2.5 py-1 bg-facility-950 border border-slate-800 rounded text-slate-300 text-[11px]"></div><div><label class="block text-[10px] text-slate-500 mb-0.5">SPAWN LOCATION</label><input${ssrRenderAttr("value", role.spawnLocation)} type="text" class="w-full px-2.5 py-1 bg-facility-950 border border-slate-800 rounded text-slate-300 text-[11px]"></div></div></div>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "redis") {
        _push(`<section class="space-y-6 font-mono text-xs"><div class="admin-card p-6 rounded-2xl space-y-4"><div class="flex items-center justify-between"><div><h3 class="text-base font-display font-bold text-white uppercase tracking-wider"> Raw Redis Datastore </h3><p class="text-xs text-slate-400">Directly inspect and mutate raw JSON objects stored under Redis keys</p></div><div class="flex items-center gap-2"><button class="px-3 py-1.5 rounded-lg bg-facility-800 hover:bg-facility-700 text-slate-300 border border-slate-700"> Reload JSON </button><button class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"> Apply &amp; Save JSON </button></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-slate-400 font-bold mb-1">KEY: nbtf:index:data</label><textarea rows="18" class="w-full p-3 bg-facility-950 border border-slate-800 rounded-xl text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-amber-400">${ssrInterpolate(rawIndexJson.value)}</textarea></div><div><label class="block text-slate-400 font-bold mb-1">KEY: nbtf:www:data</label><textarea rows="18" class="w-full p-3 bg-facility-950 border border-slate-800 rounded-xl text-rose-300 font-mono text-[11px] focus:outline-none focus:border-amber-400">${ssrInterpolate(rawWwwJson.value)}</textarea></div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main><footer class="border-t border-slate-800 bg-facility-950 py-6"><div class="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500"><div> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} NBTF.CA Administrative Gateway. </div><div class="flex items-center gap-4"><a href="https://index.nbtf.ca" target="_blank" class="hover:text-amber-400 transition-colors">Directory Portal</a><span class="text-slate-700">\u2022</span><a href="https://web.nbtf.ca" target="_blank" class="hover:text-amber-400 transition-colors">Game Reference</a></div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DxQQd_lN.mjs.map
