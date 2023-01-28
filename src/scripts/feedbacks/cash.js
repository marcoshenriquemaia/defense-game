export const cash = ($canvas, x, y, amount) => {
  const $cash = document.createElement("div");
  $cash.classList.add("cash");
  $cash.style.left = `${x}px`;
  $cash.style.top = `${y}px`;
  $cash.innerHTML = `+${amount}`;

  $canvas.appendChild($cash);

  setTimeout(() => {
    $cash.remove();
  }, 1000);
};
