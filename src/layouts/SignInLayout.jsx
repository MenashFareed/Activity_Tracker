import React from "react";
import Logo from "../components/Logo";

function SignInLayout({ children }) {
  return (
      <div className="landing-page">
      <section className="logo">
        <Logo />
      </section>
      <section className="sign-in-form">
        {children}
      </section>
    </div>
  );
}

export default SignInLayout;
