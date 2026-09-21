import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="simple">
      <p className="eyebrow">MWAMBO EDITORIAL</p>
      <h1>Sign in</h1>
      <p className="lead">Editorial access is restricted to authorised Mwambo contributors and reviewers.</p>
      <SignIn />
    </main>
  );
}
