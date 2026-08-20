customElements.get("text-animation") ||
  customElements.define(
    "text-animation",
    class extends HTMLElement {
      constructor() {
        super();
        this.bannerHeading = this.querySelector(".reveal__heading--title");

        if (!this.bannerHeading) {
          console.error("Element '.reveal__heading--title' not found.");
          return;
        }

        this.sanitizeText = Array.from(this.bannerHeading.innerText);
        this.initPages();
        window.addEventListener("scroll", this.handleScroll.bind(this));
        this.handleScroll();
      }

      initPages() {
        this.bannerHeading.innerText = ""; // Clear existing content

        this.sanitizeText.forEach((char) => {
          if (char === " ") {
            // Append a space as a text node
            this.bannerHeading.appendChild(document.createTextNode(" "));
          } else {
            // Wrap each character in a <span>
            const span = document.createElement("span");
            span.textContent = char;
            this.bannerHeading.appendChild(span);
          }
        });
      }

      handleScroll() {
        const spans = this.bannerHeading.querySelectorAll("span");

        spans.forEach((char) => {
          const rect = char.getBoundingClientRect();
          const topOffset = rect.top - window.innerHeight * 0.5;

          const opacityValue = Math.max(
            0,
            Math.min(1, 1 - (topOffset * 0.01 + rect.left * 0.001))
          );

          const translateY = Math.max(
            0,
            Math.min(1, 1 - (topOffset * 0.01 + rect.left * 0.001))
          );

          // Apply styles for animation
          char.style.opacity = opacityValue.toFixed(4);
          char.style.display = "inline-block";
          char.style.position = "relative";
          char.style.transform = `translate3d(0px, ${translateY.toFixed(
            4
          )}px, 0px)`;
        });
      }
    }
  );
