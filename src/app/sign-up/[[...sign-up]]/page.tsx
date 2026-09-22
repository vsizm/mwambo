import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="simple">
      <p className="eyebrow">MWAMBO</p>
      <h1>Create an account</h1>
      <p className="lead">Accounts are created through the secure identity provider. Editorial permissions are assigned separately in Mwambo.</p>
      <SignUp />
    </main>
  );
}
