document$.subscribe(() => {

    document.querySelectorAll(".md-nav__link").forEach(link => {
        if (link.textContent.trim() === "Home") {
            link.href = "https://quadcontrol.io";
        }
    });

    const logo = document.querySelector(".md-header__button.md-logo");
    if (logo) {
        logo.href = "https://quadcontrol.io";
    }

});