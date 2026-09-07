/* ==========================================
   MOBILE MENU
========================================== */

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


menuToggle.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle(
            "active"
        );

        if (
            navMenu.classList.contains("active")
        ) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }

    }
);


/* ==========================================
   CLOSE MOBILE MENU AFTER CLICK
========================================== */

const navLinks =
    document.querySelectorAll(
        "#navMenu a"
    );


navLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                navMenu.classList.remove(
                    "active"
                );

                menuToggle.textContent =
                    "☰";

            }
        );

    }
);


/* ==========================================
   CURRENT YEAR
========================================== */

document.getElementById(
    "year"
).textContent =
    new Date().getFullYear();


/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements =
    document.querySelectorAll(
        ".section-heading, " +
        ".about-text, " +
        ".about-details, " +
        ".skill-card, " +
        ".project-card, " +
        ".profile-item, " +
        ".contact-box"
    );


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "show"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    (element) => {

        element.classList.add(
            "reveal"
        );

        observer.observe(
            element
        );

    }
);


/* ==========================================
   SMOOTH ACTIVE NAV
========================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(
            (section) => {

                const sectionTop =
                    section.offsetTop - 150;

                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    current =
                        section.getAttribute(
                            "id"
                        );
                }

            }
        );


        navLinks.forEach(
            (link) => {

                link.classList.remove(
                    "active"
                );

                if (
                    link.getAttribute(
                        "href"
                    ) === "#" + current
                ) {

                    link.classList.add(
                        "active"
                    );
                }

            }
        );

    }
);
