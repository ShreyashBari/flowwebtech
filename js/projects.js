document.addEventListener("DOMContentLoaded", () => {
    // Projects Data Store
    const projectsData = {
        bbps: {
            title: "BBPS Reconciliation Web Application",
            subtitle: "Automation & Process Optimization",
            category: "Web App & Automation",
            problem: "Manual reconciliation was time-consuming, error-prone, and highly repetitive. High dependency on human effort led to processing delays and reconciliation inconsistencies, with no centralized or automated system.",
            solution: "Analyzed the end-to-end reconciliation workflow and built an automated, rule-based reconciliation web application. It processes CSV imports from multiple sources, matches transaction keys, and generates download reports in seconds.",
            quote: "This automation converted a 2–3 hour manual reconciliation process into a 10–15 second system-driven workflow.",
            features: [
                "Upload Payment Gateway transaction & CIRL Core transaction CSV files",
                "Automated comparison & rule-based reconciliation logic",
                "Normal & forceful reconciliation handling",
                "Auto-generated downloadable reports (Common, Payment Gateway-only, CIRL Core-only)",
                "Secure user authentication (Signup/Login)",
                "Clean, dark-themed dashboard UI with real-time status updates"
            ],
            tech: {
                "Frontend": "HTML5, CSS3, JavaScript",
                "Backend": "Python (Flask)",
                "Data Handling": "CSV processing & automated report generation",
                "Deployment": "Local / Intranet Server"
            },
            metric: {
                value: "10-15s",
                label: "Processing Time",
                sublabel: "Reduced from 2-3 hours manually"
            },
            screenshots: [
                "img/bbps_init.png",
                "img/bbps_complete.png",
                "img/bbps_forceful.png"
            ]
        },
        access_db: {
            title: "Database Automation: Transaction Segregation",
            subtitle: "Microsoft Access Database Optimization",
            category: "Database System",
            problem: "Tasked with sorting and validating large volumes of monthly invoice transactions, the previous manual process required approximately 8 hours of administrative work to separate records by company and check for duplicates.",
            solution: "Developed a fully automated database solution in Microsoft Access. Using VBA and Access macros, the tool segregates records by insurance companies and runs automated duplicate validation in a double-click.",
            features: [
                "Macro Automation: Segregate macro instantly queries a master database and automatically generates individual tables for 20+ insurance companies",
                "Data Summarization: Dynamic queries (Company_wise) provide immediate, aggregated volume metrics (total_count) for each company code",
                "Quality Assurance: Integrated duplicate detection system (Find_Duplicates) targeting POLICY_NO to ensure error-free outputs",
                "Visual reporting in Microsoft Access sheets"
            ],
            tech: {
                "Platform": "Microsoft Access",
                "Language": "VBA (Visual Basic for Applications)",
                "Automation": "Access Macros & Triggers",
                "Queries": "Relational SQL (Aggregate & Duplicate queries)",
                "QA Checks": "Unique Identifier (POLICY_NO)"
            },
            metric: {
                value: "< 1 min",
                label: "Execution Time",
                sublabel: "Reduced from 8 hours (99.8% Time Saving)"
            },
            screenshots: [
                "img/access_company_wise.png",
                "img/access_duplicates.png"
            ]
        },
        ecom_dash: {
            title: "E-Commerce Sales Dashboard & Predictive Model",
            subtitle: "Data Analysis & Business Intelligence",
            category: "Data Analytics & ML",
            problem: "Raw e-commerce transaction logs contained untapped customer behavior insights. Sales forecasting was manual and retrospective, leading to delayed marketing responses and customer churn.",
            solution: "Delved into the e-commerce sales dataset to clean and analyze data. Built an interactive Power BI dashboard for visual reporting and trained machine learning models to forecast future trends and guide customer retention.",
            features: [
                "Data Collection & Cleaning: Processed data from multiple sources using Python to ensure completeness",
                "Exploratory Data Analysis (EDA): Identified patterns, outliers, and key variables impacting sales",
                "Visualization: Created intuitive dashboards using Power BI to illustrate findings and support data-driven decisions",
                "Predictive Modeling: Developed machine learning models to forecast sales and provide strategic recommendations",
                "Key Insights: Discovered a 20% increase in customer retention through targeted marketing strategies"
            ],
            tech: {
                "Languages": "Python (Pandas, NumPy, Scikit-Learn)",
                "Database": "SQL Database Querying",
                "BI Tool": "Power BI Interactive Dashboards",
                "Spreadsheets": "Microsoft Excel Data Mapping"
            },
            metric: {
                value: "+20%",
                label: "Customer Retention",
                sublabel: "Achieved via personalized marketing recommendations"
            },
            screenshots: [
                "img/ecom_dashboard.png"
            ],
            linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7217885970413551616/"
        }
    };

    // Filter Logic
    const filterChips = document.querySelectorAll(".portfolio-chip");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterChips.length > 0 && projectCards.length > 0) {
        filterChips.forEach(chip => {
            chip.addEventListener("click", () => {
                filterChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");

                const filterValue = chip.getAttribute("data-filter");

                projectCards.forEach(card => {
                    const category = card.getAttribute("data-category");
                    if (filterValue === "all" || category === filterValue) {
                        card.style.display = "flex";
                        if (window.gsap) {
                            gsap.fromTo(card, { opacity: 0, y: 30, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.4 });
                        } else {
                            card.style.opacity = "1";
                            card.style.transform = "none";
                        }
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    }

    // Modal Logic
    const modal = document.getElementById("projectModal");
    const closeBtn = document.getElementById("modalClose");

    const modalSubtitle = document.getElementById("modalSubtitle");
    const modalTitle = document.getElementById("modalTitle");
    const modalProblem = document.getElementById("modalProblem");
    const modalSolution = document.getElementById("modalSolution");
    const modalQuote = document.getElementById("modalQuote");
    const modalFeatures = document.getElementById("modalFeatures");
    const modalMetricValue = document.getElementById("modalMetricValue");
    const modalMetricLabel = document.getElementById("modalMetricLabel");
    const modalMetricSublabel = document.getElementById("modalMetricSublabel");
    const galleryMainImg = document.getElementById("galleryMainImg");
    const galleryThumbs = document.getElementById("galleryThumbs");
    const modalTechGrid = document.getElementById("modalTechGrid");
    const modalLinkSection = document.getElementById("modalLinkSection");
    const modalLinkedInLink = document.getElementById("modalLinkedInLink");

    // Open Modal
    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const projectId = card.getAttribute("data-project-id");
            const data = projectsData[projectId];
            if (!data) return;

            // Populate Text
            modalSubtitle.textContent = data.subtitle;
            modalTitle.textContent = data.title;
            modalProblem.textContent = data.problem;
            modalSolution.textContent = data.solution;
            
            if (data.quote) {
                modalQuote.textContent = `“${data.quote}”`;
                modalQuote.style.display = "block";
            } else {
                modalQuote.style.display = "none";
            }

            // Features List
            modalFeatures.innerHTML = "";
            data.features.forEach(feat => {
                const li = document.createElement("li");
                li.textContent = feat;
                modalFeatures.appendChild(li);
            });

            // Metrics
            modalMetricValue.textContent = data.metric.value;
            modalMetricLabel.textContent = data.metric.label;
            modalMetricSublabel.textContent = data.metric.sublabel;

            // Tech Stack Grid
            modalTechGrid.innerHTML = "";
            for (const [key, value] of Object.entries(data.tech)) {
                const row = document.createElement("div");
                row.className = "modal-tech-row";
                row.innerHTML = `<span class="modal-tech-label">${key}</span><span class="modal-tech-value">${value}</span>`;
                modalTechGrid.appendChild(row);
            }

            // LinkedIn Link
            if (data.linkedin) {
                modalLinkedInLink.href = data.linkedin;
                modalLinkSection.style.display = "block";
            } else {
                modalLinkSection.style.display = "none";
            }

            // Screenshots Gallery
            galleryThumbs.innerHTML = "";
            if (data.screenshots && data.screenshots.length > 0) {
                // Set default main image
                galleryMainImg.src = data.screenshots[0];
                galleryMainImg.alt = data.title;

                // Create thumbnails
                data.screenshots.forEach((src, index) => {
                    const thumb = document.createElement("button");
                    thumb.className = `gallery-thumb-btn ${index === 0 ? 'active' : ''}`;
                    thumb.innerHTML = `<img src="${src}" alt="Screenshot preview">`;
                    
                    thumb.addEventListener("click", (e) => {
                        e.stopPropagation(); // prevent modal click handling
                        // Set main image
                        galleryMainImg.src = src;
                        
                        // Set active thumbnail
                        const allThumbs = galleryThumbs.querySelectorAll(".gallery-thumb-btn");
                        allThumbs.forEach(t => t.classList.remove("active"));
                        thumb.classList.add("active");
                    });

                    galleryThumbs.appendChild(thumb);
                });
                
                // Show gallery
                document.getElementById("modalGalleryContainer").style.display = "flex";
            } else {
                // Hide gallery
                document.getElementById("modalGalleryContainer").style.display = "none";
            }

            // Open Modal Overlay
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent body scroll
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable body scroll
    };

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeModal();
    });
    
    // Close on clicking overlay background
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });
});
