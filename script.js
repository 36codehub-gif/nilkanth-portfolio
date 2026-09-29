/* ==========================================
   MOBILE MENU
========================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");

        if (navMenu.classList.contains("active")) {
            menuToggle.textContent = "✕";
            menuToggle.setAttribute("aria-expanded", "true");
        } else {
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* ==========================================
   CLOSE MOBILE MENU AFTER CLICK
========================================== */

const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
});


/* ==========================================
   CURRENT YEAR
========================================== */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ==========================================
   RESUME DOWNLOAD
========================================== */

const resumeButtons = document.querySelectorAll(
    'a[href*="Nilkanth_Patel_Software_Engineer_Resume"]'
);

resumeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        console.log("Resume download started.");
    });
});


/* ==========================================
   CONTACT FORM
========================================== */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const submitButton =
            contactForm.querySelector('button[type="submit"]');

        const formData = {
            name: document.getElementById("name")?.value.trim(),
            email: document.getElementById("email")?.value.trim(),
            subject: document.getElementById("subject")?.value.trim(),
            message: document.getElementById("message")?.value.trim()
        };


        /* ------------------------------------------
           BASIC VALIDATION
        ------------------------------------------ */

        if (
            !formData.name ||
            !formData.email ||
            !formData.subject ||
            !formData.message
        ) {

            showFormMessage(
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        /* ------------------------------------------
           EMAIL VALIDATION
        ------------------------------------------ */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {

            showFormMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        /* ------------------------------------------
           BUTTON LOADING STATE
        ------------------------------------------ */

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }


        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Something went wrong."
                );
            }


            /* ------------------------------------------
               SUCCESS
            ------------------------------------------ */

            showFormMessage(
                "Message sent successfully! Thank you.",
                "success"
            );

            contactForm.reset();


        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            showFormMessage(
                "Unable to send message. Please try again later.",
                "error"
            );

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }

        }

    });
}


/* ==========================================
   FORM MESSAGE FUNCTION
========================================== */

function showFormMessage(message, type) {

    if (!formMessage) {
        return;
    }

    formMessage.textContent = message;

    formMessage.className =
        "form-message " + type;


    setTimeout(() => {

        formMessage.textContent = "";
        formMessage.className =
            "form-message";

    }, 5000);
}


/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-text, " +
    ".about-details, " +
    ".skill-card, " +
    ".project-card, " +
    ".profile-item, " +
    ".contact-box, " +
    ".contact-form"
);


if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observerInstance.unobserve(
                        entry.target
                    );
                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach((element) => {

        element.classList.add("reveal");

        observer.observe(element);

    });

} else {

    revealElements.forEach((element) => {
        element.classList.add("show");
    });

}


/* ==========================================
   ACTIVE NAVIGATION
========================================== */

const sections =
    document.querySelectorAll("section[id]");


function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 160;

        const sectionBottom =
            sectionTop + section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection =
                section.getAttribute("id");
        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");


        if (
            href === "#" + currentSection
        ) {

            link.classList.add("active");
        }

    });
}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


window.addEventListener(
    "load",
    updateActiveNavigation
);


/* ==========================================
   BACK TO TOP
========================================== */

const backToTop =
    document.querySelector(".back-to-top");


if (backToTop) {

    backToTop.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* ==========================================
   ESC KEY - CLOSE MOBILE MENU
========================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            navMenu &&
            navMenu.classList.contains("active")
        ) {

            navMenu.classList.remove("active");

            if (menuToggle) {
                menuToggle.textContent = "☰";
                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        }

    }
);
