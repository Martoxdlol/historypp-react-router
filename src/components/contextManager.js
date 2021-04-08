import React, { createContext, useState } from "react";

export const NavContext = createContext();

export default ({ value, children }) => {
  return (
    <NavContext.Provider
      value={value}
    >
      {children}
    </NavContext.Provider>
  );
};
