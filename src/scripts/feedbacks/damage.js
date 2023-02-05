export const damage = (x, y, amount) => {
  const $canvas = document.querySelector(".box-canvas");
  const $currentDamage = document.querySelectorAll(".damage");

  const $damage = document.createElement("div");
  $damage.classList.add("damage");
  $damage.style.left = `${x}px`;
  $damage.style.top = `${y}px`;
  $damage.innerHTML = `-${amount}`;
  $damage.style.zIndex = $currentDamage.length + 1;

  $canvas.appendChild($damage);

  setTimeout(() => {
    $damage.remove();
  }, 250);
};
