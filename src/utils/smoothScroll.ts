// Smooth scrolling utility
export const smoothScrollTo = (targetId: string) => {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 80, // Adjust for header height
      behavior: 'smooth'
    });
  }
};