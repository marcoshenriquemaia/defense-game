export const damage = (x, y, amount, _, id) => {
  const $canvas = document.querySelector(".box-canvas");
  const $currentDamage = document.querySelectorAll(".damage");

  if ($currentDamage.length > 50) return;

  const $damage = document.createElement("div");
  $damage.classList.add("damage");
  $damage.style.left = `${x}px`;
  $damage.style.top = `${y}px`;
  $damage.innerHTML = `-${amount}`;
  $damage.style.zIndex = $currentDamage.length + 1;
  $damage.id = id;

  $canvas.appendChild($damage);

  setTimeout(() => {
    $damage.remove();
  }, 250);
};
