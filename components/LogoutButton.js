import { useRouter } from "next/navigation";

export default function LogoutButton({ onLogout }) {
  const router = useRouter();

  async function handleLogout() {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {
      onLogout?.(); // update state in Home
      router.refresh(); // refresh the page
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
