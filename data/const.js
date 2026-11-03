export const KATEGORIER = [
    "Træ",
    "Gips",
    "Fliser",
    "Isolering",
    "Mursten og beton",
    "Metal",
    "Vinduer og døre",
    "Tagmaterialer",
    "VVS og sanitet",
    "El",
    "Maling og kemi",
    "Gulv",
    "Have og anlæg",
    "Værktøj",
    "Andet",
];

export const KATEGORI_IKONER = {
    "Træ": "pine-tree",
    "Gips": "layers-triple",
    "Fliser": "checkerboard",
    "Isolering": "snowflake",
    "Mursten og beton": "wall",
    "Metal": "anvil",
    "Vinduer og døre": "window-closed-variant",
    "Tagmaterialer": "home-roof",
    "VVS og sanitet": "pipe-wrench",
    "El": "lightning-bolt",
    "Maling og kemi": "format-paint",
    "Gulv": "floor-plan",
    "Have og anlæg": "flower",
    "Værktøj": "hammer-wrench",
    "Andet": "dots-horizontal-circle-outline",
};

export const MATERIALE_DETALJER = {
    "Træ": {
        underkategorier: [
            "Konstruktionstræ",
            "Høvlet træ",
            "Lægter og forskalling",
            "Brædder og planker",
            "Terrassebrædder",
            "Facadebeklædning",
            "Krydsfiner",
            "OSB-plader",
            "MDF og spånplader",
            "Limtræ",
            "Stolper og rundtræ",
        ],
        egenskaber: [
            {
                noegle: "traesort",
                label: "Træsort",
                valg: ["Fyr", "Gran", "Lærk", "Douglas", "Eg", "Bøg", "Ask", "Cedertræ", "Thermotræ", "Hårdttræ", "Andet"],
            },
            {
                noegle: "styrkeklasse",
                label: "Styrkeklasse",
                valg: ["C14", "C18", "C24", "C30", "GL24 (limtræ)", "GL30 (limtræ)", "Ukendt"],
            },
            {
                noegle: "behandling",
                label: "Behandling",
                valg: [
                    "Ubehandlet",
                    "Trykimprægneret NTR A",
                    "Trykimprægneret NTR AB",
                    "Grundmalet",
                    "Færdigmalet",
                    "Olieret",
                    "Brandimprægneret",
                ],
            },
            {
                noegle: "overflade",
                label: "Overflade",
                valg: ["Savskåret", "Høvlet", "Høvlet med runde kanter", "Rillet", "Børstet"],
            },
        ],
    },
    "Gips": {
        underkategorier: ["Gipsplader", "Gipsfiberplader", "Loftplader", "Stålskinner og -reglar", "Spartel og tape"],
        egenskaber: [
            {
                noegle: "pladetype",
                label: "Pladetype",
                valg: ["Standard (A)", "Vådrum (H)", "Brand (F)", "Robust/hård (DI)", "Akustik", "Lydplade"],
            },
            {
                noegle: "tykkelse",
                label: "Tykkelse",
                valg: ["6,5 mm", "9,5 mm", "12,5 mm", "15 mm", "18 mm", "25 mm"],
            },
            {
                noegle: "kant",
                label: "Kant",
                valg: ["Forsænket kant (AK)", "Lige kant", "Fasede kanter", "Halvrund kant"],
            },
            {
                noegle: "pladeformat",
                label: "Pladeformat",
                valg: ["900 x 2400 mm", "900 x 2700 mm", "1200 x 2400 mm", "1200 x 2700 mm", "1200 x 3000 mm", "Andet"],
            },
        ],
    },
    "Fliser": {
        underkategorier: ["Gulvfliser", "Vægfliser", "Mosaik", "Klinker", "Udendørsfliser", "Natursten", "Fliselim og fuge"],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Porcelæn", "Keramik", "Klinker", "Marmor", "Granit", "Skifer", "Kalksten", "Terrazzo", "Glas"],
            },
            {
                noegle: "format",
                label: "Format (cm)",
                valg: ["10 x 10", "15 x 15", "20 x 20", "30 x 30", "30 x 60", "60 x 60", "60 x 120", "120 x 120", "Andet"],
            },
            {
                noegle: "overflade",
                label: "Overflade",
                valg: ["Mat", "Halvmat", "Blank/poleret", "Struktur", "Skridsikker R10", "Skridsikker R11"],
            },
            {
                noegle: "farve",
                label: "Farve",
                valg: ["Hvid", "Grå", "Antracit", "Sort", "Beige", "Brun", "Terracotta", "Grøn", "Blå", "Flerfarvet"],
            },
        ],
    },
    "Isolering": {
        underkategorier: [
            "Glasuld",
            "Stenuld",
            "EPS (flamingo)",
            "XPS",
            "PIR/PUR-plader",
            "Træfiber",
            "Papiruld",
            "Dampspærre og tape",
            "Fugeskum",
        ],
        egenskaber: [
            {
                noegle: "form",
                label: "Form",
                valg: ["Batts", "Ruller/måtter", "Plader", "Granulat/løsfyld"],
            },
            {
                noegle: "tykkelse",
                label: "Tykkelse",
                valg: ["45 mm", "50 mm", "70 mm", "95 mm", "100 mm", "120 mm", "145 mm", "150 mm", "195 mm", "200 mm", "245 mm", "300 mm"],
            },
            {
                noegle: "lambda",
                label: "Lambdaværdi",
                valg: ["22 (PIR)", "31", "32", "33", "34", "35", "37", "39", "Ukendt"],
            },
            {
                noegle: "anvendelse",
                label: "Anvendelse",
                valg: ["Væg", "Loft", "Gulv", "Tag", "Fundament/sokkel", "Lydisolering"],
            },
        ],
    },
    "Mursten og beton": {
        underkategorier: [
            "Mursten",
            "Gasbetonblokke",
            "Letbetonblokke",
            "Betonsten og belægning",
            "Kantsten",
            "Cement og mørtel",
            "Færdigbeton",
            "Armering",
            "Leca-nødder",
        ],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Tegl", "Kalksandsten", "Gasbeton", "Letbeton", "Beton", "Natursten"],
            },
            {
                noegle: "farve",
                label: "Farve",
                valg: ["Rød", "Blødstrøgen rød", "Gul", "Brun", "Grå", "Hvid", "Sort", "Flammet"],
            },
            {
                noegle: "type",
                label: "Type",
                valg: ["Massiv", "Hulsten", "Blødstrøgen", "Maskinsten", "Genbrugssten (renset)", "Genbrugssten (urenset)"],
            },
            {
                noegle: "format",
                label: "Format",
                valg: ["Normalformat 228x108x54", "Blok 600x200", "Blok 600x100", "Andet"],
            },
        ],
    },
    "Metal": {
        underkategorier: [
            "Stålbjælker",
            "Rør og hulprofiler",
            "Plader",
            "Fladjern og vinkeljern",
            "Armeringsjern",
            "Beslag",
            "Skruer, bolte og søm",
            "Aluminiumsprofiler",
            "Kobber og zink",
        ],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Sort stål", "Galvaniseret stål", "Rustfrit stål A2", "Rustfrit stål A4", "Aluminium", "Kobber", "Zink", "Messing", "Cortenstål"],
            },
            {
                noegle: "profil",
                label: "Profil",
                valg: ["IPE", "HEA", "HEB", "UNP", "L-profil", "Firkantrør", "Rundrør", "Fladstål", "Plade"],
            },
            {
                noegle: "overflade",
                label: "Overflade",
                valg: ["Ubehandlet", "Varmforzinket", "Elforzinket", "Pulverlakeret", "Malet", "Børstet"],
            },
        ],
    },
    "Vinduer og døre": {
        underkategorier: [
            "Vinduer",
            "Ovenlysvinduer",
            "Yderdøre",
            "Indvendige døre",
            "Terrassedøre",
            "Skydedøre",
            "Garageporte",
            "Karme og indfatninger",
            "Greb og beslag",
        ],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Træ", "Træ/alu", "Plast (PVC)", "Aluminium", "Stål", "Glas"],
            },
            {
                noegle: "glas",
                label: "Glas",
                valg: ["1-lags", "2-lags termorude", "3-lags energirude", "Lydrude", "Sikkerhedsglas", "Uden glas"],
            },
            {
                noegle: "aabning",
                label: "Åbning",
                valg: ["Fast", "Sidehængt", "Tophængt", "Kip/drej", "Vendevindue", "Skydeparti"],
            },
            {
                noegle: "haengsling",
                label: "Hængsling",
                valg: ["Venstre", "Højre", "Dobbelt", "Ikke relevant"],
            },
            {
                noegle: "farve",
                label: "Farve",
                valg: ["Hvid", "Sort", "Antracitgrå", "Natur/træ", "Anden"],
            },
            {
                noegle: "energiklasse",
                label: "Energiklasse",
                valg: ["A", "B", "C", "Ukendt"],
            },
        ],
    },
    "Tagmaterialer": {
        underkategorier: [
            "Tegltagsten",
            "Betontagsten",
            "Tagpap",
            "Ståltagplader",
            "Fibercementplader",
            "Skifer",
            "Tagrender og nedløb",
            "Undertag",
            "Inddækning",
            "Ovenlys og lysplader",
        ],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Tegl", "Beton", "Stål", "Fibercement", "Bitumen", "Skifer", "Zink", "PVC", "Polycarbonat"],
            },
            {
                noegle: "profil",
                label: "Profil",
                valg: ["Vingetegl", "Dobbelt-S", "Bølgeprofil", "Trapezprofil", "Plan", "Ikke relevant"],
            },
            {
                noegle: "farve",
                label: "Farve",
                valg: ["Rød", "Sort", "Sort glaseret", "Grå", "Brun", "Natur", "Anden"],
            },
        ],
    },
    "VVS og sanitet": {
        underkategorier: [
            "Toiletter",
            "Håndvaske",
            "Køkkenvaske",
            "Armaturer",
            "Bruseløsninger",
            "Badekar",
            "Rør og fittings",
            "Radiatorer",
            "Gulvvarme",
            "Varmtvandsbeholdere",
            "Afløb og kloak",
        ],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Porcelæn", "Rustfrit stål", "Kobber", "PEX", "PP/PVC", "Messing", "Støbejern", "Akryl"],
            },
            {
                noegle: "montering",
                label: "Montering",
                valg: ["Gulvstående", "Væghængt", "Indbygget", "Bordmonteret", "Ikke relevant"],
            },
            {
                noegle: "dimension",
                label: "Rørdimension",
                valg: ["Ø15", "Ø18", "Ø22", "Ø28", "Ø32", "Ø40", "Ø50", "Ø75", "Ø110", "Ikke relevant"],
            },
            {
                noegle: "farve",
                label: "Farve/finish",
                valg: ["Hvid", "Krom", "Sort mat", "Børstet stål", "Messing", "Anden"],
            },
        ],
    },
    "El": {
        underkategorier: [
            "Kabler og ledninger",
            "Stikkontakter og afbrydere",
            "Belysning",
            "Spots",
            "Eltavler og automatsikringer",
            "Elrør og kabelbakker",
            "Solceller",
            "Ladestandere",
        ],
        egenskaber: [
            {
                noegle: "kabeltype",
                label: "Kabeltype",
                valg: ["PVIK installationskabel", "Jordkabel", "Fleksibel ledning", "Datakabel", "Ikke relevant"],
            },
            {
                noegle: "tvaersnit",
                label: "Tværsnit",
                valg: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²", "10 mm²", "16 mm²", "Ikke relevant"],
            },
            {
                noegle: "spaending",
                label: "Spænding",
                valg: ["230 V", "400 V", "12/24 V lavvolt"],
            },
            {
                noegle: "ipklasse",
                label: "IP-klasse",
                valg: ["IP20", "IP44", "IP54", "IP65", "IP67"],
            },
        ],
    },
    "Maling og kemi": {
        underkategorier: [
            "Vægmaling",
            "Loftmaling",
            "Træmaling og lasur",
            "Gulvmaling",
            "Grunder",
            "Lak og olie",
            "Spartelmasse",
            "Fugemasse og silikone",
            "Lim",
            "Vådrumsmembran",
        ],
        egenskaber: [
            {
                noegle: "glans",
                label: "Glansgrad",
                valg: ["Glans 2-5 (helmat)", "Glans 10", "Glans 25", "Glans 40", "Glans 60", "Glans 80+", "Ikke relevant"],
            },
            {
                noegle: "basis",
                label: "Basis",
                valg: ["Vandbaseret", "Alkyd/oliebaseret", "Epoxy", "Akryl", "Silikone", "MS-polymer"],
            },
            {
                noegle: "anvendelse",
                label: "Anvendelse",
                valg: ["Indendørs", "Udendørs", "Vådrum"],
            },
            {
                noegle: "emballage",
                label: "Emballage",
                valg: ["Uåbnet", "Åbnet - næsten fuld", "Åbnet - halvfuld"],
            },
        ],
    },
    "Gulv": {
        underkategorier: [
            "Massivt trægulv",
            "Lamelparket",
            "Laminat",
            "Klikvinyl",
            "Linoleum",
            "Gulvtæpper",
            "Plankegulv",
            "Fodlister",
            "Gulvunderlag",
        ],
        egenskaber: [
            {
                noegle: "traesort",
                label: "Træsort",
                valg: ["Eg", "Ask", "Bøg", "Fyr", "Valnød", "Bambus", "Ikke træ"],
            },
            {
                noegle: "overflade",
                label: "Overflade",
                valg: ["Ubehandlet", "Lakeret", "Olieret", "Hvidpigmenteret", "Børstet", "Ikke relevant"],
            },
            {
                noegle: "samling",
                label: "Samling",
                valg: ["Klik", "Not og fer", "Limes", "Løstlagt"],
            },
            {
                noegle: "slidklasse",
                label: "Slidklasse",
                valg: ["AC3", "AC4", "AC5", "Klasse 23/31", "Klasse 33/42", "Ukendt"],
            },
        ],
    },
    "Have og anlæg": {
        underkategorier: [
            "Belægningssten og fliser",
            "Grus, sand og sten",
            "Muld og jord",
            "Hegn og stakit",
            "Plankeværk",
            "Carport og skur",
            "Pergola",
            "Granit og natursten",
            "Drænrør",
            "Højbede",
        ],
        egenskaber: [
            {
                noegle: "materiale",
                label: "Materiale",
                valg: ["Beton", "Granit", "Træ", "Komposit", "Stål", "Natursten", "Grus/sten", "Jord"],
            },
            {
                noegle: "farve",
                label: "Farve",
                valg: ["Grå", "Antracit", "Rød", "Natur", "Sort", "Anden"],
            },
        ],
    },
    "Værktøj": {
        underkategorier: [
            "Elværktøj",
            "Håndværktøj",
            "Måleværktøj",
            "Stiger og stilladser",
            "Trillebøre og transport",
            "Sikkerhedsudstyr",
            "Maskiner",
        ],
        egenskaber: [
            {
                noegle: "maerke",
                label: "Mærke",
                valg: ["Bosch", "Makita", "DeWalt", "Milwaukee", "Festool", "Hilti", "Metabo", "Ryobi", "Andet"],
            },
            {
                noegle: "drift",
                label: "Drift",
                valg: ["Batteri", "Ledning (230 V)", "Trykluft", "Benzin", "Manuel"],
            },
            {
                noegle: "batteri",
                label: "Batteri medfølger",
                valg: ["Ja", "Nej", "Ikke relevant"],
            },
        ],
    },
    "Andet": {
        underkategorier: ["Køkkenelementer", "Bordplader", "Trapper", "Brændeovne", "Byggeaffald til genbrug", "Diverse"],
        egenskaber: [],
    },
};

