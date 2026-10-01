import { h as useRuntimeConfig } from './nitro.mjs';
import { Redis } from '@upstash/redis';
import Redis$1 from 'ioredis';

const defaultDirectoryData = {
  siteTitle: "NBTF.CA Domain Directory",
  siteTagline: "Official subdomain directory, network routing, and contact endpoints for nbtf.ca",
  disclaimer: "\u26A0 NBTF.CA is a second-level domain owned by cbx.nz \u2014 it may or may not be directly affiliated with NBTF or its developer.",
  maintainerNotice: "NBTF.ca is connected via Cloudflare, domain owned by cbx.nz (maintainer of cbx.kiwi).",
  bannerAnnouncement: {
    enabled: true,
    text: "Operational Network Status: Normal. Official subdomains and routing endpoints active.",
    type: "info",
    link: "https://www.nbtf.ca"
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
          description: "The official master reference and operations dossier for Nuclear Blast Testing Facility",
          url: "https://www.nbtf.ca",
          displayUrl: "www.nbtf.ca",
          badge: "Main Web",
          status: "online",
          icon: "Globe"
        },
        {
          id: "dir-3",
          title: "NBTF.CA (Vite React Alternative)",
          description: "Alternative fast client homepage for nbtf.ca website using Vite React",
          url: "https://nbtf.ca",
          displayUrl: "nbtf.ca",
          badge: "Vite React",
          status: "online",
          icon: "Atom"
        },
        {
          id: "dir-4",
          title: "NBTF Official Discord",
          description: "The official Discord server for NBTF factions, community discussions, and game announcements",
          url: "https://discord.gg/nbtf",
          displayUrl: "discord.gg/nbtf",
          badge: "Official Discord",
          status: "online",
          icon: "MessageSquare"
        },
        {
          id: "dir-5",
          title: "Nuclear Blast App",
          description: "The dedicated web companion app for NBTF (Coming Soon)",
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
      description: "Community faction websites (Official factions are hosted on the NBTF Discord: discord.gg/nbtf)",
      links: [
        {
          id: "fac-1",
          title: "just another faction",
          description: "Website for just another faction (JAF)",
          url: "https://jaf.nbtf.ca",
          displayUrl: "jaf.nbtf.ca",
          badge: "Faction Web",
          status: "online",
          icon: "Flag"
        },
        {
          id: "fac-2",
          title: "Military Training Department",
          description: "The website for Military Training Department (MTD) faction",
          url: "https://mtd.nbtf.ca",
          displayUrl: "mtd.nbtf.ca",
          badge: "Faction Web",
          status: "online",
          icon: "Crosshair"
        }
      ]
    },
    {
      id: "public-emails",
      name: "Public Emails",
      description: "Mailboxes, contact endpoints, and legal communication channels",
      links: [
        {
          id: "mail-1",
          title: "Official: Admin Contact",
          description: "Contact email for the NBTF.CA domain administrator",
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
          description: "Contact email for just another faction",
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
          description: "Contact email for Channel 6 News faction",
          url: "mailto:c6n@factions.nbtf.ca",
          displayUrl: "c6n@factions.nbtf.ca",
          badge: "Faction Mail",
          isEmail: true,
          status: "online",
          icon: "Radio"
        },
        {
          id: "mail-4",
          title: "Official: Legal Contact",
          description: "Legal inquiries and domain issues (cbx.kiwi)",
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
  siteTagline: "Official gameplay dossier, 28-role guide, reactor mechanics, and official lore for NBTF on Roblox",
  heroDescription: "A secret nuclear testing facility operates a powerful fusion reactor and conducts nuclear tests while military, security, government, and scientific personnel keep the facility operational. A rebel organisation attempts to infiltrate the facility, sabotage systems, and trigger a catastrophic core explosion.",
  robloxExperienceUrl: "https://www.roblox.com/games/6153709/Nuclear-Blast-Testing-Facility",
  discordUrl: "https://discord.gg/nbtf",
  stats: {
    visits: "41.7M+",
    positiveRating: "88%+",
    dailyPlayers: "400+",
    totalRoles: 28,
    creator: "Ryanblaze",
    corporation: "Pyrowh Corporation",
    securityContractor: "Nevlar Arms"
  },
  bannerAlert: {
    enabled: true,
    level: "NOMINAL",
    message: "REACTOR CORE STABILITY: 99.8% \u2014 ALL PROTOCOLS ENFORCED. FACILITY AT STANDARD READINESS."
  },
  officialLore: {
    developerNotice: "These are facts/statements about the NBTF universe that the developer/creator, Ryanblaze, has determined are accurate to the setting he wishes to create. You may ignore or contravene these statements, but these are the 'main points' of the NBTF universe, to help you out when making your own lore about the game!",
    creator: "Ryanblaze",
    facts: [
      {
        id: "fact-1",
        title: "Site Location",
        statement: "NBTF is located in Nevada, slightly north of the Extraterrestrial Highway."
      },
      {
        id: "fact-2",
        title: "Pyrowh Corporation",
        statement: "The Pyrowh Corporation was founded in 1955."
      },
      {
        id: "fact-3",
        title: "Nevlar Arms",
        statement: "Nevlar Arms provides security for the site, and funds the rebels that attack it."
      },
      {
        id: "fact-4",
        title: "Facility Secrecy",
        statement: "The NBTF site is secret and inaccessible to most."
      },
      {
        id: "fact-5",
        title: "Time Period",
        statement: "The NBTF game is set in the present day."
      }
    ],
    discordInfo: {
      text: "Factions and community lore are found and organized in the official Discord server.",
      url: "https://discord.gg/nbtf",
      displayUrl: "discord.gg/nbtf"
    }
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
      equipment: ["Launch Keycard", "Executive ID", "Special Weapons Chamber Access", "Executive Vehicle"]
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
      equipment: ["Level 6 Keycard", "Launch Keycard", "Director APC", "Director Sedan", "Executive Broadcast Dashboard"]
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
      equipment: ["Level 4 Keycard", "Government Sedan", "Government SUV"]
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
        "Identify and neutralize hostile covert assets"
      ],
      equipment: ["Level 4 Keycard", "Covert Scanner", "Tactical Radio"]
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
      equipment: ["Level 3 Keycard", "Launch Keycard", "Hazmat Suit", "Core Diagnostic Tool"]
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
      equipment: ["M4 Carbine", "USP Pistol", "Level 3 Keycard", "Flashlight", "Radio", "Infantry Jeep"]
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
        "Command military forces during base defense",
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
      equipment: ["Level 4 Keycard", "Heavy Tactical Armor", "Advanced Rifle", "STF Tactical SUV"]
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
      equipment: ["Rebel Keycard", "Heavy Assault Rifle", "Combat Armor", "Explosives"]
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
        "Eliminate designated high-value targets",
        "Conduct clandestine infiltration strikes",
        "Operate independently under bounty contracts"
      ],
      equipment: ["Rebel Keycard", "Silenced Sniper / Pistol", "Infiltration Cloak"]
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
      equipment: ["Rebel Master Card", "Rebel Command Terminal", "Tactical Map"]
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
      equipment: ["Rebel Keycard", "Command Radio", "Assault Loadout"]
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
      equipment: ["AK-47 / SMG", "Rebel Keycard", "Flashlight"]
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
        "Access terminals and obtain override code fragments",
        "Sabotage systems from deep within without detection"
      ],
      equipment: ["Disguise Kit", "Hacking Decryption Tool", "Silenced Sidearm"]
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
      purpose: "Supreme military commander of the rebellion.",
      responsibilities: [
        "Lead all rebellion armed forces in organized assaults",
        "Formulate grand strategic raid operations",
        "Authorize full-scale reactor core sabotage operations"
      ],
      equipment: ["Warlord Heavy Armor", "Warlord Custom Weaponry", "Rebel Master Key"]
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
        "Survive ongoing clashes between facility forces and rebels",
        "Choose whether to cooperate or remain neutral"
      ],
      equipment: ["Civilian Clothes", "Flashlight"]
    }
  ],
  locations: [
    {
      id: "egc-core",
      name: "Energy Generation Center (EGC) & Reactor Core",
      category: "Science & Reactor",
      clearanceRequired: "Level 3 (Level 4+ for Control Room)",
      description: "The central installation of NBTF. Houses the fusion reactor core, coolant injection pipelines, and safety override panels.",
      associatedRoles: ["Core Engineer", "Facility Director", "Rebels"],
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
      name: "Rebel Base & Hidden Cave",
      category: "Exterior",
      clearanceRequired: "Rebel Card",
      description: "Fortified rebel bunker hidden in the surrounding badlands where raids are planned and weapons stockpiled.",
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
    { name: "Overseer", role: "Rebel Intelligence Head", robux: 3e3, description: "Rebel strategic mastermind directing sabotage intelligence." },
    { name: "Facility Director", role: "Supreme Facility Head", robux: 3400, description: "Highest operational facility authority with Level 6 clearance." }
  ]
};

