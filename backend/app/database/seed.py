from sqlalchemy.orm import Session
from app.auth.security import get_password_hash
from app.database.models import (
    User, Student, Parent, Skill, Interest, Strength, Career, CareerSkill,
    Course, CareerCourse, AptitudeQuestion, ParentStudentLink, StudentProfile,
    StudentSkill, StudentInterest, AcademicRecord, StudentStrength, Preference,
    AptitudeResult
)

SKILL_FIRST_CAREER_METADATA = {
    "Web Developer": {
        "is_skill_first": True,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. Tech startups, boutique web agencies, and freelance clients regularly prioritize verified code repositories and live applications over formal degrees.",
        "alternative_pathways": [
            "Entry via freelance client projects & local business websites",
            "Junior Web Integrator or Content Management specialist (WordPress/Shopify)",
            "Distance/Online BCA degree while working in entry-level frontend roles"
        ],
        "learning_roadmap": [
            {
                "step": 1,
                "phase": "Foundation & Core Skills",
                "title": "Master Frontend Web Fundamentals",
                "description": "Learn semantic HTML5, modern CSS3 layout (Flexbox/Grid), and core JavaScript programming basics.",
                "skills": ["HTML5 & CSS3 Responsive Styling", "JavaScript Basics", "Git Version Control"],
                "recommended_timeline": "1-2 Months"
            },
            {
                "step": 2,
                "phase": "Hands-on Practice Projects",
                "title": "Construct Real-World Practice Projects",
                "description": "Build responsive personal portfolio, multi-page business site, and dynamic client app consuming external REST APIs.",
                "projects": [
                    "Responsive Business Landing Page",
                    "Interactive Task / Weather Dashboard using REST APIs",
                    "Mini E-Commerce Product Catalog with Cart"
                ],
                "recommended_timeline": "2 Months"
            },
            {
                "step": 3,
                "phase": "Portfolio Development",
                "title": "Deploy Live Showcase & GitHub Repos",
                "description": "Publish code to public GitHub with clear documentation; deploy live interactive demos on Vercel or Netlify.",
                "deliverables": [
                    "Public GitHub repositories with README and setup guides",
                    "Live deployed web demo URLs",
                    "Video walkthrough of project features"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 4,
                "phase": "Possible Entry Roles",
                "title": "Target Entry & Stepping-Stone Roles",
                "description": "Apply for junior frontend positions, web integration traineeships, and freelance gigs that prioritize demonstrated skill.",
                "roles": ["Junior Frontend Developer", "Web Integrator", "Freelance Web Developer", "UI/UX Technical Assistant"],
                "guidance_note": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            }
        ]
    },
    "IT Support Specialist": {
        "is_skill_first": True,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. Most enterprise helpdesks and IT services hire based on 10th/12th/Diploma plus practical troubleshooting certifications.",
        "alternative_pathways": [
            "Hardware repair shop trainee or field service technician",
            "Remote customer technical support executive",
            "Transition into Network Administrator or Junior Cloud Ops after 1-2 years helpdesk experience"
        ],
        "learning_roadmap": [
            {
                "step": 1,
                "phase": "Foundation & Core Skills",
                "title": "Computer Hardware & Network Fundamentals",
                "description": "Learn desktop assembly, operating systems (Windows/Linux), TCP/IP addressing, and Wi-Fi diagnostics.",
                "skills": ["Network Configuration & Wi-Fi", "Linux Server Administration", "Hardware Diagnostics"],
                "recommended_timeline": "1-2 Months"
            },
            {
                "step": 2,
                "phase": "Hands-on Practice Projects",
                "title": "Homelab Setup & Ticket Simulations",
                "description": "Set up a virtualized homelab, configure a simulated corporate domain, and practice troubleshooting 20+ common helpdesk scenarios.",
                "projects": [
                    "VirtualBox / VMware multi-OS virtual test environment",
                    "Home router LAN segmentation & DHCP/DNS server setup",
                    "Helpdesk ticketing system simulation log"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 3,
                "phase": "Portfolio Development",
                "title": "Certification & Setup Documentation",
                "description": "Document your homelab network topology, create troubleshooting cheatsheets, and aim for foundational credentials (e.g. CompTIA A+ or Google IT Support).",
                "deliverables": [
                    "Network Architecture Diagram of personal homelab",
                    "Technical Troubleshooting KB (Knowledge Base) writeups",
                    "Entry IT Support Certificate"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 4,
                "phase": "Possible Entry Roles",
                "title": "Target Entry Support Roles",
                "description": "Apply for desktop support, remote helpdesk, or field network technician openings across IT service providers.",
                "roles": ["Helpdesk Technician", "Desktop Support Engineer", "Hardware & Network Associate", "Field Service Specialist"],
                "guidance_note": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            }
        ]
    },
    "UI/UX Designer": {
        "is_skill_first": True,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. Design hiring is overwhelmingly portfolio-driven; employers evaluate Figma prototypes and user research case studies.",
        "alternative_pathways": [
            "Start as Visual / Graphic Designer and transition into UI/UX",
            "Freelance landing page redesigns for startup founders",
            "UI design agency apprenticeship"
        ],
        "learning_roadmap": [
            {
                "step": 1,
                "phase": "Foundation & Core Skills",
                "title": "Design Principles & Figma Tooling",
                "description": "Master typography, color harmony, visual hierarchy, user journey mapping, and Figma component libraries.",
                "skills": ["UI/UX Wireframing & Figma", "User Empathy & Research", "Responsive Layouts"],
                "recommended_timeline": "1-2 Months"
            },
            {
                "step": 2,
                "phase": "Hands-on Practice Projects",
                "title": "End-to-End App & Web Redesigns",
                "description": "Conduct user research on an existing confusing app, produce low-fidelity wireframes, and build high-fidelity interactive prototypes.",
                "projects": [
                    "Vocational Student Mobile App UX Redesign",
                    "Healthcare Clinic Appointment Booking Web UI",
                    "Design System with reusable auto-layout components"
                ],
                "recommended_timeline": "2 Months"
            },
            {
                "step": 3,
                "phase": "Portfolio Development",
                "title": "Publish Curated Case Studies",
                "description": "Document your problem-solving rationale in 2-3 detailed case studies on Behance, Notion, or personal portfolio website.",
                "deliverables": [
                    "2 In-depth UX Case Studies detailing problem, user research, wireframes, and solution",
                    "Clickable Figma prototype preview links",
                    "Personal portfolio website showcasing aesthetic sensibility"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 4,
                "phase": "Possible Entry Roles",
                "title": "Target Junior Design Roles",
                "description": "Interview for junior UI designer, interaction design intern, or freelance visual designer opportunities.",
                "roles": ["Junior UI/UX Designer", "Product Design Intern", "Visual Designer", "Figma Design Specialist"],
                "guidance_note": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            }
        ]
    },
    "Graphic Designer": {
        "is_skill_first": True,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. Advertising agencies and brands hire purely based on visual portfolio execution and creative flair.",
        "alternative_pathways": [
            "Local branding and social media creative freelancer",
            "E-commerce product banner design specialist",
            "Progression into motion graphics and video editing"
        ],
        "learning_roadmap": [
            {
                "step": 1,
                "phase": "Foundation & Core Skills",
                "title": "Graphic Design & Creative Tooling",
                "description": "Master visual composition, brand identity concepts, color palettes, and tools like Figma, Illustrator, or Canva Pro.",
                "skills": ["Visual Composition", "Typography", "Branding Basics"],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 2,
                "phase": "Hands-on Practice Projects",
                "title": "Brand Identity Design Packages",
                "description": "Create complete visual identity packages (logo, typography guide, social media kit, packaging mockups) for mock brands.",
                "projects": [
                    "Artisanal Coffee Brand Identity & Packaging",
                    "Eco-Friendly Clothing Line Social Media Ad Campaign",
                    "Event Poster & Digital Brochure Series"
                ],
                "recommended_timeline": "1-2 Months"
            },
            {
                "step": 3,
                "phase": "Portfolio Development",
                "title": "Online Portfolio & Social Presence",
                "description": "Showcase visual work on Behance, Dribbble, and Instagram with high-resolution mockups.",
                "deliverables": [
                    "Behance profile with 3 curated brand identity projects",
                    "Professional PDF visual portfolio deck",
                    "Social media design reel / showcase"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 4,
                "phase": "Possible Entry Roles",
                "title": "Target Creative Design Positions",
                "description": "Apply to marketing agencies, e-commerce brands, and design studios seeking creative visual talent.",
                "roles": ["Graphic Designer", "Creative Content Associate", "Brand Identity Specialist", "Social Media Designer"],
                "guidance_note": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            }
        ]
    },
    "Digital Marketing Specialist": {
        "is_skill_first": True,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. Growth agencies and startups hire based on certified Google/Meta credentials and proven campaign metrics.",
        "alternative_pathways": [
            "Social media manager for local small businesses",
            "Freelance performance marketer on Upwork/Fiverr",
            "Content creator & affiliate marketer"
        ],
        "learning_roadmap": [
            {
                "step": 1,
                "phase": "Foundation & Core Skills",
                "title": "SEO, Paid Ads & Analytics Fundamentals",
                "description": "Learn keyword research, on-page SEO, Meta Ads Manager, Google Search Ads, and Google Analytics 4 (GA4).",
                "skills": ["SEO & Content Strategy", "Social Media & Ad Campaigns", "Data Visualization"],
                "recommended_timeline": "1-2 Months"
            },
            {
                "step": 2,
                "phase": "Hands-on Practice Projects",
                "title": "Run Live Experiments & Campaigns",
                "description": "Build a niche blog or social account, optimize content for search engines, and run small-budget test ad campaigns to measure CTR and conversions.",
                "projects": [
                    "SEO-Optimized Content Hub ranking for 5+ keywords",
                    "Meta Ad Campaign Case Study with A/B creative testing",
                    "Email Marketing Automation sequence with lead magnet"
                ],
                "recommended_timeline": "1-2 Months"
            },
            {
                "step": 3,
                "phase": "Portfolio Development",
                "title": "Performance Analytics Case Study",
                "description": "Compile verified campaign reports with screenshots showing impressions, click-through rates, ROAS, and keyword positions.",
                "deliverables": [
                    "Google Analytics & Search Console performance dashboard",
                    "Meta Ads Manager campaign audit report",
                    "Google & HubSpot digital certifications"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 4,
                "phase": "Possible Entry Roles",
                "title": "Target Digital Growth Openings",
                "description": "Apply for SEO executive, paid ads specialist, and digital marketing trainee roles.",
                "roles": ["SEO Executive", "Social Media Coordinator", "PPC Campaign Specialist", "Growth Marketing Trainee"],
                "guidance_note": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            }
        ]
    },
    "Data Analyst": {
        "is_skill_first": True,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. While legacy corporate tiers may require a degree, modern technology teams and MSMEs frequently hire based on SQL proficiency test scores and interactive dashboard portfolios.",
        "alternative_pathways": [
            "Enter as an Operations or MIS Executive managing Excel data, then bridge to SQL/PowerBI internally",
            "Earn industry certifications such as Microsoft Power BI Data Analyst (PL-300)",
            "Distance Bachelor's degree while working in business reporting"
        ],
        "learning_roadmap": [
            {
                "step": 1,
                "phase": "Foundation & Core Skills",
                "title": "Spreadsheets, SQL & Visualization Tools",
                "description": "Master advanced Excel (Pivot tables, VLOOKUP/XLOOKUP), relational SQL querying (JOINs, aggregations), and PowerBI/Tableau basics.",
                "skills": ["SQL & Database Querying", "Data Visualization (PowerBI/Tableau)", "Python Basics"],
                "recommended_timeline": "2 Months"
            },
            {
                "step": 2,
                "phase": "Hands-on Practice Projects",
                "title": "Interactive Dashboards & Business Insights",
                "description": "Ingest public business datasets (retail, healthcare, transport), cleanse data with SQL/Python, and construct automated dashboards answering real business questions.",
                "projects": [
                    "E-Commerce Sales Performance & Customer Churn Dashboard",
                    "Indian Railways Passenger Analytics & Trend Report",
                    "Financial Cashflow & Expense Tracking Dashboard"
                ],
                "recommended_timeline": "2 Months"
            },
            {
                "step": 3,
                "phase": "Portfolio Development",
                "title": "GitHub SQL Repos & PowerBI Public Portfolio",
                "description": "Publish formatted SQL queries and business insight writeups on GitHub, alongside live interactive dashboard links.",
                "deliverables": [
                    "GitHub repository containing documented SQL scripts and data cleansing pipeline",
                    "Public Tableau / PowerBI web dashboard links",
                    "One-page Executive Summary report highlighting business recommendations"
                ],
                "recommended_timeline": "1 Month"
            },
            {
                "step": 4,
                "phase": "Possible Entry Roles",
                "title": "Target Entry Data & Reporting Roles",
                "description": "Apply for junior data analyst, business intelligence trainee, MIS coordinator, and reporting analyst openings.",
                "roles": ["Junior Data Analyst", "BI Specialist Trainee", "Reporting Associate", "Data Operations Executive"],
                "guidance_note": "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            }
        ]
    },
    "Software Developer": {
        "is_skill_first": False,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Traditional software engineering titles often request a polytechnic diploma or Bachelor's degree. However, strong candidates can bridge in through web development and junior programming roles.",
        "alternative_pathways": [
            "Stepping-stone entry as Web Developer or Frontend Integrator",
            "Technical QA / Automated Software Tester route",
            "Vocational Polytechnic Diploma in Computer Science"
        ],
        "learning_roadmap": []
    },
    "AI/ML Engineer": {
        "is_skill_first": False,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. AI research and machine learning engineering typically require rigorous mathematical and computer science foundations (Bachelor's or Master's). Stepping-stone pathways allow candidates from non-degree backgrounds to build up through Data Analytics and Python scripting first.",
        "alternative_pathways": [
            "Stepping-stone route: Begin as a Data Analyst or Python Web Developer, then upskill into ML algorithms",
            "Consider a formal Bachelor's degree (BCA / B.Tech / BSc) or recognized university credentials",
            "Contribute to open-source ML models and Kaggle competitions"
        ],
        "learning_roadmap": []
    },
    "Cloud Engineer": {
        "is_skill_first": False,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Corporate cloud operations often seek formal technical diplomas or degrees, but hands-on certifications (AWS/Azure) provide a strong bridging pathway.",
        "alternative_pathways": [
            "Stepping-stone entry: Start in IT Support or Linux System Administration, then transition into Cloud Ops",
            "Earn industry cloud certifications: AWS Certified Cloud Practitioner / Solutions Architect Associate"
        ],
        "learning_roadmap": []
    },
    "Cybersecurity Analyst": {
        "is_skill_first": False,
        "qualification_guidance": "Degree and qualification requirements vary by employer and role. Security operations centers (SOC) typically require technical degrees or specialized cybersecurity diplomas, along with verified industry certifications.",
        "alternative_pathways": [
            "Stepping-stone entry: Begin as Network Administrator or IT Support Specialist",
            "Earn foundational security certifications: CompTIA Security+ or Certified Ethical Hacker (CEH)"
        ],
        "learning_roadmap": []
    }
}

def update_skill_first_pathways(db: Session):
    """Updates existing careers and student profile with skill-first metadata and transition fields."""
    for title, meta in SKILL_FIRST_CAREER_METADATA.items():
        career = db.query(Career).filter(Career.title == title).first()
        if career:
            career.is_skill_first = meta.get("is_skill_first", False)
            career.learning_roadmap = meta.get("learning_roadmap", [])
            career.alternative_pathways = meta.get("alternative_pathways", [])
            career.qualification_guidance = meta.get("qualification_guidance", "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying.")
    
    # Update Demo student profile transition fields if not set
    student = db.query(Student).first()
    if student and student.profile:
        if not student.profile.education_status:
            student.profile.education_status = "12th Standard"
        if not student.profile.background_stream:
            student.profile.background_stream = "Science"
        if not student.profile.career_transition:
            student.profile.career_transition = "I am from an IT / CS background"
    
    db.commit()

def ensure_schema_columns(db: Session):
    """Ensures missing columns are dynamically added to SQLite tables if created earlier."""
    bind = db.get_bind()
    try:
        with bind.connect() as conn:
            result = conn.exec_driver_sql("PRAGMA table_info(careers)")
            cols = [r[1] for r in result.fetchall()]
            if cols:
                if "is_skill_first" not in cols:
                    conn.exec_driver_sql("ALTER TABLE careers ADD COLUMN is_skill_first BOOLEAN DEFAULT 0")
                if "learning_roadmap" not in cols:
                    conn.exec_driver_sql("ALTER TABLE careers ADD COLUMN learning_roadmap JSON DEFAULT '[]'")
                if "alternative_pathways" not in cols:
                    conn.exec_driver_sql("ALTER TABLE careers ADD COLUMN alternative_pathways JSON DEFAULT '[]'")
                if "qualification_guidance" not in cols:
                    conn.exec_driver_sql("ALTER TABLE careers ADD COLUMN qualification_guidance TEXT DEFAULT 'Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying.'")

            result = conn.exec_driver_sql("PRAGMA table_info(student_profiles)")
            sp_cols = [r[1] for r in result.fetchall()]
            if sp_cols:
                if "education_status" not in sp_cols:
                    conn.exec_driver_sql("ALTER TABLE student_profiles ADD COLUMN education_status VARCHAR(50) DEFAULT '12th Standard'")
                if "background_stream" not in sp_cols:
                    conn.exec_driver_sql("ALTER TABLE student_profiles ADD COLUMN background_stream VARCHAR(100) DEFAULT 'Science'")
                if "career_transition" not in sp_cols:
                    conn.exec_driver_sql("ALTER TABLE student_profiles ADD COLUMN career_transition VARCHAR(150) DEFAULT 'I am from an IT background'")
            conn.commit()
    except Exception as e:
        print("Schema verification note:", e)

def seed_database(db: Session):
    # Ensure columns exist in SQLite database
    ensure_schema_columns(db)
    # Ensure skill-first metadata and columns are up to date
    update_skill_first_pathways(db)

    # Check if already seeded
    if db.query(Career).count() >= 20:
        return

    print("Seeding database with realistic vocational data...")

    # 1. Seed Skills
    skills_data = [
        # Tech & Data
        ("Python Programming", "Technical", "Writing scripts and applications using Python"),
        ("SQL & Database Querying", "Technical", "Querying and relational schema management"),
        ("Data Visualization (PowerBI/Tableau)", "Analytical", "Creating dashboards and visual metric reports"),
        ("Statistical Analysis", "Analytical", "Descriptive statistics, hypothesis testing and modeling"),
        ("HTML5 & CSS3 Responsive Styling", "Technical", "Building web layouts and responsive UI"),
        ("JavaScript & React", "Technical", "Building interactive front-end web applications"),
        ("REST API Integration", "Technical", "Consuming and building HTTP API microservices"),
        ("Git Version Control", "Technical", "Code versioning and collaborative repositories"),
        ("Linux Server Administration", "Technical", "Command-line navigation and server configuration"),
        ("Network Configuration & Wi-Fi", "Technical", "IP addressing, switches, router setup"),
        ("Cloud Infrastructure (AWS/Azure)", "Technical", "Deploying and managing virtual servers and storage"),
        ("Cybersecurity Auditing", "Technical", "Vulnerability scanning, firewall rules, log analysis"),
        ("UI/UX Wireframing & Figma", "Creative", "User journeys, prototypes, and UI design in Figma"),
        ("SEO & Content Strategy", "Technical", "Search engine optimization and digital content reach"),
        ("Social Media & Ad Campaigns", "Creative", "Running targeted digital advertising campaigns"),
        # Vocational & Practical
        ("Single & Three-Phase Electrical Wiring", "Practical", "Residential and commercial electrical circuits"),
        ("Electrical Troubleshooting & Multimeter", "Practical", "Testing voltage, continuity, and diagnosing faults"),
        ("Solar PV Panel Installation", "Practical", "Roof mounting, solar array cabling, grounding"),
        ("Solar Inverter & Battery Maintenance", "Practical", "DC-to-AC conversion troubleshooting and battery storage"),
        ("CNC Machine Programming (G-Code)", "Practical", "Operating computer numerical control cutting machines"),
        ("Automotive Engine Diagnostics", "Practical", "OBD-II scanner diagnostics and engine mechanics"),
        ("Brake & Suspension Servicing", "Practical", "Brake pad replacement, hydraulic bleed, suspension tuning"),
        ("Patient Vital Signs Monitoring", "Practical", "Blood pressure, pulse oximetry, temperature recording"),
        ("First Aid & CPR Administration", "Practical", "Emergency medical response and trauma care"),
        ("Medication Dispensing & Inventory", "Practical", "Pharmaceutical inventory management and dosage validation"),
        ("Tally ERP & Double-Entry Bookkeeping", "Analytical", "Journal entries, balance sheets, ledger reconciliation"),
        ("GST Compliance & Tax Filing", "Analytical", "Goods and Services Tax preparation and returns"),
        ("Commercial Event Planning", "Soft Skill", "Vendor coordination, scheduling, budget allocation"),
        ("Customer Communication & Hospitality", "Soft Skill", "Client relationship management and conflict resolution"),
        ("Drone Piloting & Flight Safety", "Practical", "UAV navigation, DGCA compliance, aerial surveys"),
        # General Soft Skills
        ("Critical Problem Solving", "Soft Skill", "Systematic root-cause diagnosis and resolution"),
        ("Team Collaboration", "Soft Skill", "Cross-functional cooperation and project coordination"),
    ]

    skill_objs = {}
    for name, cat, desc in skills_data:
        existing = db.query(Skill).filter(Skill.name == name).first()
        if not existing:
            skill = Skill(name=name, category=cat, description=desc)
            db.add(skill)
            db.flush()
            skill_objs[name] = skill
        else:
            skill_objs[name] = existing

    # 2. Seed Interests
    interests_data = [
        ("Technology & Software", "Technology", "Building apps, automating tasks, exploring modern tech"),
        ("Data & Mathematics", "Analytical", "Finding patterns in numbers, solving puzzles, data insights"),
        ("Electronics & Electrical Systems", "Engineering", "Working with circuits, power systems, gadgets"),
        ("Renewable Energy & Environment", "Engineering", "Green power, solar tech, sustainable infrastructure"),
        ("Automotive & Heavy Machinery", "Mechanical", "Vehicles, mechanical parts, workshop craftsmanship"),
        ("Healthcare & Patient Care", "Medical", "Helping patients, clinic assistance, wellness support"),
        ("Design & Visual Arts", "Creative", "Colors, layouts, typography, multimedia and aesthetics"),
        ("Business, Finance & Trade", "Commerce", "Accounting, business management, commerce operations"),
        ("Digital Media & Marketing", "Commerce", "Social media, branding, audience engagement"),
        ("Hands-on Craft & Fabrication", "Practical", "Building physical things, machinery, tool operations"),
        ("Aviation & Drone Technology", "Emerging Tech", "Drones, robotics, remote aerial systems"),
        ("Hospitality & People Management", "Service", "Event management, guest services, culinary tourism")
    ]

    interest_objs = {}
    for name, cat, desc in interests_data:
        existing = db.query(Interest).filter(Interest.name == name).first()
        if not existing:
            item = Interest(name=name, category=cat, description=desc)
            db.add(item)
            db.flush()
            interest_objs[name] = item
        else:
            interest_objs[name] = existing

    # 3. Seed Strengths
    strengths_data = [
        ("Analytical Mindset", "Cognitive", "Excels at breaking complex problems down into solvable logic"),
        ("Attention to Detail", "Quality", "Notices minute discrepancies, bugs, and assembly tolerances"),
        ("Hands-on Dexterity", "Physical", "Exceptional coordination with tools, hardware, and physical assembly"),
        ("Creative Visual Thinking", "Creative", "Ability to conceptualize appealing visuals and spatial balance"),
        ("Empathetic Communication", "Interpersonal", "Listens attentively and reassures people in stressful moments"),
        ("Logical Troubleshooting", "Cognitive", "Methodical diagnostic mindset to pinpoint system breakdowns"),
        ("Stress Resilience", "Personality", "Remains calm and focused during emergencies or tight project deadlines"),
        ("Planning & Organization", "Execution", "Structures tasks, schedules, and materials efficiently"),
        ("Continuous Curiosity", "Learning", "Proactively learns emerging technical skills and industry tools")
    ]

    strength_objs = {}
    for name, cat, desc in strengths_data:
        existing = db.query(Strength).filter(Strength.name == name).first()
        if not existing:
            item = Strength(name=name, category=cat, description=desc)
            db.add(item)
            db.flush()
            strength_objs[name] = item
        else:
            strength_objs[name] = existing

    # 4. Seed 22 Realistic Careers
    careers_data = [
        {
            "title": "Data Analyst",
            "category": "Data & Information Technology",
            "description": "Collects, cleans, and analyzes structured data to generate actionable business intelligence dashboards and operational insights.",
            "salary_range": "₹3.5 - 7.5 LPA",
            "job_outlook": "Very High Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Technology & Software", "Data & Mathematics"],
            "required_aptitude_profile": {"Logical": 70, "Numerical": 75, "Analytical": 75, "Problem Solving": 70, "Verbal": 55},
            "job_roles": ["Junior Data Analyst", "BI Specialist", "Reporting Associate", "Data Quality Executive"],
            "skills": [
                ("Python Programming", 3, 1.2),
                ("SQL & Database Querying", 4, 1.5),
                ("Data Visualization (PowerBI/Tableau)", 3, 1.3),
                ("Statistical Analysis", 3, 1.1)
            ]
        },
        {
            "title": "Web Developer",
            "category": "Software & Web Development",
            "description": "Constructs responsive client-side user interfaces and integrates server endpoints to deliver intuitive web applications.",
            "salary_range": "₹3.0 - 7.0 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Technology & Software", "Design & Visual Arts"],
            "required_aptitude_profile": {"Logical": 65, "Numerical": 55, "Analytical": 65, "Problem Solving": 70, "Verbal": 50},
            "job_roles": ["Frontend Developer", "Junior Web Developer", "React Developer", "UI Integrator"],
            "skills": [
                ("HTML5 & CSS3 Responsive Styling", 4, 1.4),
                ("JavaScript & React", 4, 1.5),
                ("REST API Integration", 3, 1.2),
                ("Git Version Control", 3, 1.0)
            ]
        },
        {
            "title": "Software Developer",
            "category": "Software & Web Development",
            "description": "Designs and writes backend microservices, core logic algorithms, and robust system software for modern digital products.",
            "salary_range": "₹4.0 - 9.0 LPA",
            "job_outlook": "Very High Demand",
            "minimum_education": "Polytechnic Diploma",
            "required_stream": "Technical",
            "preferred_interests": ["Technology & Software", "Data & Mathematics"],
            "required_aptitude_profile": {"Logical": 75, "Numerical": 70, "Analytical": 75, "Problem Solving": 80, "Verbal": 55},
            "job_roles": ["Backend Developer", "Junior Software Engineer", "Python Engineer", "API Specialist"],
            "skills": [
                ("Python Programming", 4, 1.5),
                ("SQL & Database Querying", 3, 1.2),
                ("REST API Integration", 4, 1.4),
                ("Git Version Control", 3, 1.0)
            ]
        },
        {
            "title": "UI/UX Designer",
            "category": "Design & Multimedia",
            "description": "Creates ergonomic wireframes, user journeys, visual palettes, and prototypes to ensure digital applications are engaging and accessible.",
            "salary_range": "₹3.2 - 6.8 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Design & Visual Arts", "Technology & Software"],
            "required_aptitude_profile": {"Logical": 60, "Numerical": 45, "Analytical": 70, "Problem Solving": 65, "Verbal": 65},
            "job_roles": ["UI/UX Designer", "Product Designer", "Wireframe Specialist", "Interaction Designer"],
            "skills": [
                ("UI/UX Wireframing & Figma", 4, 1.6),
                ("HTML5 & CSS3 Responsive Styling", 2, 1.0),
                ("Critical Problem Solving", 3, 1.1)
            ]
        },
        {
            "title": "Cybersecurity Analyst",
            "category": "Information Security",
            "description": "Monitors digital networks for threats, configures firewalls, executes security audits, and mitigates unauthorized system intrusion.",
            "salary_range": "₹4.2 - 8.5 LPA",
            "job_outlook": "Extremely High Demand",
            "minimum_education": "Polytechnic Diploma",
            "required_stream": "Technical",
            "preferred_interests": ["Technology & Software", "Electronics & Electrical Systems"],
            "required_aptitude_profile": {"Logical": 75, "Numerical": 65, "Analytical": 80, "Problem Solving": 75, "Verbal": 60},
            "job_roles": ["SOC Analyst", "Security Administrator", "Incident Responder", "Vulnerability Auditor"],
            "skills": [
                ("Cybersecurity Auditing", 4, 1.6),
                ("Network Configuration & Wi-Fi", 4, 1.4),
                ("Linux Server Administration", 3, 1.2),
                ("Critical Problem Solving", 4, 1.2)
            ]
        },
        {
            "title": "Cloud Engineer",
            "category": "Cloud & Infrastructure",
            "description": "Deploys, scales, and orchestrates virtual compute machines, cloud databases, and automated backup pipelines.",
            "salary_range": "₹4.0 - 8.0 LPA",
            "job_outlook": "Very High Demand",
            "minimum_education": "Polytechnic Diploma",
            "required_stream": "Technical",
            "preferred_interests": ["Technology & Software"],
            "required_aptitude_profile": {"Logical": 70, "Numerical": 60, "Analytical": 70, "Problem Solving": 75, "Verbal": 55},
            "job_roles": ["Cloud Support Associate", "Junior DevOps Specialist", "Cloud Ops Executive"],
            "skills": [
                ("Cloud Infrastructure (AWS/Azure)", 4, 1.6),
                ("Linux Server Administration", 4, 1.4),
                ("Git Version Control", 3, 1.0),
                ("Network Configuration & Wi-Fi", 3, 1.1)
            ]
        },
        {
            "title": "AI/ML Engineer",
            "category": "Artificial Intelligence",
            "description": "Trains machine learning classifiers, prepares feature data pipelines, and deploys predictive inference services.",
            "salary_range": "₹5.0 - 10.0 LPA",
            "job_outlook": "Extremely High Demand",
            "minimum_education": "Bachelor's",
            "required_stream": "Science",
            "preferred_interests": ["Technology & Software", "Data & Mathematics"],
            "required_aptitude_profile": {"Logical": 80, "Numerical": 85, "Analytical": 85, "Problem Solving": 80, "Verbal": 60},
            "job_roles": ["Junior ML Engineer", "Data Scientist", "Model Ops Associate"],
            "skills": [
                ("Python Programming", 5, 1.6),
                ("Statistical Analysis", 4, 1.5),
                ("SQL & Database Querying", 3, 1.1),
                ("REST API Integration", 3, 1.1)
            ]
        },
        {
            "title": "IT Support Specialist",
            "category": "Information Technology",
            "description": "Installs client hardware, configures operating systems, diagnoses LAN network glitches, and delivers technical helpdesk support.",
            "salary_range": "₹2.4 - 4.5 LPA",
            "job_outlook": "Stable Demand",
            "minimum_education": "10th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Technology & Software", "Electronics & Electrical Systems"],
            "required_aptitude_profile": {"Logical": 60, "Numerical": 50, "Analytical": 55, "Problem Solving": 65, "Verbal": 55},
            "job_roles": ["Helpdesk Technician", "Hardware & Network Support", "Desktop Support Engineer"],
            "skills": [
                ("Network Configuration & Wi-Fi", 3, 1.5),
                ("Linux Server Administration", 2, 1.2),
                ("Critical Problem Solving", 3, 1.3),
                ("Customer Communication & Hospitality", 3, 1.1)
            ]
        },
        {
            "title": "Digital Marketing Specialist",
            "category": "Digital Commerce",
            "description": "Executes search engine optimization, oversees paid advertising campaigns, creates marketing copy, and tracks conversion analytics.",
            "salary_range": "₹2.8 - 5.5 LPA",
            "job_outlook": "Growing Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Digital Media & Marketing", "Business, Finance & Trade"],
            "required_aptitude_profile": {"Logical": 55, "Numerical": 55, "Analytical": 65, "Problem Solving": 60, "Verbal": 75},
            "job_roles": ["SEO Executive", "Social Media Coordinator", "PPC Campaign Specialist"],
            "skills": [
                ("SEO & Content Strategy", 4, 1.6),
                ("Social Media & Ad Campaigns", 4, 1.5),
                ("Data Visualization (PowerBI/Tableau)", 2, 1.0)
            ]
        },
        {
            "title": "Graphic Designer",
            "category": "Design & Multimedia",
            "description": "Creates brand identities, social media creatives, brochures, banners, and digital advertising imagery.",
            "salary_range": "₹2.5 - 5.0 LPA",
            "job_outlook": "Steady Demand",
            "minimum_education": "10th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Design & Visual Arts", "Digital Media & Marketing"],
            "required_aptitude_profile": {"Logical": 50, "Numerical": 40, "Analytical": 60, "Problem Solving": 60, "Verbal": 60},
            "job_roles": ["Visual Designer", "Brand Identity Artist", "Digital Content Creator"],
            "skills": [
                ("UI/UX Wireframing & Figma", 3, 1.4),
                ("HTML5 & CSS3 Responsive Styling", 2, 1.0)
            ]
        },
        {
            "title": "Electrician",
            "category": "Vocational Craft & Engineering",
            "description": "Installs and repairs domestic and commercial wiring, circuit breaker boards, conduit systems, and electrical appliances.",
            "salary_range": "₹2.2 - 4.8 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "10th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Electronics & Electrical Systems", "Hands-on Craft & Fabrication"],
            "required_aptitude_profile": {"Logical": 60, "Numerical": 50, "Analytical": 60, "Problem Solving": 70, "Verbal": 45},
            "job_roles": ["Licensed Residential Electrician", "Maintenance Electrician", "Industrial Wireman"],
            "skills": [
                ("Single & Three-Phase Electrical Wiring", 4, 1.6),
                ("Electrical Troubleshooting & Multimeter", 4, 1.5),
                ("Critical Problem Solving", 3, 1.1)
            ]
        },
        {
            "title": "Solar Technician",
            "category": "Renewable Energy & Vocational",
            "description": "Installs photovoltaic solar panels, runs DC inverter cabling, anchors rooftop mounts, and executes periodic maintenance.",
            "salary_range": "₹2.6 - 5.2 LPA",
            "job_outlook": "Very High Demand",
            "minimum_education": "10th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Renewable Energy & Environment", "Electronics & Electrical Systems"],
            "required_aptitude_profile": {"Logical": 60, "Numerical": 55, "Analytical": 60, "Problem Solving": 65, "Verbal": 45},
            "job_roles": ["Solar PV Installer", "Rooftop Solar Lead", "Solar Maintenance Specialist"],
            "skills": [
                ("Solar PV Panel Installation", 4, 1.6),
                ("Solar Inverter & Battery Maintenance", 4, 1.5),
                ("Single & Three-Phase Electrical Wiring", 3, 1.3),
                ("Electrical Troubleshooting & Multimeter", 3, 1.2)
            ]
        },
        {
            "title": "Healthcare Assistant",
            "category": "Healthcare & Allied Health",
            "description": "Supports registered nurses and doctors with patient vital measurements, mobility support, bedside hygiene, and clinic paperwork.",
            "salary_range": "₹2.0 - 4.2 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "10th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Healthcare & Patient Care"],
            "required_aptitude_profile": {"Logical": 50, "Numerical": 45, "Analytical": 55, "Problem Solving": 60, "Verbal": 65},
            "job_roles": ["General Duty Assistant (GDA)", "Home Healthcare Aide", "Hospital Nursing Attendant"],
            "skills": [
                ("Patient Vital Signs Monitoring", 4, 1.6),
                ("First Aid & CPR Administration", 4, 1.5),
                ("Customer Communication & Hospitality", 3, 1.2)
            ]
        },
        {
            "title": "Accountant",
            "category": "Finance & Commerce",
            "description": "Records financial transactions, prepares balance sheets, manages accounts payable/receivable, and ensures tax compliance.",
            "salary_range": "₹2.8 - 6.0 LPA",
            "job_outlook": "Stable Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Commerce",
            "preferred_interests": ["Business, Finance & Trade", "Data & Mathematics"],
            "required_aptitude_profile": {"Logical": 65, "Numerical": 75, "Analytical": 70, "Problem Solving": 65, "Verbal": 60},
            "job_roles": ["Junior Accountant", "Tally Operator", "Accounts Executive", "Billing Specialist"],
            "skills": [
                ("Tally ERP & Double-Entry Bookkeeping", 4, 1.6),
                ("GST Compliance & Tax Filing", 4, 1.5),
                ("SQL & Database Querying", 2, 1.0)
            ]
        },
        {
            "title": "Business Analyst",
            "category": "Business Management & Consulting",
            "description": "Bridges corporate management and technical teams by articulating project requirements, workflow diagrams, and financial ROI.",
            "salary_range": "₹4.5 - 9.5 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "Bachelor's",
            "required_stream": "Any",
            "preferred_interests": ["Business, Finance & Trade", "Technology & Software"],
            "required_aptitude_profile": {"Logical": 70, "Numerical": 65, "Analytical": 80, "Problem Solving": 75, "Verbal": 75},
            "job_roles": ["Associate Business Analyst", "Functional Consultant", "Process Analyst"],
            "skills": [
                ("Data Visualization (PowerBI/Tableau)", 4, 1.4),
                ("SQL & Database Querying", 3, 1.2),
                ("Critical Problem Solving", 4, 1.4),
                ("Team Collaboration", 4, 1.2)
            ]
        },
        {
            "title": "CNC Machine Operator",
            "category": "Manufacturing & Vocational",
            "description": "Programs, calibrates, and runs precision computer-controlled milling and lathe machines to produce metal components.",
            "salary_range": "₹2.5 - 5.0 LPA",
            "job_outlook": "Growing Demand",
            "minimum_education": "ITI",
            "required_stream": "Technical",
            "preferred_interests": ["Hands-on Craft & Fabrication", "Automotive & Heavy Machinery"],
            "required_aptitude_profile": {"Logical": 65, "Numerical": 65, "Analytical": 65, "Problem Solving": 65, "Verbal": 45},
            "job_roles": ["CNC Programmer", "Machinist", "Precision Lathe Operator"],
            "skills": [
                ("CNC Machine Programming (G-Code)", 4, 1.6),
                ("Critical Problem Solving", 3, 1.2)
            ]
        },
        {
            "title": "Automotive Technician",
            "category": "Automotive & Mechanical",
            "description": "Performs multi-point inspections on motor vehicles, operates electronic diagnostic code scanners, and overhauls brake and transmission gear.",
            "salary_range": "₹2.4 - 5.2 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "10th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Automotive & Heavy Machinery", "Electronics & Electrical Systems"],
            "required_aptitude_profile": {"Logical": 60, "Numerical": 50, "Analytical": 60, "Problem Solving": 70, "Verbal": 45},
            "job_roles": ["Automotive Mechanic", "EV Diagnostic Technician", "Service Workshop Supervisor"],
            "skills": [
                ("Automotive Engine Diagnostics", 4, 1.5),
                ("Brake & Suspension Servicing", 4, 1.5),
                ("Electrical Troubleshooting & Multimeter", 3, 1.2)
            ]
        },
        {
            "title": "Network Administrator",
            "category": "Information Technology",
            "description": "Maintains physical network switches, firewalls, VLANs, and VPN connections to ensure continuous corporate connectivity.",
            "salary_range": "₹3.5 - 7.0 LPA",
            "job_outlook": "High Demand",
            "minimum_education": "Polytechnic Diploma",
            "required_stream": "Technical",
            "preferred_interests": ["Technology & Software", "Electronics & Electrical Systems"],
            "required_aptitude_profile": {"Logical": 70, "Numerical": 60, "Analytical": 70, "Problem Solving": 75, "Verbal": 55},
            "job_roles": ["Network Engineer", "Systems Support Admin", "Infrastructure Specialist"],
            "skills": [
                ("Network Configuration & Wi-Fi", 5, 1.6),
                ("Linux Server Administration", 3, 1.3),
                ("Cybersecurity Auditing", 3, 1.2)
            ]
        },
        {
            "title": "Drone Technician & Operator",
            "category": "Emerging Vocational Tech",
            "description": "Assembles, programs, and pilots unmanned aerial vehicles (UAVs) for agricultural spraying, land surveying, and geographic mapping.",
            "salary_range": "₹3.0 - 6.5 LPA",
            "job_outlook": "Very High Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Aviation & Drone Technology", "Technology & Software"],
            "required_aptitude_profile": {"Logical": 65, "Numerical": 55, "Analytical": 65, "Problem Solving": 70, "Verbal": 55},
            "job_roles": ["Certified Drone Pilot", "UAV Maintenance Engineer", "Aerial Survey Specialist"],
            "skills": [
                ("Drone Piloting & Flight Safety", 4, 1.6),
                ("Electrical Troubleshooting & Multimeter", 3, 1.3),
                ("Critical Problem Solving", 3, 1.2)
            ]
        },
        {
            "title": "Renewable Energy Specialist",
            "category": "Renewable Energy & Environmental",
            "description": "Plans green energy transition systems, micro-grid installations, and battery storage infrastructure for commercial facilities.",
            "salary_range": "₹3.5 - 7.5 LPA",
            "job_outlook": "Very High Demand",
            "minimum_education": "Polytechnic Diploma",
            "required_stream": "Technical",
            "preferred_interests": ["Renewable Energy & Environment", "Electronics & Electrical Systems"],
            "required_aptitude_profile": {"Logical": 70, "Numerical": 65, "Analytical": 70, "Problem Solving": 70, "Verbal": 55},
            "job_roles": ["Clean Energy Auditor", "Solar Project Engineer", "Energy Storage Technician"],
            "skills": [
                ("Solar PV Panel Installation", 4, 1.4),
                ("Solar Inverter & Battery Maintenance", 4, 1.5),
                ("Single & Three-Phase Electrical Wiring", 3, 1.2)
            ]
        },
        {
            "title": "Pharmacy Assistant",
            "category": "Healthcare & Allied Health",
            "description": "Manages pharmacy stocking, verifies prescription labeling under pharmacist direction, and assists patients with over-the-counter wellness supplies.",
            "salary_range": "₹2.2 - 4.5 LPA",
            "job_outlook": "Steady Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Science",
            "preferred_interests": ["Healthcare & Patient Care"],
            "required_aptitude_profile": {"Logical": 60, "Numerical": 55, "Analytical": 60, "Problem Solving": 60, "Verbal": 65},
            "job_roles": ["Dispensing Assistant", "Pharmacy Stock Executive", "Chemist Associate"],
            "skills": [
                ("Medication Dispensing & Inventory", 4, 1.6),
                ("Customer Communication & Hospitality", 3, 1.2),
                ("Attention to Detail", 3, 1.2)
            ]
        },
        {
            "title": "Hospitality & Event Manager",
            "category": "Service & Hospitality",
            "description": "Coordinates catering, hotel operations, corporate venue setups, and guest experiences with high customer satisfaction standards.",
            "salary_range": "₹2.8 - 6.0 LPA",
            "job_outlook": "Growing Demand",
            "minimum_education": "12th Standard",
            "required_stream": "Any",
            "preferred_interests": ["Hospitality & People Management", "Business, Finance & Trade"],
            "required_aptitude_profile": {"Logical": 55, "Numerical": 50, "Analytical": 60, "Problem Solving": 65, "Verbal": 75},
            "job_roles": ["Event Coordinator", "Front Desk Manager", "Banquet Supervisor"],
            "skills": [
                ("Commercial Event Planning", 4, 1.5),
                ("Customer Communication & Hospitality", 5, 1.6),
                ("Team Collaboration", 4, 1.3)
            ]
        }
    ]

    career_objs = {}
    for c_data in careers_data:
        c = Career(
            title=c_data["title"],
            category=c_data["category"],
            description=c_data["description"],
            salary_range=c_data["salary_range"],
            job_outlook=c_data["job_outlook"],
            minimum_education=c_data["minimum_education"],
            required_stream=c_data["required_stream"],
            preferred_interests=c_data["preferred_interests"],
            required_aptitude_profile=c_data["required_aptitude_profile"],
            job_roles=c_data["job_roles"]
        )
        db.add(c)
        db.flush()
        career_objs[c_data["title"]] = c

        # Link skills
        for sk_name, req_lvl, imp in c_data["skills"]:
            if sk_name in skill_objs:
                cs = CareerSkill(
                    career_id=c.id,
                    skill_id=skill_objs[sk_name].id,
                    required_level=req_lvl,
                    importance_weight=imp
                )
                db.add(cs)

    # 5. Seed Realistic Courses
    courses_data = [
        ("Certificate in Practical Data Analytics & PowerBI", "National Skill Development Corporation (NSDC)", 16, 18000.0, "12th Standard Pass", "Hands-on data querying with SQL, data transformation, and PowerBI visualization.", "Hybrid", "NSDC Level 4 Certificate", "Beginner", ["SQL & Database Querying", "Data Visualization (PowerBI/Tableau)", "Statistical Analysis"], ["Data Analyst", "Business Analyst"]),
        ("Python for Automation & Software Foundations", "Polytechnic Institute of Tech", 12, 14000.0, "10th Standard Pass", "Scripting, algorithmic thinking, and building CLI and web automation with Python.", "Online", "Govt Accredited Tech Certificate", "Beginner", ["Python Programming", "Git Version Control"], ["Software Developer", "Data Analyst", "Web Developer"]),
        ("Full-Stack Modern Frontend Web Development", "State Vocational Skill Mission", 20, 22000.0, "12th Standard Pass", "Building modern responsive web apps with HTML5, CSS3, modern JavaScript, and React.", "Hybrid", "Industry Certified Frontend Developer", "Intermediate", ["HTML5 & CSS3 Responsive Styling", "JavaScript & React", "REST API Integration", "Git Version Control"], ["Web Developer", "UI/UX Designer"]),
        ("Cybersecurity Defender & Network Security Course", "Centre for Development of Advanced Computing (C-DAC)", 24, 28000.0, "Diploma / 12th PCM", "Configuring firewalls, IDS/IPS, network security protocols, and vulnerability analysis.", "Offline", "C-DAC Certified Security Associate", "Intermediate", ["Cybersecurity Auditing", "Network Configuration & Wi-Fi", "Linux Server Administration"], ["Cybersecurity Analyst", "Network Administrator"]),
        ("Rooftop Solar PV Installation & Commissioning (Suryamitra)", "Ministry of New and Renewable Energy (MNRE)", 12, 9500.0, "10th Standard / ITI Pass", "National Suryamitra vocational skill program for solar PV layout, roof mounting, and inverter wiring.", "Offline", "Govt Suryamitra Skill Certificate", "Beginner", ["Solar PV Panel Installation", "Solar Inverter & Battery Maintenance", "Single & Three-Phase Electrical Wiring"], ["Solar Technician", "Renewable Energy Specialist"]),
        ("Industrial Electrician & Wireman Certification", "Govt Industrial Training Institute (ITI)", 24, 12000.0, "10th Standard Pass", "Comprehensive hands-on electrical safety, 3-phase wiring, conduit bending, and switchgear maintenance.", "Offline", "National Trade Certificate (NTC)", "Beginner", ["Single & Three-Phase Electrical Wiring", "Electrical Troubleshooting & Multimeter"], ["Electrician"]),
        ("General Duty Assistant (GDA) Healthcare Trainee", "Healthcare Sector Skill Council", 16, 11000.0, "10th Standard Pass", "Clinical hospital training on vital signs, bed care, patient assistance, and infection hygiene.", "Hybrid", "HSSC Healthcare Certificate", "Beginner", ["Patient Vital Signs Monitoring", "First Aid & CPR Administration"], ["Healthcare Assistant"]),
        ("TallyPrime with GST & Financial Bookkeeping", "Institute of Certified Bookkeepers", 10, 8500.0, "12th Standard Pass", "Double-entry accounting, ledger reconciliations, payroll processing, and GST return filing.", "Hybrid", "Tally Certified Professional", "Beginner", ["Tally ERP & Double-Entry Bookkeeping", "GST Compliance & Tax Filing"], ["Accountant"]),
        ("Drone Pilot Licensing & Commercial UAV Operations", "DGCA Approved Drone Remote Pilot Training Organisation (RPTO)", 8, 35000.0, "10th Standard Pass (Min 18 yrs)", "DGCA Remote Pilot License (RPL) training with simulator flights and live autonomous mapping missions.", "Offline", "DGCA Remote Pilot License", "Intermediate", ["Drone Piloting & Flight Safety", "Electrical Troubleshooting & Multimeter"], ["Drone Technician & Operator"]),
        ("Automotive OBD-II Diagnostics & EV Service Course", "Automotive Skills Development Council (ASDC)", 18, 19500.0, "10th Standard Pass", "Diagnosing engine electronic codes, sensor testing, hydraulic brakes, and EV battery safety basics.", "Offline", "ASDC Certified Auto Technician", "Intermediate", ["Automotive Engine Diagnostics", "Brake & Suspension Servicing"], ["Automotive Technician"]),
        ("UI/UX Mobile & Web Prototyping in Figma", "Digital Design Guild", 12, 16000.0, "10th Standard Pass", "Designing user flows, wireframes, design systems, and clickable high-fidelity prototypes in Figma.", "Online", "Professional UI Designer Certificate", "Beginner", ["UI/UX Wireframing & Figma"], ["UI/UX Designer", "Graphic Designer"]),
        ("Digital Marketing & Performance Ads Specialist", "National Digital Commerce Academy", 14, 15000.0, "12th Standard Pass", "Mastering Google Search, Meta Ads, SEO copywriting, and web conversion analytics.", "Online", "Certified Digital Marketing Associate", "Beginner", ["SEO & Content Strategy", "Social Media & Ad Campaigns"], ["Digital Marketing Specialist"])
    ]

    for title, prov, dur, cost, elig, desc, mode, cert, lvl, sk_cov, car_targets in courses_data:
        course = Course(
            title=title,
            provider=prov,
            duration_weeks=dur,
            approximate_cost=cost,
            eligibility=elig,
            description=desc,
            mode=mode,
            certification_type=cert,
            level=lvl,
            skills_covered=sk_cov
        )
        db.add(course)
        db.flush()

        for c_title in car_targets:
            if c_title in career_objs:
                cc = CareerCourse(career_id=career_objs[c_title].id, course_id=course.id)
                db.add(cc)

    # 6. Seed 30+ Aptitude Questions (6+ in each category)
    questions_data = [
        # Logical Reasoning (6 questions)
        ("Logical Reasoning", "If all roses are flowers and some flowers fade quickly, which of the following is definitely true?", "All roses fade quickly", "No roses fade quickly", "Some flowers are roses", "No flowers fade quickly", "C", "Since all roses are flowers, it directly follows that some flowers are roses."),
        ("Logical Reasoning", "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?", "(1/3)", "(1/8)", "(2/8)", "(1/16)", "B", "Each number is half of the previous number: (1/4) / 2 = 1/8."),
        ("Logical Reasoning", "Suresh walks 20 meters North, turns right and walks 30 meters, then turns right again and walks 20 meters. Which direction is he facing?", "North", "South", "East", "West", "B", "Starting facing North, turning right faces East, turning right again faces South."),
        ("Logical Reasoning", "In a certain code, 'ROAD' is written as 'URDG'. How is 'SWAN' written in that code?", "VXDQ", "VZDQ", "UXDQ", "TZDP", "B", "Each letter moves ahead by 3: S->V, W->Z, A->D, N->Q: VZDQ."),
        ("Logical Reasoning", "Pointing to a photograph, a woman says: 'He is the son of the only child of my grandfather.' Who is the man in the photograph to the woman?", "Brother", "Cousin", "Uncle", "Father", "A", "Grandfather's only child is the woman's father. The son of her father is her brother."),
        ("Logical Reasoning", "Statement: 'Most birds can fly. Penguins are birds.' Which conclusion follows?", "Penguins can definitely fly", "Penguins may or may not fly", "Penguins cannot fly", "All birds can fly", "B", "Since only 'most' birds can fly, an individual bird species may or may not possess flight."),

        # Numerical Ability (6 questions)
        ("Numerical Ability", "If a shirt marked at ₹800 is sold for ₹680, what is the discount percentage?", "12%", "15%", "18%", "20%", "B", "Discount is 800 - 680 = ₹120. Percentage = (120 / 800) * 100 = 15%."),
        ("Numerical Ability", "A train travels 180 km in 3 hours. What is its speed in meters per second?", "15 m/s", "16.67 m/s", "20 m/s", "25 m/s", "B", "Speed = 180 km / 3 h = 60 km/h. Converting to m/s: 60 * (5/18) = 16.67 m/s."),
        ("Numerical Ability", "If 12 workers can assemble a machine in 8 days, how many days will 6 workers take at the same pace?", "4 days", "12 days", "16 days", "24 days", "C", "Worker-days = 12 * 8 = 96. With 6 workers: 96 / 6 = 16 days."),
        ("Numerical Ability", "The average of 5 numbers is 20. If one number is removed, the average becomes 18. What was the removed number?", "24", "26", "28", "30", "C", "Total of 5 = 100. Total of 4 = 72. Removed number = 100 - 72 = 28."),
        ("Numerical Ability", "A sum of ₹5,000 invested at 10% simple interest per year will earn how much interest in 3 years?", "₹1,000", "₹1,250", "₹1,500", "₹1,800", "C", "Simple Interest = (5000 * 10 * 3) / 100 = ₹1,500."),
        ("Numerical Ability", "If 30% of a number is 90, what is 50% of that number?", "120", "150", "180", "200", "B", "The number is 90 / 0.3 = 300. 50% of 300 = 150."),

        # Verbal Ability (6 questions)
        ("Verbal Ability", "Choose the antonym of the word 'TRANSPARENT':", "Clear", "Opaque", "Bright", "Lucid", "B", "'Opaque' means not able to be seen through, the exact opposite of transparent."),
        ("Verbal Ability", "Select the word that best completes the sentence: 'The team worked with great ______ to finish the project before the deadline.'", "diligence", "hesitation", "negligence", "indifference", "A", "'Diligence' means careful and persistent work or effort."),
        ("Verbal Ability", "Identify the correctly spelled word:", "Accomodation", "Accommodation", "Acommodation", "Accommadation", "B", "The correct spelling is 'Accommodation' with double 'c' and double 'm'."),
        ("Verbal Ability", "Select the synonym of 'PRAGMATIC':", "Theoretical", "Practical", "Idealistic", "Vague", "B", "Pragmatic means dealing with things sensibly and realistically based on practical conditions."),
        ("Verbal Ability", "Complete the analogy: Electrician : Wire :: Carpenter : ?", "Wood", "Metal", "Glass", "Cloth", "A", "An electrician primarily works with wire; a carpenter works with wood."),
        ("Verbal Ability", "Which idiom means 'to face a difficult situation courageously'?", "Bite the bullet", "Spill the beans", "Burn bridges", "Bark up the wrong tree", "A", "'Bite the bullet' means to bravely face an inevitable tough situation."),

        # Analytical Thinking (6 questions)
        ("Analytical Thinking", "A company noticed that customer complaints dropped by 40% when automated status SMS were enabled. What is the most reasonable inference?", "Customers prefer SMS over email", "Communication transparency lowers customer anxiety", "All product defects were solved", "The automation had no effect", "B", "Proactive updates directly relieve uncertainty and customer worry."),
        ("Analytical Thinking", "If Team A is more productive than Team B, and Team B is as productive as Team C, which is necessarily true?", "Team A is more productive than Team C", "Team C is more productive than Team A", "Team A equals Team C", "Team B is the least productive", "A", "By transitivity: A > B and B = C => A > C."),
        ("Analytical Thinking", "A solar plant produces 100 kWh on sunny days and 40 kWh on cloudy days. In a 10-day period with 7 sunny days, total energy produced was:", "700 kWh", "820 kWh", "940 kWh", "1000 kWh", "B", "Energy = (7 * 100) + (3 * 40) = 700 + 120 = 820 kWh."),
        ("Analytical Thinking", "When optimizing a slow computer, a technician finds high RAM usage (98%) and low CPU usage (15%). What is the primary bottleneck?", "Processor speed", "Memory capacity", "Power supply", "Monitor resolution", "B", "When RAM is at 98% while CPU is low, memory saturation is the clear bottleneck."),
        ("Analytical Thinking", "A bakery produces 50 loaves using 20 kg flour. How much flour is needed for 125 loaves?", "40 kg", "50 kg", "55 kg", "60 kg", "B", "Flour per loaf = 20 / 50 = 0.4 kg. For 125 loaves: 125 * 0.4 = 50 kg."),
        ("Analytical Thinking", "In a quality inspection of 200 circuit boards, 6 were found defective. What is the defect rate?", "0.3%", "3.0%", "6.0%", "12.0%", "B", "Defect rate = (6 / 200) * 100 = 3.0%."),

        # Problem Solving (6 questions)
        ("Problem Solving", "A machine suddenly stops operating with an overheating warning. What is the first safety action you should take?", "Pour cold water on it immediately", "Turn off power supply and allow system to cool", "Restart the machine immediately", "Ignore the alarm and continue work", "B", "Standard industrial safety protocol requires immediately cutting power to prevent electrical fire."),
        ("Problem Solving", "You need to measure exactly 4 liters of water, but you only have a 3-liter bucket and a 5-liter bucket. Can you measure it?", "No, it is impossible", "Yes, fill 5L, pour into 3L (leaving 2L in 5L bucket), empty 3L, pour 2L into 3L, fill 5L and top off 3L (leaves 4L in 5L)", "Yes, guess halfway in the 5L bucket", "No, need a 4L bucket", "B", "Classic mathematical water jug riddle: leaving exactly 4 liters in the 5-liter jug."),
        ("Problem Solving", "A customer calls complaining that their Wi-Fi router lights are off. What should you instruct them to check first?", "Change their Wi-Fi password", "Check if power cable is plugged into wall outlet", "Buy a new router immediately", "Reinstall computer operating system", "B", "Methodical diagnostic troubleshooting starts with foundational power verification."),
        ("Problem Solving", "During a plumbing repair, water is leaking rapidly under the sink. What should you immediately do?", "Wipe the floor with cloth", "Shut off the main water valve", "Apply glue to the leaking pipe", "Wait for the leak to stop", "B", "Shutting off the water supply isolates the pressurized source and prevents flooding."),
        ("Problem Solving", "You have 3 tasks with deadlines: Task A (due in 1 hour, urgent), Task B (due tomorrow), Task C (due in 3 days). In what order should you work?", "Task C, then B, then A", "Task B, then A, then C", "Task A, then B, then C", "All simultaneously", "C", "Prioritization by urgent deadline ensures time-critical deliverables are met first."),
        ("Problem Solving", "A solar inverter display shows 'Error 03: High Grid Voltage'. What should the technician verify?", "Check battery fluid level only", "Measure incoming AC grid voltage with calibrated multimeter", "Replace solar panels immediately", "Paint the rooftop white", "B", "Verifying the incoming line voltage with a multimeter confirms whether the grid utility is exceeding tolerance limits.")
    ]

    for q_cat, q_txt, op_a, op_b, op_c, op_d, corr, expl in questions_data:
        q = AptitudeQuestion(
            category=q_cat,
            question_text=q_txt,
            option_a=op_a,
            option_b=op_b,
            option_c=op_c,
            option_d=op_d,
            correct_option=corr,
            explanation=expl
        )
        db.add(q)

    # 7. Seed Demo Users (Student, Parent, Admin)
    # Admin
    admin_user = User(
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
        full_name="Platform Administrator",
        phone="9876543210",
        role="admin",
        state="Karnataka",
        education_level="Bachelor's",
        preferred_language="English"
    )
    db.add(admin_user)
    db.flush()

    # Parent
    parent_user = User(
        email="parent@example.com",
        password_hash=get_password_hash("parent123"),
        full_name="Rajesh Sharma (Parent)",
        phone="9876543211",
        role="parent",
        state="Karnataka",
        education_level="Bachelor's",
        preferred_language="English"
    )
    db.add(parent_user)
    db.flush()
    parent_profile = Parent(user_id=parent_user.id)
    db.add(parent_profile)
    db.flush()

    # Student
    student_user = User(
        email="student@example.com",
        password_hash=get_password_hash("student123"),
        full_name="Aarav Sharma (Student)",
        phone="9876543212",
        role="student",
        state="Karnataka",
        education_level="12th Standard",
        preferred_language="English"
    )
    db.add(student_user)
    db.flush()

    student_code = "STU-88219"
    student = Student(user_id=student_user.id, student_code=student_code)
    db.add(student)
    db.flush()

    # Seed Student Profile details
    stu_prof = StudentProfile(
        student_id=student.id,
        education_level="12th Standard",
        stream="Science / Vocational IT",
        gpa_or_percentage=78.5,
        school_college="Govt PU College, Bengaluru",
        graduation_year=2025
    )
    db.add(stu_prof)

    # Student Interests (Technology 5, Data 4, Electronics 3)
    if "Technology & Software" in interest_objs:
        db.add(StudentInterest(student_id=student.id, interest_id=interest_objs["Technology & Software"].id, interest_level=5))
    if "Data & Mathematics" in interest_objs:
        db.add(StudentInterest(student_id=student.id, interest_id=interest_objs["Data & Mathematics"].id, interest_level=4))
    if "Electronics & Electrical Systems" in interest_objs:
        db.add(StudentInterest(student_id=student.id, interest_id=interest_objs["Electronics & Electrical Systems"].id, interest_level=3))

    # Student Skills (Python 2, HTML/CSS 3, SQL 2)
    if "Python Programming" in skill_objs:
        db.add(StudentSkill(student_id=student.id, skill_id=skill_objs["Python Programming"].id, proficiency_level=2))
    if "HTML5 & CSS3 Responsive Styling" in skill_objs:
        db.add(StudentSkill(student_id=student.id, skill_id=skill_objs["HTML5 & CSS3 Responsive Styling"].id, proficiency_level=3))
    if "SQL & Database Querying" in skill_objs:
        db.add(StudentSkill(student_id=student.id, skill_id=skill_objs["SQL & Database Querying"].id, proficiency_level=2))

    # Student Strengths
    if "Analytical Mindset" in strength_objs:
        db.add(StudentStrength(student_id=student.id, strength_id=strength_objs["Analytical Mindset"].id))
    if "Logical Troubleshooting" in strength_objs:
        db.add(StudentStrength(student_id=student.id, strength_id=strength_objs["Logical Troubleshooting"].id))

    # Student Preferences
    db.add(Preference(
        student_id=student.id,
        preferred_work_env="Indoor/Office",
        preferred_industry="Information Technology",
        budget_max=35000.0,
        max_course_duration_months=12,
        location_type="Local / Hybrid",
        expected_salary_min=30000.0,
        work_style="Hands-on & Computer"
    ))

    # Student Aptitude Baseline Result
    db.add(AptitudeResult(
        student_id=student.id,
        logical_score=83.3,
        numerical_score=83.3,
        verbal_score=66.7,
        analytical_score=83.3,
        problem_solving_score=83.3,
        total_score=4.0,
        percentage=80.0
    ))

    # Link Demo Parent to Demo Student
    link = ParentStudentLink(
        parent_id=parent_profile.id,
        student_id=student.id,
        status="active",
        invite_code=student_code
    )
    db.add(link)

    db.commit()
    print("Database seeding completed successfully!")