export const STAND = ["Ny / ubrugt", "Som ny", "Brugt - god stand", "Brugt - med slid", "Til reparation"];
export const ENHEDER = ["stk.", "m", "m²", "m³", "kg", "pakker", "paller", "liter", "sæt", "ruller"];
export const PRIS_TYPER = ["Fast pris", "Til forhandling", "Gratis"];
export const PRIS_PER = ["For det hele", "Pr. enhed"];
export const LEVERING = ["Kun afhentning", "Kan leveres", "Kan sendes"];
export const STATUS = ["Til salg", "Reserveret", "Solgt"];
export const BRUGERTYPER = ["Privat", "Håndværker", "Virksomhed"];

export const SORTERING = ["Nyeste", "Ældste", "Pris: lav til høj", "Pris: høj til lav", "Nærmest"];
export const AFSTANDE = [5, 10, 25, 50, 100, 200];

export const STANDARD_FILTER = {
    soegning: "",
    kategori: "Alle",
    underkategorier: [],
    egenskaber: {},
    stand: [],
    prisMin: "",
    prisMax: "",
    kunGratis: false,
    levering: [],
    saelgerType: [],
    laengdeMin: "",
    breddeMin: "",
    hoejdeMin: "",
    maengdeMin: "",
    kunMedBillede: false,
    visSolgte: false,
    center: null,
    radius: 25,
    sortering: "Nyeste",
};

