import { signOut } from "@/actions/signout";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      <strong>Session: </strong>
      {JSON.stringify(session, null, 2)}
      <form action={signOut}>
        <Button>Sign out</Button>
      </form>
    </div>
  );
}
