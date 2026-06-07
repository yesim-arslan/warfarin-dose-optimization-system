let shouldOpenHomeMenu = false;

export const requestHomeMenuOpen = () => {
  shouldOpenHomeMenu = true;
};

export const consumeHomeMenuOpenRequest = () => {
  const requested = shouldOpenHomeMenu;
  shouldOpenHomeMenu = false;
  return requested;
};