export const TOMT_OPSLAG = {
    titel: "",
    materiale: "",
    kategori: "",
    underkategori: "",
    egenskaber: {},
    stand: "",
    maengde: "",
    enhed: ENHEDER[0],
    laengde: "",
    bredde: "",
    hoejde: "",
    maerke: "",
    prisType: PRIS_TYPER[0],
    pris: "",
    prisPer: PRIS_PER[0],
    levering: LEVERING[0],
    status: STATUS[0],
    sted: "",
    postnummer: "",
    lokation: null,
    billede: "",
};

export const DANMARK_REGION = {
    latitude: 56.1,
    longitude: 10.6,
    latitudeDelta: 4.2,
    longitudeDelta: 4.8,
};

export const TAB_LABELS = {
    Forside: "Forside",
    Oversigt: "Søg",
    "Opret opslag": "Sælg",
    Beskeder: "Beskeder",
    Profil: "Profil",
};

export const TRIN = [
    { ikon: "camera-outline", titel: "Læg det op", tekst: "Tag et billede, angiv mål og specifikationer, og vælg hvor det kan hentes." },
    { ikon: "chatbubbles-outline", titel: "Aftal handlen", tekst: "Købere finder dit opslag på kortet og skriver direkte til dig i appen." },
    { ikon: "leaf-outline", titel: "Nyt liv", tekst: "Materialerne bliver brugt i stedet for at ende i containeren." },
];

export const HURTIGE_SVAR = ["Hej! Er det stadig til salg?", "Hvornår kan jeg hente det?", "Kan du gå lidt ned i pris?"];