const REDIS_INDEX_KEY = "nbtf:index:data";
const REDIS_WWW_KEY = "nbtf:www:data";
const REDIS_AUDIT_LOGS_KEY = "nbtf:admin:logs";
let ioredisClient = null;
let upstashClient = null;
let memoryIndexData = JSON.parse(JSON.stringify(defaultDirectoryData));
let memoryWwwData = JSON.parse(JSON.stringify(defaultWwwData));
let memoryAuditLogs = [
  {
    id: "log-init",
    action: "System Initialized",
    target: "system",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user: "SYSTEM",
    details: "Initial master configuration loaded"
  }
];
function getRedisClient() {
  const config = useRuntimeConfig();
  const upstashUrl = config.upstashRedisRestUrl || process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = config.upstashRedisRestToken || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    if (!upstashClient) {
      upstashClient = new Redis({
        url: upstashUrl,
        token: upstashToken
      });
    }
    return { type: "upstash", client: upstashClient };
  }
  const redisUrl = config.redisUrl || process.env.REDIS_URL;
  if (redisUrl) {
    if (!ioredisClient) {
      ioredisClient = new Redis$1(redisUrl, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        lazyConnect: true
      });
    }
    return { type: "ioredis", client: ioredisClient };
  }
  return { type: "memory", client: null };
}
async function getDirectoryData() {
  try {
    const redis = getRedisClient();
    if (redis.type === "upstash" && redis.client) {
      const data = await redis.client.get(REDIS_INDEX_KEY);
      if (data) return typeof data === "string" ? JSON.parse(data) : data;
    } else if (redis.type === "ioredis" && redis.client) {
      const raw = await redis.client.get(REDIS_INDEX_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Admin Redis] Failed to get index data from Redis, using memory cache:", err);
  }
  return memoryIndexData;
}
async function setDirectoryData(data, user = "admin") {
  try {
    data.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    memoryIndexData = data;
    const redis = getRedisClient();
    if (redis.type === "upstash" && redis.client) {
      await redis.client.set(REDIS_INDEX_KEY, JSON.stringify(data));
    } else if (redis.type === "ioredis" && redis.client) {
      await redis.client.set(REDIS_INDEX_KEY, JSON.stringify(data));
    }
    await addAuditLog({
      id: "log-" + Date.now(),
      action: "Updated Directory Data",
      target: "index",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user,
      details: `Updated ${data.categories.length} categories with total ${data.categories.reduce((a, c) => a + c.links.length, 0)} endpoints`
    });
    return true;
  } catch (err) {
    console.error("[Admin Redis] Error saving index data:", err);
    return false;
  }
}
async function getWwwData() {
  try {
    const redis = getRedisClient();
    if (redis.type === "upstash" && redis.client) {
      const data = await redis.client.get(REDIS_WWW_KEY);
      if (data) return typeof data === "string" ? JSON.parse(data) : data;
    } else if (redis.type === "ioredis" && redis.client) {
      const raw = await redis.client.get(REDIS_WWW_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Admin Redis] Failed to get WWW data from Redis, using memory cache:", err);
  }
  return memoryWwwData;
}
async function setWwwData(data, user = "admin") {
  var _a;
  try {
    data.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    memoryWwwData = data;
    const redis = getRedisClient();
    if (redis.type === "upstash" && redis.client) {
      await redis.client.set(REDIS_WWW_KEY, JSON.stringify(data));
    } else if (redis.type === "ioredis" && redis.client) {
      await redis.client.set(REDIS_WWW_KEY, JSON.stringify(data));
    }
    await addAuditLog({
      id: "log-" + Date.now(),
      action: "Updated Game Reference & WWW Data",
      target: "www",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user,
      details: `Updated ${data.roles.length} roles, ${data.locations.length} locations. Alert: ${(_a = data.bannerAlert) == null ? void 0 : _a.level}`
    });
    return true;
  } catch (err) {
    console.error("[Admin Redis] Error saving WWW data:", err);
    return false;
  }
}
async function getAuditLogs() {
  try {
    const redis = getRedisClient();
    if (redis.type === "upstash" && redis.client) {
      const logs = await redis.client.get(REDIS_AUDIT_LOGS_KEY);
      if (logs) return typeof logs === "string" ? JSON.parse(logs) : logs;
    } else if (redis.type === "ioredis" && redis.client) {
      const raw = await redis.client.get(REDIS_AUDIT_LOGS_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Admin Redis] Failed to get audit logs from Redis:", err);
  }
  return memoryAuditLogs;
}
async function addAuditLog(entry) {
  try {
    memoryAuditLogs.unshift(entry);
    if (memoryAuditLogs.length > 50) memoryAuditLogs = memoryAuditLogs.slice(0, 50);
    const redis = getRedisClient();
    if (redis.type === "upstash" && redis.client) {
      await redis.client.set(REDIS_AUDIT_LOGS_KEY, JSON.stringify(memoryAuditLogs));
    } else if (redis.type === "ioredis" && redis.client) {
      await redis.client.set(REDIS_AUDIT_LOGS_KEY, JSON.stringify(memoryAuditLogs));
    }
  } catch (err) {
    console.warn("[Admin Redis] Failed to save audit log entry:", err);
  }
}
async function resetAllToDefaults(user = "admin") {
  const indexOk = await setDirectoryData(JSON.parse(JSON.stringify(defaultDirectoryData)), user);
  const wwwOk = await setWwwData(JSON.parse(JSON.stringify(defaultWwwData)), user);
  await addAuditLog({
    id: "log-" + Date.now(),
    action: "Reset System to Master Defaults",
    target: "system",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user,
    details: "All index directory and game data reverted to master source"
  });
  return indexOk && wwwOk;
}

export { addAuditLog as a, getRedisClient as b, getDirectoryData as c, getWwwData as d, setWwwData as e, getAuditLogs as g, resetAllToDefaults as r, setDirectoryData as s };
//# sourceMappingURL=adminRedis.mjs.map
